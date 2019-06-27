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
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from collections import OrderedDict
from Tools import Tools
import aws_cred
import time

class CustomerUploadCustomFile__v1__(object):
    def on_post(self, req, resp):
        try:
            order_id = req.get_param('orderId')
            for item in req.params:
                if item=='documentUploader':
                    fileitem = req.get_param(item)
                    if(fileitem.file):
                        fn = os.path.basename(fileitem.filename)
                        file_name_without_ext = os.path.splitext(fn)[0]
                        extension = os.path.splitext(fn)[1]
                        current_datetime = time.strftime("%Y%m%d%H%M%S")
                        append_to_new_file_name = file_name_without_ext+'_'+current_datetime+extension
                        path = "%s/%s"%(order_id,append_to_new_file_name)
                        database_connection = get_db_connection()
                        cursor = database_connection.cursor()
                        cursor.execute("select config_value from config where config_key = 's3-bucket-customdoc'")
                        BUCKET_NAME = cursor.fetchone()
                        s3 = aws_cred.aws_s3(BUCKET_NAME['config_value'])
                        s3.Bucket(BUCKET_NAME['config_value']).put_object(Key=path, Body=fileitem.file, ACL='public-read')
                        args=(append_to_new_file_name,order_id)
                        cursor.execute("insert into ship_custom_documents(file_name,order_id) \
                                        values(%s,%s)",args)
                        database_connection.commit()
            if cursor.rowcount is 1:
                resp.status = falcon.HTTP_200
                resp.body = ("200")
            else:
                resp.status = falcon.HTTP_204
                resp.body = ("204")

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()