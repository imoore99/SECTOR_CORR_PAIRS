

import json
import boto3
from botocore.exceptions import ClientError

# S3 client
s3 = boto3.client('s3')
BUCKET_NAME = 'sector-corr-spreads'

def lambda_handler(event, context):
    """
    API Gateway Lambda handler for pairs trading data
    Serves JSON files from S3 dashboard folder
    """
    
    # CORS headers for all responses
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }
    
    try:
        # Extract path from API Gateway event
        path = event.get('rawPath', event.get('path', ''))
        http_method = event.get('httpMethod', event.get('requestContext', {}).get('http', {}).get('method', 'GET'))
        
        # Handle preflight OPTIONS requests
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': ''
            }
        
        # Route to appropriate endpoint
        if path == '/api/signals/current':
            return serve_json_file('dashboard/current_signals.json', cors_headers)
            
        elif path == '/api/signals/history':
            return serve_json_file('dashboard/signal_history.json', cors_headers)
            
        elif path == '/api/correlation':
            return serve_json_file('dashboard/correlation_matrix.json', cors_headers)
            
        elif path == '/api/spreads/all':
            return serve_json_file('dashboard/all_spreads.json', cors_headers)
            
        elif path == '/api/health':
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'status': 'healthy',
                    'endpoints': [
                        '/api/signals/current',
                        '/api/signals/history', 
                        '/api/correlation',
                        '/api/spreads/all',
                        '/api/health'
                    ]
                })
            }
            
        else:
            # 404 for unknown paths
            return {
                'statusCode': 404,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'error': 'Endpoint not found',
                    'path': path,
                    'available_endpoints': [
                        '/api/signals/current',
                        '/api/signals/history',
                        '/api/correlation', 
                        '/api/spreads/all',
                        '/api/health'
                    ]
                })
            }
            
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }

def serve_json_file(s3_key, cors_headers):
    """
    Read JSON file from S3 and return as API response
    """
    try:
        # Get object from S3
        response = s3.get_object(Bucket=BUCKET_NAME, Key=s3_key)
        json_content = response['Body'].read().decode('utf-8')
        
        # Validate JSON
        json_data = json.loads(json_content)
        
        return {
            'statusCode': 200,
            'headers': {
                **cors_headers,
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=300'  # 5 minute cache
            },
            'body': json_content  # Return raw JSON string
        }
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == 'NoSuchKey':
            return {
                'statusCode': 404,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'error': 'Data file not found',
                    'file': s3_key
                })
            }
        else:
            return {
                'statusCode': 500,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'error': 'S3 access error',
                    'details': str(e)
                })
            }
    
    except json.JSONDecodeError as e:
        return {
            'statusCode': 500,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({
                'error': 'Invalid JSON in data file',
                'file': s3_key,
                'details': str(e)
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({
                'error': 'Failed to serve data file',
                'file': s3_key,
                'details': str(e)
            })
        }