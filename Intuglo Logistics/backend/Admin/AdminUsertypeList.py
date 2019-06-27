'''
Name   :   AdminUsertypeList
Usage  :   Get the list of users based on their usertype
Description : This API is used to display list of user based on usertype.
'''

import traceback
import sys
import json
import simplejson as json
import falcon
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from collections import OrderedDict


class AdminUsertypeListResource__v1__(object):
    def on_get(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_400
                Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Error)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()

            # usertype : 1-Supplier, 2-Customer, 3-Custom Agent 
            # Query to display data from this tbl
            cursor.execute("select user_type,user_type_name from user_types")   
            row = cursor.fetchall()
            if (cursor.rowcount > 0):
                list_values = row
                resp.status = falcon.HTTP_200
                result_json = json.dumps(list_values,sort_keys=True,default=str)
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                message = {"message": "Usertype is not found"}
                result_json = json.dumps(message)
                resp.body = result_json         

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()


