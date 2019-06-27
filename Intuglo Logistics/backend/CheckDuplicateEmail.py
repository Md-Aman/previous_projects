'''
Name  :  CheckDuplicateEmail
Description  : To check if the email is existed in database
'''

import traceback
import sys
import falcon
import json
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from Tools import Tools


class CheckDuplicateEmail__v1__(object):
    def on_get(self, req, resp, email):
        try:
            list_values = list()
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select count(1) from logins where email = '"+email+"'")
            row = cursor.fetchone()
            if(cursor.rowcount > 0):
                for x in row.values():
                    list_values.append(x)
                isEmailExist = list_values
                resp.status = falcon.HTTP_200
                result_json = json.dumps(isEmailExist)
                resp.body = (result_json)
            else:
                resp.status = falcon.HTTP_204
                result_json = json.dumps("Email is not found")
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