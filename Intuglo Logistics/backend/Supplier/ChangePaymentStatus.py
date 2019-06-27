'''
Name   :   ChangePaymentStatus
Description : This API is used to change the booking status for custom based on desired status. 
            It uses the ship_orders table and ship_custom_status table for the availability of desired booking status.
'''

import traceback
import sys
import falcon
import json
from memcacheResource import MemcacheFunctions
from collections import OrderedDict
from Tools import Tools
from DatabaseConnection import *
from EmailTools import EmailTools


class ChangePaymentStatusResource__v1__(object):
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
            order_id = result_dictionary_json['order_id']
            old_status = result_dictionary_json['current_order_status_code']
            desired_status = result_dictionary_json['order_status_code']
            old_button_code = result_dictionary_json['current_button_code']
            database_connection = get_db_connection()
            cursor = database_connection.cursor()

            book_status_dict = Tools.PaymentStatus(desired_status,old_button_code)
            print(book_status_dict)
            book_status_list = book_status_dict['current_order_status']
            action_by = book_status_dict['action_by']
            if(old_status in book_status_list):
                print("Entering if")
                cursor.execute("select c.official_email\
                                    from ship_orders o\
                                    join customers c on o.login_id = c.login_id\
                                    WHERE o.order_id = '"+order_id+"'")
                row = cursor.fetchone()
                cursor.execute("select l.official_email\
                                from ship_orders o\
                                join ship_quotations q on o.quotation_id = q.quotation_id\
                                join logistic_providers l on q.supplier_login_id = l.login_id\
                                where o.order_id = '"+order_id+"'")
                supp_details = cursor.fetchone()
                Tools.ChangePaymentStatus(order_id,desired_status,cursor,database_connection)
                resp.status = falcon.HTTP_200
                resp.body = ("200")
                if(desired_status == 'CREDITDEDUCTED' and old_status == 'CONFIRMPAYMENTAMOUNT'):
                    EmailTools.paymentDeductedNotification(row['official_email'])
                if(desired_status == 'CREDITBLOCKED' and old_status == 'ORDERPLACED'):
                    EmailTools.approveCreditBlockedNotification(supp_details['official_email'])
            else:
                resp.status = falcon.HTTP_202
                resp.body = ("202")
                
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
