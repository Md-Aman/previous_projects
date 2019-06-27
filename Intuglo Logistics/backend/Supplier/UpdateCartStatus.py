'''
Name  :  DeleteCartList
Description  : Delete and update the cart status with the given quotation ID.
               It interacts with the cart table.
'''

import falcon
import json
import traceback
import sys
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__


class UpdateCartStatusResource__v1__(object):
    def on_patch(self, req, resp, login_id, session):
        #Authenticate login id and session availability.
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
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', ex.args)
            
        try :
            # Reading Json
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            resultdict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Converting Json to List
            list_values = [v for v in resultdict_json.values()]
            cart_item_id = list_values[0]
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            database_connection.begin()
            """
            Deleting item from ship_temp_orders and carts_item
            """
            cursor.execute("delete from ship_temp_orders where cart_item_id = %s",(cart_item_id))
            cursor.execute("select transaction_fee,cart_id from carts_item where cart_item_id = %s",(cart_item_id))
            fee = cursor.fetchone()
            cursor.execute("delete from carts_item where cart_item_id = %s",(cart_item_id))
            
            """
            verifying if the carts item is empty. If empty then clear our all item in carts table
            """
            cursor.execute("select cart_id from carts_item where cart_id = "+str(fee['cart_id'])+" ")
            rowcount = cursor.fetchone()
            if rowcount:
                cursor.execute("update carts set amount = amount - "+str(fee['transaction_fee'])+",tax_amount = amount*(tax_rate/100), total_amount =  amount+tax_amount where cart_id = "+str(fee['cart_id'])+"")
            else:
                cursor.execute("update carts set amount = 0,tax_amount = 0, total_amount = 0,tax_rate = 0,tax_type = '' where cart_id = "+str(fee['cart_id'])+"")
            database_connection.commit()
            if cursor.rowcount is 1:
                resp.status = falcon.HTTP_200
                message = {"Reason": "This item has been deleted."}
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