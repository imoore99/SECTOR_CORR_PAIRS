## Function #3: Dashboard Data Preparation
# Transform parquet files to JSON for Tableau/API consumption

import boto3
import pandas as pd
import json
import io
import traceback

# Variables
BUCKET = 'sector-corr-spreads'

def parquet_to_json(s3_client, bucket, input_key, output_key):
    """Read parquet from S3, convert to JSON, write back to S3"""
    try:
        # Read parquet
        obj = s3_client.get_object(Bucket=bucket, Key=input_key)
        df = pd.read_parquet(io.BytesIO(obj['Body'].read()))
        print(f"Read {input_key}: {len(df)} rows")
        
        # Convert to JSON (orient='records' for array of objects)
        json_data = df.to_json(orient='records', date_format='iso')
        
        # Write JSON to S3
        s3_client.put_object(
            Bucket=bucket,
            Key=output_key,
            Body=json_data,
            ContentType='application/json'
        )
        print(f"Wrote {output_key}")
        
        return True
    except Exception as e:
        print(f"Error processing {input_key}: {str(e)}")
        return False

def lambda_handler(event, context):
    try:
        s3 = boto3.client('s3')
        
        # 1. Convert correlation matrix
        print("Converting correlation matrix...")
        parquet_to_json(
            s3, BUCKET,
            'processed/correlation_matrix.parquet',
            'dashboard/correlation_matrix.json'
        )
        
        # 2. Convert current signals
        print("Converting current signals...")
        parquet_to_json(
            s3, BUCKET,
            'processed/signals/current_signals.parquet',
            'dashboard/current_signals.json'
        )
        
        # 3. Convert signal history
        print("Converting signal history...")
        parquet_to_json(
            s3, BUCKET,
            'processed/signals/signal_history.parquet',
            'dashboard/signal_history.json'
        )
        
        # 4. Combine all spread files into one DataFrame
        print("Combining all spread files...")
        
        # List all spread files
        response = s3.list_objects_v2(
            Bucket=BUCKET,
            Prefix='processed/spreads/'
        )
        
        all_spreads = []
        spread_count = 0
        
        if 'Contents' in response:
            for obj in response['Contents']:
                key = obj['Key']
                
                # Skip if not a parquet file
                if not key.endswith('.parquet'):
                    continue
                
                # Extract pair name from filename
                # e.g., "processed/spreads/AXP_BAC_spread_history.parquet"
                filename = key.split('/')[-1]
                pair_id = filename.replace('_spread_history.parquet', '')
                
                # Read spread file
                obj_data = s3.get_object(Bucket=BUCKET, Key=key)
                spread_df = pd.read_parquet(io.BytesIO(obj_data['Body'].read()))
                
                # Add pair_id column
                spread_df['pair_id'] = pair_id
                
                # Append to list
                all_spreads.append(spread_df)
                spread_count += 1
                
                print(f"Loaded {pair_id}: {len(spread_df)} rows")
        
        # Combine all spreads into one DataFrame
        if all_spreads:
            combined_spreads = pd.concat(all_spreads, ignore_index=True)
            print(f"Combined {spread_count} spread files: {len(combined_spreads)} total rows")
            
            # Convert to JSON
            json_data = combined_spreads.to_json(orient='records', date_format='iso')
            
            # Write to S3
            s3.put_object(
                Bucket=BUCKET,
                Key='dashboard/all_spreads.json',
                Body=json_data,
                ContentType='application/json'
            )
            print("Wrote dashboard/all_spreads.json")
        else:
            print("No spread files found")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Successfully converted all files to JSON',
                'spread_files_combined': spread_count,
                'total_spread_rows': len(combined_spreads) if all_spreads else 0
            })
        }
        
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        print(error_msg)
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'body': json.dumps({'error': error_msg})
        }

# For local testing
if __name__ == "__main__":
    result = lambda_handler({}, {})
    print(result)