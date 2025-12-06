## Setup and Data Preparation
# Import necessary libraries
import boto3
import pandas as pd
import yfinance as yf
from datetime import datetime
import io
import traceback

tickers = [
    # Tech
    'AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA', 'AMD', 'ORCL', 'QCOM',
    # Financials  
    'JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'AXP',
    # Energy
    'XOM', 'CVX', 'COP', 'SLB', 'EOG',
    # Consumer Staples
    'KO', 'PEP', 'WMT', 'TGT', 'PG', 'KMB', 'COST', 'MCD', 'NKE',
    # Healthcare
    'JNJ', 'PFE', 'UNH', 'CVS', 'LLY',
    # Industrials/Discretionary
    'HD', 'LOW', 'DIS', 'NFLX', 'TSLA', 'DE'
]

today = datetime.now().date()

bucket = 'sector-corr-spreads'
prices_key = 'raw/close_1year.parquet'
period = '1d'

#function to call and store today's data
def current_data_fetch(tickers, period, today):
        
    #print status for fetching data
    print(f'Fetching ticker prices for {today}.')

    #fetch data
    data = yf.download(tickers, period=period, progress=False, auto_adjust=True)['Close']
    if data.empty:
        return {
                'statusCode': 400,
                'body': 'No data returned from yfinance (market closed?)'
            }
        
    #reshape data
    today_df = pd.DataFrame(data)
    today_df.index = [today]
    today_df.index.name = 'Date'

    # CRITICAL FIX: Convert index to datetime64 to match historical data
    today_df.index = pd.to_datetime(today_df.index)

    return today_df

#function to load data into s3 bucket
def load_data_to_s3_bucket(bucket, prices_key, today_df, today):

    # Read existing historical data from S3
    s3 = boto3.client('s3')
    print(f"Reading from s3://{bucket}/{prices_key}")

    obj = s3.get_object(Bucket=bucket, Key=prices_key)
    historical_df = pd.read_parquet(io.BytesIO(obj['Body'].read()))
    print(f"Historical data: {len(historical_df)} days, {len(historical_df.columns)} tickers")
    
    # Check if today's data already exists (avoid duplicates)
    if today in historical_df.index:
            print(f"Data for {today} already exists, skipping append")
            return {
                'statusCode': 200,
                'body': f'Data for {today} already exists'
            }
    

    # Append today's data
    updated_df = pd.concat([historical_df, today_df])
        
    print(f"Updated data: {len(updated_df)} days")

    # Write back to S3
    buffer = io.BytesIO()
    updated_df.to_parquet(buffer, engine='pyarrow')
    buffer.seek(0)
        
    s3.put_object(
            Bucket=bucket,
            Key=prices_key,
            Body=buffer.getvalue()
        )
        
    print(f"Successfully wrote to S3")

    return {
            'statusCode': 200,
            'body': f'Successfully appended {len(tickers)} prices for {today}. Total: {len(updated_df)} days'
        }

def lambda_handler(event, context):
    """Main Lambda handler function"""
    
    try:
        today = datetime.now().date()
        
        # Fetch today's data
        today_df = current_data_fetch(tickers, period, today)
        
        # Load to S3
        result = load_data_to_s3_bucket(bucket, prices_key, today_df, today)
        
        return result
        
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



        


