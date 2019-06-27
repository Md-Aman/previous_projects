'''
Name  : UplaodProfilePicture
Usage : Post file and upload it to the server.
Description  : This code is used to upload file intended from user local's to the server.
                It will be store in a folder named Uploads and accepting all formats of documents.
                Accepted format: <in testing>
Pre-required : Need to create a folder named "uploads"->"profile_pictures" unless the upload files would not work.
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
import IntugloApp
import time
import aws_cred


class UploadProfilePictureResource__v1__(object):
    def on_post(self, req, resp):
        
        try:
            user_id = req.get_param('login_id')
            user_type = req.get_param('userType')
            upload_count = 0
            list_of_uploads = 0
            for item in req.params:
                if item=='profileUploader':
                    print("Entering IF")
                    print(user_type)
                    list_of_uploads += 1
                    fileitem = req.get_param(item)
                    if(fileitem.file):
                        fn = os.path.basename(fileitem.filename)
                        file_name_without_ext = os.path.splitext(fn)[0]
                        extension = os.path.splitext(fn)[1]
                        print(os.path.splitext(fn))
                        database_connection = get_db_connection()
                        cursor = database_connection.cursor()
                        cursor.execute("select config_value from config where config_key = 's3-bucket-profilepic' ")
                        bucket = cursor.fetchone()
                        BUCKET_NAME = bucket['config_value']
                        s3 = aws_cred.aws_s3(BUCKET_NAME)
                        # cursor.execute("select merchant_id from logins where login_id= '"+str(user_id)+"'")
                        # merchant = cursor.fetchone()
                        # new_file_name = merchant['merchant_id']
                        current_datetime = time.strftime("%Y%m%d%H%M%S")
                        append_to_new_file_name = user_id+current_datetime+extension
                        
                        if user_type == '1':
                            print("inside supplier")
                            cursor.execute("select logo from logistic_providers where login_id ='"+str(user_id)+"'")
                            logo = cursor.fetchone()
                        elif user_type == '2':
                            print("inside customer")
                            cursor.execute("select logo from customers where login_id ='"+str(user_id)+"'")
                            logo = cursor.fetchone()
                        elif user_type == '3':
                            print("inside custom agent")
                            cursor.execute("select logo from custom_agent where login_id ='"+str(user_id)+"'")
                            logo = cursor.fetchone()
                        

                        if logo['logo']!= 'default.jpg':
                            obj = s3.Object(BUCKET_NAME,os.path.join(logo['logo']))
                            obj.delete()
                            s3.Bucket(BUCKET_NAME).put_object(Key=append_to_new_file_name, Body=fileitem.file, ACL='public-read')
                        else:
                            s3.Bucket(BUCKET_NAME).put_object(Key=append_to_new_file_name, Body=fileitem.file, ACL='public-read')

                        
                        if user_type == '1':
                            print("inside supplier")
                            cursor.execute("update logistic_providers set logo = '"+append_to_new_file_name+"' where login_id = '"+user_id+"'")
                            database_connection.commit()
                        elif user_type == '2':
                            print("inside customer")
                            cursor.execute("update customers set logo = '"+append_to_new_file_name+"' where login_id = '"+user_id+"'")
                            database_connection.commit()
                        elif user_type == '3':
                            print("inside custom agent")
                            cursor.execute("update custom_agent set logo = '"+append_to_new_file_name+"' where login_id = '"+user_id+"'")
                            database_connection.commit()
                
            if cursor.rowcount > 0:
                resp.status = falcon.HTTP_200
                message = {'Status': 'Profile Picture uploaded successfully'}
                result_json = json.dumps(message)
                resp.body = (result_json)
            else:
                resp.status = falcon.HTTP_400
                message = {'Status': 'Failed to upload profile picture'}
                result_json = json.dumps(message)
                resp.body = (result_json)

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()