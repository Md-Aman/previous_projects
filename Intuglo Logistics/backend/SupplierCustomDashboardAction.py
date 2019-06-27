'''
Name  :  SupplierCustomDashboardAction
Usage : A get resource to return the status of users based on admin verification of supplier's profile.
Description  : This API returns the verified user's status from admin based on their profile. 
            If the admin has verified their profile, they can do action in their dashboard or otherwise.
'''

import falcon
import json
import sys
import traceback
import os
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__
from Tools import Tools
import IntugloApp


class SupplierCustomDashboardActionResource__v1__(object):
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
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            # user_type 1-Supplier 3-CustomAgent
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select verified_user from logins where login_id ='"+login_id+"'")
            row = cursor.fetchone()
            if cursor.rowcount > 0:
                resp.status = falcon.HTTP_200
                result_json = json.dumps(row)
                resp.body = (result_json)
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "User status is empty"}
                result_json = json.dumps(message)
                resp.body = (result_json)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
