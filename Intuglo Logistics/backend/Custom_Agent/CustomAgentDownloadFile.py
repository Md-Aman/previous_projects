'''
Name   :   CustomAgentDownloadFile
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
from Tools import *

class CustomAgentDownloadFileResource__v1__(object):
    def on_get(self, req, resp, login_id, session, order_id):
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
            # Database Connection
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Serving URL
            cursor.execute("select config_value from config where config_key = 'serving-url-s3'")
            row = cursor.fetchone()
            # Getting File-Name 
            serve = row['config_value']

            cursor.execute("select config_value from config where config_key = 's3-bucket-quotation'")
            row = cursor.fetchone()
            BUCKET_NAME = row['config_value']
            # Query to display filename from this tbl with given orderID
            cursor.execute("select file_name from ship_custom_agent_documents where order_id = '"+order_id+"' ")
            row = cursor.fetchone()
            if(cursor.rowcount > 0):
                filename = row['file_name']
                # Joining ServeURL , API, and Filename
                # For API_PATH Declaration Please Refer IntugloAPP
                # http://localhost:8000/quotations*
                #        *SERVE_URL*    *API_PATH*
                result_json = os.path.join(*[serve,BUCKET_NAME,order_id,filename])
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