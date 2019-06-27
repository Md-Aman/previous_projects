'''
Name    :   CustomerDashboardInit
Usage   :   Get Resource for Customer Dashboard
Description  :  This is a private Resource opens customer dashboard interacts with logins, users tables and checks session in memory.
'''

import falcon
import json
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__
import sys
import traceback


class CustomerDashboardInitResource__v1__(object):
    def on_get(self,req,resp,login_id,session):
        try:
            if (MemcacheFunctions.IsSessionValid(login_id,session) is False):
                resp.status = falcon.HTTP_401
                Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Err)
                resp.body = (result_json)
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as ex:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', ex.message)

        try:
            # Declaration
            list_values = list()
            # Database connection
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select customer_name from customers where login_id = '"+login_id+"'")
            row = cursor.fetchone()
            for x in row.values():
                list_values.append(x)
            if(cursor.rowcount > 0):
                database_connection.commit()
                customer_details = list_values
                columns = ['UserName']
                customer_detail_dictionary = dict(zip(columns,customer_details))
                # Json response
                resp.status = falcon.HTTP_200
                result_json = json.dumps(customer_detail_dictionary)
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
            
