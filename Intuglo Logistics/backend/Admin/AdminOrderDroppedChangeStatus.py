'''
Name   :   AdminOrderDroppedChangeStatus
Usage  :   Admin can change the order status to ORDERDROPPED based on orderID 
Description : This code is used to change the order status in
              Intuglo Logistics website and interacts with
              the columns from orders table.
'''


import traceback
import sys
import falcon
import json
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from collections import OrderedDict
from Tools import Tools 
import pymysql


class AdminOrderDroppedChangeStatus__v1__(object):
    def on_patch(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id,session) == False):
                resp.status = falcon.HTTP_401
                message = {"status": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(message)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dictionary_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            order_id = [v for v in result_dictionary_json.values()]
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            if (len(order_id) is 1):
                cursor.execute("update ship_orders set order_status_code = 'ORDERDROPPED' where order_id = '"+order_id[0]+"'")
                database_connection.commit()
                resp.status = falcon.HTTP_200
                resp.body = ("200")
            else:
                resp.status = falcon.HTTP_204
                resp.body = ("204")
        except ValueError as err:
            raise resp.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise resp.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()