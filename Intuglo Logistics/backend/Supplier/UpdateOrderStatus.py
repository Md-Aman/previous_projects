'''
Name  :  UpdateOrderStatus
Description  : Gets customer order details and displays them.
Updates customer order details and saves them.
'''

import traceback
import sys
import falcon
import json
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__


class UpdateOrderStatusResource__v1__(object):
    def on_patch(self, req, resp, login_id, session):
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_401
                Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Error)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as ex:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', ex.message)
        # if Authentication true the code below runs
            
        
        try:
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dict_json = json.loads(raw_json,
                                          object_pairs_hook=OrderedDict,
                                          encoding='utf-8')
            list_values = [v for v in result_dict_json.values()]
            order_id = str(list_values[0])
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("update ship_orders set cargo_status_code='" + list_values[1] + "'\
                            where login_id = '"+login_id+"' and order_id ='"+order_id+"' ")
            database_connection.commit()
            resp.status = falcon.HTTP_200
            message = {"Update": "Customer order status is updated"}
            result_json = json.dumps(message)
            resp.body = result_json
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except mysql.connector.Error as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
            
