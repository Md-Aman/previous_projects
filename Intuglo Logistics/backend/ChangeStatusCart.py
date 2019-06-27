'''
Name  :  ChangeStatusCart
Description  : Change order and cart status to paid if the current status is unpaid
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


class ChangeStatusCartResource__v1__(object):
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
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dictionary_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            row = list()
            # Check the quotation status
            for x in result_dictionary_json:
                cursor.execute("select status from carts where order_id = '"+x['order_id']+"' and cart_id = "+str(x['cart_id'])+"")
                temp = cursor.fetchall()
                temp[0]['order_id'] = x['order_id']
                temp[0]['cart_id'] = x['cart_id']
                row.append(temp[0])
            if (cursor.rowcount > 0):
                for y in row:
                    if (y['status']== "UNPAID"):
                        # Update quotation status
                        cursor.execute("update carts ,ship_orders\
                                        set carts.status ='PAID',ship_orders.cargo_status_code = 'ORDERPLACED'\
                                        where ship_orders.order_id = '"+y['order_id']+"' and carts.cart_id = "+str(y['cart_id'])+"")
                        database_connection.commit()
                        resp.status = falcon.HTTP_200
                        message = {"Update": "Cart status is updated"}
                        result_json = json.dumps(message)
                        resp.body = result_json
                    else:
                        resp.status = falcon.HTTP_400
                        Err = {"Reason": "Payment not completed."}
                        result_json = json.dumps(Err)
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