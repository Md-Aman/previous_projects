'''
Name  : Upload File
Usage : Post file and upload it to the server.
Description  : This code is used to upload file intended from user local's to the server.
                It will be store in a folder named Uploads and accepting all formats of documents.
                Accepted format: <in testing>
Pre-required : Need to create a folder named "uploads", unless the upload files would not work.
'''
import falcon
import json
import sys
import traceback
import os
from Quotation import QuotationResource__v1__
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from collections import OrderedDict
import aws_cred

class UploadFile__v1__(object):
    def on_post(self, req, resp):
        
        try:
            q_id = req.get_param('quotation_id')
            for item in req.params:
                if item=='quotationUploader':
                    fileitem = req.get_param(item)
                    if(fileitem.file):
                        fn = os.path.basename(fileitem.filename)
                        file_name_without_ext = os.path.splitext(fn)[0]
                        extension = os.path.splitext(fn)[1]
                        new_file_name = q_id
                        append_to_new_file_name = new_file_name+extension
                        path = "%s/%s"%(q_id,append_to_new_file_name)
                        database_connection = get_db_connection()
                        cursor = database_connection.cursor()
                        cursor.execute("select config_value from config where config_key = 's3-bucket-quotation'")
                        bucket = cursor.fetchone()
                        BUCKET_NAME = bucket['config_value']
                        s3 = aws_cred.aws_s3(BUCKET_NAME)

                        s3.Bucket(BUCKET_NAME).put_object(Key=path, Body=fileitem.file, ACL='public-read')
                        
                        cursor.execute("update ship_quotations set file_name = '"+append_to_new_file_name+"' \
                                        where quotation_id = '" + q_id + "'")
                        database_connection.commit()
                        if cursor.rowcount > 0:
                            resp.status = falcon.HTTP_200
                            message = {'Status': 'All files uploaded successfully'}
                            result_json = json.dumps(message)
                            resp.body = (result_json)
                        else:
                            resp.status = falcon.HTTP_400
                            message = {'Status': 'Failed to upload all files'}
                            result_json = json.dumps(message)
                            resp.body = (result_json)

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()