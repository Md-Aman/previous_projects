'''
Name   :   SupplierConfirmPayments
Description : This API is used to change the payment status to confirm payment amount. 
            It uses the ship_orders table for the availability of desired booking status.
'''

import traceback
import sys
import falcon
import json
from memcacheResource import MemcacheFunctions
from collections import OrderedDict
from Tools import Tools
from DatabaseConnection import *

class SupplierConfirmPaymentsResource__v1__(object):
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
            list_values = [v for v in result_dictionary_json.values()]
            supplier_login_id = list_values[0]
            vessel_id = list_values[1]

            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # SQL to update ship_quotations
            cursor.execute("select quotation_id from ship_quotations where supplier_login_id = '"+str(supplier_login_id)+"' and vessel_id = '"+str(vessel_id)+"' and quotation_status = 'LOCKEDIN'")
            row = cursor.fetchall()
            quotation_list = []
            for x in row:
                quotation_list.append(x['quotation_id'])
            tup_quotation_id = tuple(quotation_list)
            print(tup_quotation_id)
            sql1 = "UPDATE ship_quotations SET payment_status = 'CONFIRMED' where quotation_id IN %s"
            args1 = (tup_quotation_id,)
            cursor.execute(sql1,args1)
            database_connection.commit()
            # SQL to update ship_orders
            cursor.execute("select o.order_id from ship_orders o JOIN ship_quotations q ON o.quotation_id = q.quotation_id where q.supplier_login_id = '"+str(supplier_login_id)+"' and q.vessel_id = '"+str(vessel_id)+"' and quotation_status = 'LOCKEDIN'")
            row = cursor.fetchall()
            order_list = []
            for x in row:
                order_list.append(x['order_id'])
            tup_order_id = tuple(order_list)
            print(tup_order_id)
            sql2 = "UPDATE ship_orders SET payment_status_code = 'CONFIRMPAYMENTAMOUNT' where order_id IN %s and payment_status_code = 'CREDITBLOCKED'"
            args2 = (tup_order_id,)
            cursor.execute(sql2,args2)
            database_connection.commit()
            resp.status = falcon.HTTP_200
            message = {"Update": "Order status is updated to confirm payment amount."}
            result_json = json.dumps(message)
            resp.body = result_json
                           
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()