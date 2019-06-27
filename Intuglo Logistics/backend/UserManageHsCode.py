'''
Name   :   UserManageHsCode
Usage  :   A get function to display HS CODE SET
Description : This API returns HS CODE SET with a passed parameter of HS CODE.
            It interacts with the table hs_code_set_list.
'''

import traceback
import sys
import json
import simplejson as json
import falcon
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions


class UserManageHsCodeResource__v1__(object):
    def on_get(self, req, resp, login_id, session, hs_code):
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
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            list_of_hs_code_query = ("SELECT hs_code_set \
                                    FROM hs_set \
                                    WHERE hs_code = '"+hs_code+"'")
            cursor.execute(list_of_hs_code_query)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = row
                result_json = json.dumps(list_values)
                resp.status = falcon.HTTP_200
                resp.body = result_json
                
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Hs Code Set is not found"}
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