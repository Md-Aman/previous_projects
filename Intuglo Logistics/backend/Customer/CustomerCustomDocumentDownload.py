'''
Name   :   CustomerCustomDocumentDownload
Usage  :   Get number of booking list
Description : This code is used to display booking lists in
              Intuglo Logistics website and interacts with
              the columns from multiple table.
'''


import traceback
import sys
import json
import simplejson as json
import falcon
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
import pymysql
import zipfile
import os
import shutil
from Tools import *
import boto3
from botocore.client import Config
import aws_cred

class CustomerCustomDocumentDownload__v1__(object):
    def on_get(self,req,resp,login_id,session,order_id):
        try:
            # Authenticate login id and session availability.
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_401
                Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Error)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select file_name from ship_custom_documents where order_id = '"+order_id+"' ")
            row = cursor.fetchall()
            filename = row
            cursor.execute("select config_value from config where config_key = 's3-bucket-customdoc'")
            bucket = cursor.fetchone()
            BUCKET_NAME = bucket['config_value']
            s3 = aws_cred.aws_s3(BUCKET_NAME)
            config_path = {}
            # Getting Absolute Path Of Quotation's from DB
            # Tools.py - Contains GetCustomFilePath() to extract Paths from config table
            config_path = Tools.GetCustomFilePath()
            # os.chdir(config_path['custom_files'])
            # Changing Working Directory to Custom Path
            sys.path.append(config_path['custom_files'])
            if(len(filename) > 1):
                cursor.execute("select config_value from config where config_key = 'serving-url-link'")
                row = cursor.fetchall()
                # Getting File-Name 
                serve = row[0]['config_value']
                os.mkdir(os.path.join(config_path['custom_files'],order_id))
                for x in filename:
                    print(x)
                    s3.Object(BUCKET_NAME, '%s/%s'%(order_id,x['file_name'])).download_file(os.path.join(config_path['custom_files'],order_id,x['file_name']))
                # Joining Custom Path with OrderID for filname.zip
                zipfilepath1 = os.path.join(config_path['custom_files'],'temp',order_id)
                zipfilepath = zipfilepath1 + ".zip"
                # Writing Files into ZIP
                with zipfile.ZipFile(zipfilepath, 'w') as myzip:
                    for f in filename:
                        os.chdir(os.path.join(config_path['custom_files'],order_id))
                        myzip.write(f['file_name'])
                # Joining ServeURL , API, and Filename
                # For API_PATH Declaration Please Refer IntugloAPP
                # http://localhost:8000/custom*
                #        *SERVE_URL*   *API_PATH*
                result_json = json.dumps(os.path.join(serve,'custom_zip',order_id+'.zip'))
                print(result_json)
                resp.status = falcon.HTTP_200
                resp.body = result_json
            elif(len(filename) is 1):
                cursor.execute("select config_value from config where config_key = 'serving-url-s3'")
                row = cursor.fetchall()
                # Getting File-Name 
                serve = row[0]['config_value']
                # Joining ServeURL , API, and Filename
                # For API_PATH Declaration Please Refer IntugloAPP
                # http://localhost:8000/custom*
                #        *SERVE_URL*   *API_PATH*
                result_json = json.dumps(os.path.join(*[serve,BUCKET_NAME,order_id,filename[0]['file_name']]))
                print(result_json)
                resp.status = falcon.HTTP_200
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                resp.body = ("204")
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
            shutil.rmtree(os.path.join(config_path['custom_files'],order_id),ignore_errors=True)