import boto3
from botocore.client import Config


def aws_s3(bucket_loc): 
    ACCESS_KEY_ID = 'AKIAJQ3XBSOLDYG2CT4A'
    ACCESS_SECRET_KEY = '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'
    BUCKET_NAME = bucket_loc
    s3 = boto3.resource(
            's3',
        aws_access_key_id=ACCESS_KEY_ID,
        aws_secret_access_key=ACCESS_SECRET_KEY,
        config=Config(signature_version='s3v4')
    )
    return s3