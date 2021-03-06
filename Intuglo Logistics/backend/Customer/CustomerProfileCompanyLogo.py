'''
Name   :   DownloadSupplierQuotation
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

class CustomerProfileCompanyLogo__v1__(object):
    def on_get(self, req, resp, login_id, session):
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
            profile_path = {}
            # Getting Absolute Path Of Quotation's from DB
            # Tools.py - Contains GetQuotationFilePath() to extract Paths from config table
            profile_path = Tools.GetProfileFilePath()
            # os.chdir(quotation_path['quotation_files'])
            # Changing Working Directory to Quotations Path
            sys.path.append(profile_path['profile_files'])
            # Serving URL
            cursor.execute("select config_value from config where config_key = 'serving-url-link'")
            row = cursor.fetchall()
            # Getting File-Name 
            serve = row[0]['config_value']
            cursor.execute("select logo from customers where login_id = '"+login_id+"' ")
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                filename    = row[0]['logo']
                # Joining ServeURL , API, and Filename
                # For API_PATH Declaration Please Refer IntugloAPP
                # http://localhost:8000/quotations*
                #        *SERVE_URL*    *API_PATH*
                result_json = os.path.join(serve,'logo',filename)
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