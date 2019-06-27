'''
Name  :  CustomerInvoiceInit
Description  :  Gets customer orderID details and displays them. 
'''

import traceback
import sys
import falcon
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__
from Tools import Tools
import json


class CustomerInvoiceInit__v1__(object):
    def on_get(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_401
                Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Err)
                resp.body = (result_json)
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        # if Authentication true the code below runs
        # Gets Customer data
        try:
            # Declaration
            list_values = list()
            # DB connection
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select order_id from ship_orders where login_id = '" + login_id + "'")
            row = cursor.fetchone()
            if(cursor.rowcount > 0):
                for x in row.values():
                    list_values.append(x)
                order_details = list_values
                columns = ['OrderId']
                invoice_dictionary = dict(zip(columns,order_details))
                resp.status = falcon.HTTP_200
                result_json = json.dumps(invoice_dictionary)
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                result_json = json.dumps("Order Id not found")
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
            
            
