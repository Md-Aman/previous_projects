'''
Name  : OrderCsv
Usage : This API is used to update the duties and tax for the orders if there is any changes of occurences.
        It requires the orderID to be updated.
Description  :  This code is used to get the order csv in Intuglo
                Logistics. It interacts with Orders table.
'''

import falcon
import json
import pymysql
from collections import OrderedDict
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
import traceback
import sys
from collections import OrderedDict

class UpdateOrderCsvResource__v1__(object):
    def on_patch(self, req, resp, login_id, session):
        #Authenticate login id and session availability.
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
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', err.args)
        
        try:
            # Database Connection
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dictionary_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            affected_row = list()
            for x in result_dictionary_json:
                affected_row.append(cursor.execute("UPDATE ship_orders SET duties_and_tax = "+str(x['duties_and_tax'])+" WHERE order_id = '"+x['order_id']+"'"))
            database_connection.commit()
            if 1 in affected_row:
                resp.status = falcon.HTTP_200
                Error = {"Reason": "Update success"}
                result_json = json.dumps(Error)
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_200
                Error = {"Reason": "Update Aborted"}
                result_json = json.dumps(Error)
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