import boto3

# Test S3 connection
s3 = boto3.client('s3')

# List buckets
response = s3.list_buckets()
print("✓ Connected to AWS!")
print("\nYour buckets:")
for bucket in response['Buckets']:
    print(f"  - {bucket['Name']}")

# Try to access your specific bucket
try:
    response = s3.list_objects_v2(Bucket='sector-corr-spreads', Prefix='raw/', MaxKeys=5)
    print("\n✓ Can access sector-corr-spreads bucket!")
    print("\nFiles in raw/ folder:")
    if 'Contents' in response:
        for obj in response['Contents']:
            print(f"  - {obj['Key']} ({obj['Size']} bytes)")
except Exception as e:
    print(f"\n✗ Error accessing bucket: {e}")