## Setup and Data Preparation
# Import necessary libraries
import boto3
import pandas as pd
from datetime import datetime
from statsmodels.tsa.stattools import coint
import fastparquet
import io
import traceback

#variables
bucket = 'sector-corr-spreads'
pairs_file = 'raw/pairs_to_plot.csv'
stock_file = 'raw/close_1year.parquet'

#function load pairs data
def load_pairs_data(bucket, file):

    # Read existing historical data from S3
    s3 = boto3.client('s3')
    print(f"Reading from s3://{bucket}/{file}")
    
    obj = s3.get_object(Bucket=bucket, Key=file)
    pairs_df = pd.read_csv(io.BytesIO(obj['Body'].read()))
    print(f"Loaded {len(pairs_df)} pairs")
    
    return pairs_df

###--> LOAD DATA
#function load pairs data
def load_stock_data(bucket, file):

    # Read existing historical data from S3
    s3 = boto3.client('s3')
    print(f"Reading from s3://{bucket}/{file}")
    
    obj = s3.get_object(Bucket=bucket, Key=file)
    stock_df = pd.read_parquet(io.BytesIO(obj['Body'].read()))
    print(f"Total rows: {len(stock_df)}, Latest date: {stock_df.index.max()}")
    
    return stock_df

def fetch_datasets():

    pairs_to_plot = load_pairs_data(bucket, pairs_file) #load pairs data

    fetch_stock_data = load_stock_data(bucket, stock_file) #load stock data

    # Transform correlation data
    print('Generating correlation data')
    corr_data = fetch_stock_data.tail(252)
    corr_data_returns = corr_data.pct_change().dropna()
    corr_matrix = corr_data_returns.corr()
    print("Generated correlation Matrix")

    return pairs_to_plot, corr_data, corr_matrix

try:

    pairs_to_plot, corr_data, corr_matrix = fetch_datasets()
    print ("DATA LOADED!")

except Exception as e:
        error_msg = f"Error: {str(e)}"
        print(error_msg)
        traceback.print_exc()
        
        print(f'statusCode: 500 \n body: {error_msg}')

###--> GENERATE SPREADS AND CORRELATION DATA OUTPUT
def calculate_spread_and_zscore(stock1_data, stock2_data):

    # Normalize prices
    norm_s1 = stock1_data / stock1_data.iloc[0] * 100
    norm_s2 = stock2_data / stock2_data.iloc[0] * 100
    
    # Calculate spread
    spread = norm_s1 - norm_s2
    
    # Calculate z-score
    z_score = (spread - spread.mean()) / spread.std()
    
    return norm_s1, norm_s2, spread, z_score

def lambda_handler(event, context):
    try:
        # Load data
        pairs_df = load_pairs_data(bucket, pairs_file)
        stock_data = load_stock_data(bucket, stock_file)
        
        # Keep only last 252 days
        stock_data_252 = stock_data.tail(252)
        
        # Calculate current correlation matrix
        returns = stock_data_252.pct_change().dropna()
        corr_matrix = returns.corr()
        print("Generated correlation matrix")

        # NEW: Save correlation matrix to S3
        s3 = boto3.client('s3')
        
        corr_buffer = io.BytesIO()
        corr_matrix.to_parquet(corr_buffer, engine='fastparquet')
        corr_buffer.seek(0)
        
        s3.put_object(
            Bucket=bucket,
            Key='processed/correlation_matrix.parquet',
            Body=corr_buffer.getvalue()
        )
        print("Saved correlation matrix")
        
        # Process each pair
        current_signals = []
        s3 = boto3.client('s3')
        
        for idx, row in pairs_df.iterrows():
            stock1 = row['stock1']
            stock2 = row['stock2']
            
            print(f"Processing {stock1}/{stock2}")
            
            # Get stock data
            stock1_data = stock_data_252[stock1]
            stock2_data = stock_data_252[stock2]
            
            # Calculate spread and z-score
            norm_s1, norm_s2, spread, z_score = calculate_spread_and_zscore(stock1_data, stock2_data)
            
            # Build spread history dataframe
            spread_df = pd.DataFrame({
                'date': stock_data_252.index,
                'stock1_price': stock1_data,
                'stock2_price': stock2_data,
                'stock1_normalized': norm_s1,
                'stock2_normalized': norm_s2,
                'spread': spread,
                'z_score': z_score
            })
            
            # Save spread history to S3
            buffer = io.BytesIO()
            spread_df.to_parquet(buffer, engine='fastparquet')
            buffer.seek(0)
            
            s3.put_object(
                Bucket=bucket,
                Key=f'processed/spreads/{stock1}_{stock2}_spread_history.parquet',
                Body=buffer.getvalue()
            )
            print(f"Saved spread history for {stock1}/{stock2}")
            
            # Get current values
            current_z = z_score.iloc[-1]
            current_corr = corr_matrix.loc[stock1, stock2]

            score, pvalue, _ = coint(corr_data[stock1], corr_data[stock2])
            
            # Determine signal
            if current_z > 2:
                signal = f"SELL {stock1} / BUY {stock2}"
                signal_status = "DIVERGED"
            elif current_z < -2:
                signal = f"BUY {stock1} / SELL {stock2}"
                signal_status = "DIVERGED"
            else:
                signal = "NO SIGNAL"
                signal_status = "IN_RANGE"
            
            # Determine confidence tier (from stored p-value)
            #pvalue = row['coint_pvalue']
            if pvalue < 0.05:
                confidence = "high"
            elif pvalue < 0.10:
                confidence = "moderate"
            else:
                confidence = "low"
            
            # Build signal entry
            current_signals.append({
                'pair_id': f"{stock1}_{stock2}",
                'stock1': stock1,
                'stock2': stock2,
                'current_z_score': float(current_z),
                'signal': signal,
                'signal_status': signal_status,
                'correlation': float(current_corr),
                'coint_pvalue': float(pvalue),
                'coint_score': float(score),
                'confidence': confidence,
                'days_in_signal': 0,  # TODO: Calculate this
                'last_updated': datetime.now().isoformat()
            })

        current_signals_df = pd.DataFrame(current_signals)

        # Convert DataFrame to parquet bytes
        buffer = io.BytesIO()
        current_signals_df.to_parquet(buffer, engine='fastparquet')
        buffer.seek(0)

        s3.put_object(
            Bucket=bucket,
            Key='processed/signals/current_signals.parquet',
            Body=buffer.getvalue()
        )
        
        print(f"Processed {len(current_signals_df)} pairs successfully")
        print(f"Saved current signals")
        
        # NEW: Append to signal history for performance tracking
        today = pd.to_datetime(datetime.now().date())
        
        try:
            # Try to read existing signal history
            obj = s3.get_object(Bucket=bucket, Key='processed/signals/signal_history.parquet')
            signal_history = pd.read_parquet(io.BytesIO(obj['Body'].read()))
            print(f"Loaded {len(signal_history)} historical signal records")
        except:
            # If file doesn't exist, create empty DataFrame
            signal_history = pd.DataFrame(columns=[
                'date', 'pair_id', 'stock1', 'stock2', 'z_score', 
                'signal', 'signal_status', 'correlation', 'coint_pvalue', 
                'confidence'
            ])
            print("Created new signal history")
        
        # Add today's signals to history
        for sig in current_signals:
            new_record = pd.DataFrame([{
                'date': today,
                'pair_id': sig['pair_id'],
                'stock1': sig['stock1'],
                'stock2': sig['stock2'],
                'z_score': sig['current_z_score'],
                'signal': sig['signal'],
                'signal_status': sig['signal_status'],
                'correlation': sig['correlation'],
                'coint_pvalue': sig['coint_pvalue'],
                'confidence': sig['confidence']
            }])
            signal_history = pd.concat([signal_history, new_record], ignore_index=True)
        
        # Save updated history
        history_buffer = io.BytesIO()
        signal_history.to_parquet(history_buffer, engine='fastparquet')
        history_buffer.seek(0)
        
        s3.put_object(
            Bucket=bucket,
            Key='processed/signals/signal_history.parquet',
            Body=history_buffer.getvalue()
        )
        print(f"Saved {len(signal_history)} signal history records")
        
        return {
            'statusCode': 200,
            'body': f'Successfully processed {len(current_signals_df)} pairs'
        }
        
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        print(error_msg)
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'body': error_msg
        }
    

# For local testing
if __name__ == "__main__":
    result = lambda_handler({}, {})
    print(result)