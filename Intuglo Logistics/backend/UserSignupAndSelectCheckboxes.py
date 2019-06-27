'''
Name    :   UserSignupAndSelectCheckBoxes
Usage   :   Get Resource for user's modules
Description  :  This API is to return the modules that the user has chosen during sign up.
                The account will be created also for the the modules that the user chooses.
'''

import falcon
import json
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__
import sys
import traceback


class UserSignupAndSelectCheckBoxesResource__v1__(object):
    def on_get(self, req, resp, login_id, session):
        try:
            if (MemcacheFunctions.IsSessionValid(login_id,session) is False):
                resp.status = falcon.HTTP_401
                Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Err)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as ex:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', ex.message)

        try:
            # Database connection
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select module1,module2,module3,module4,module5,module6,module7,module8\
                            from modules where login_id = '"+login_id+"'")
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = row
                result_json = json.dumps(list_values,sort_keys=True)
                resp.status = falcon.HTTP_200
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Module is not found"}
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
            
