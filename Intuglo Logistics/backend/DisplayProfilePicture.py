'''
Name   :   DownloadProfilePicture
Usage  :   Get the profile picture by downloading it
Description : This code is used to display profile picture lists in
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
import os
from Tools import *
import IntugloApp


class DisplayProfilePictureResource__v1__(object):
    def on_get(self, req, resp, login_id, session, user_type):
        # try:
        #     # Authenticate login id and session availability.
        #     if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
        #         resp.status = falcon.HTTP_401
        #         Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
        #         result_json = json.dumps(Error)
        #         resp.body = result_json
        #         return
        # except ValueError as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        # except Exception as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            # Database Connection
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'serving-url-s3'")
            row = cursor.fetchone()
            serve = row['config_value']
            cursor.execute("select config_value from config where config_key = 's3-bucket-profilepic'")
            bucket = cursor.fetchone()
            BUCKET_NAME = bucket['config_value']
            file_name = ''
            if user_type == '1':
                cursor.execute("select logo from logistic_providers where login_id = '"+login_id+"'")
            elif user_type == '2':
                cursor.execute("select logo from customers where login_id = '"+login_id+"'")
            elif user_type == '3':
                cursor.execute("select logo from custom_agent where login_id = '"+login_id+"'")
            elif user_type == '0':
                cursor.execute("select logo from admin_profile where login_id = '"+login_id+"'")
            row = cursor.fetchone()
            if cursor.rowcount > 0:
                if row['logo'] == 'default.jpg':
                    serving_path = os.path.join(serve,BUCKET_NAME,'default.jpg')
                    result_json = json.dumps(serving_path)
                    resp.status = falcon.HTTP_200
                    resp.body = result_json
                else:
                    serving_path = os.path.join(serve,BUCKET_NAME,row['logo'])
                    resp.status = falcon.HTTP_200
                    resp.body = json.dumps(serving_path)
            else:
                resp.status = falcon.HTTP_204
                resp.body = json.dumps({'Status':'Error while displaying'})
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()