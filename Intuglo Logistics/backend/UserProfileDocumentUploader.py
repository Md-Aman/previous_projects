'''
Name  : UserProfileUploader
Description  : To store,get and delete the file that has been uploaded to the database. 
            The table used is profile_documents.
'''

import falcon
import json
import traceback
import sys
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
import os
import aws_cred
import time

class UserProfileUploaderResource__v1__(object):
    # To display file uploaded from database
    def on_get(self, req, resp, login_id, session):
        #Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_401
                Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Error)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', err.args)
        
        try:
            # Database Connection
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select profile_documents_id,file_name,login_id \
                           from profile_documents \
                           where login_id='"+ login_id +"'")
            row = cursor.fetchall()
            if (cursor.rowcount > 0) :
                result_json = json.dumps(row,sort_keys=True)
                resp.status = falcon.HTTP_200
                resp.body = result_json
            else:
                # JSON response
                resp.status = falcon.HTTP_204
                result_json = json.dumps({"status":"No documents to list"})
                resp.body = (result_json)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()

    #  To delete file from database
    def on_patch(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_401
                Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Error)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as ex:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', ex.args)
        try :
           # Reading Json from Reslet
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            resultdict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Converting Json to List
            list_values = [v for v in resultdict_json.values()]
            profile_documents_id = list_values[0]
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 's3-bucket-profiledoc' ")
            bucket = cursor.fetchone()
            BUCKET_NAME = bucket['config_value']
            s3 = aws_cred.aws_s3(BUCKET_NAME)
            cursor.execute("select file_name from profile_documents where profile_documents_id ="+str(profile_documents_id)+"")
            row = cursor.fetchone()
            obj = s3.Object(BUCKET_NAME,os.path.join(login_id,row['file_name']))
            obj.delete()
            # Delete profile_documents_id
            cursor.execute("delete profile_documents from profile_documents where profile_documents_id ="+str(profile_documents_id)+"") 
            database_connection.commit()
            if(cursor.rowcount == 1):
                resp.status = falcon.HTTP_200
                resp.body = ("Delete Succesfull")
            else:
                resp.status = falcon.HTTP_204
                resp.body = ("Failed To Delete")
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()


    def on_post(self, req, resp,login_id,session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_401
                Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Error)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as ex:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', ex.args)

        try:
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            for item in req.params:
                if item=='documentUploader':
                    fileitem = req.get_param(item)
                    if(fileitem.file):
                        current_datetime = time.strftime("%y%m%d-%H%M%S")
                        append_to_new_file_name = os.path.basename(fileitem.filename)
                        file_name_without_ext = os.path.splitext(append_to_new_file_name)[0]
                        extension = os.path.splitext(append_to_new_file_name)[1]
                        new_file_name = file_name_without_ext+'_'+current_datetime+extension
                        path = "%s/%s"%(login_id,new_file_name)
                        cursor.execute("select config_value from config where config_key = 's3-bucket-profiledoc' ")
                        bucket = cursor.fetchone()
                        BUCKET_NAME = bucket['config_value']
                        s3 = aws_cred.aws_s3(BUCKET_NAME)
                        s3.Bucket(BUCKET_NAME).put_object(Key = path, Body= fileitem.file, ACL='public-read')
                        database_connection = get_db_connection()
                        cursor = database_connection.cursor()
                        args=(new_file_name,login_id)
                        cursor.execute("insert into profile_documents(file_name,login_id) \
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
            