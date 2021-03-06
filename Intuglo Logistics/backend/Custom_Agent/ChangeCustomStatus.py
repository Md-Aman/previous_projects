'''
Name   :   ChangeCustomStatus
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

class ChangeCustomStatusResource__v1__(object):
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
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dictionary_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            order_id = result_dictionary_json['order_id']
            old_order_status = result_dictionary_json['current_order_status_code']
            old_button_code = 0
            desired_status = result_dictionary_json['order_status_code']
            

            # if (desired_status == 'CLEARINGCUSTOMDEPARTURE'):
            #     print("Entering if")
            #     book_status_dict = Tools.CustomStatus(desired_status,old_button_code)
            #     print(book_status_dict)
            #     if book_status_dict == 'STATUSNOTFOUND':
            #         resp.status = falcon.HTTP_204
            #         resp.body = ("204")
                # else:
                    # current_booking_status = book_status_dict['current_order_status']
                    # current_qt_status = book_status_dict['quotation_status']
                    # cursor.execute("select q.quotation_status\
                    #                 from ship_orders o\
                    #                 join ship_quotations q ON o.quotation_id = q.quotation_id\
                    #                 where order_id = '"+order_id+"'")
                    # row = cursor.fetchone()
                    
                    # if(old_order_status in current_booking_status):
                    #     if(row['quotation_status'] in current_qt_status):
                    
                        # else:
                        #     resp.status = falcon.HTTP_404
                        #     message = {"Message":"Quotation is not closed. Unable to change status."}
                        #     result_json = json.dumps(message)
                        #     resp.body = result_json
                    # else:
                    #     resp.status = falcon.HTTP_202
                    #     resp.body = ("202")

            
            # book_status_dict = Tools.CustomStatus(desired_status,old_button_code)
            cursor.execute("select o.custom_status_code, c.official_email\
                            from ship_orders o\
                            join ship_quotations q ON o.quotation_id = q.quotation_id\
                            join customers c on o.login_id = c.login_id\
                            where o.order_id = '"+order_id+"'")
            row = cursor.fetchone()
            Tools.ChangeCustomStatus(order_id,desired_status,cursor,database_connection)
            resp.status = falcon.HTTP_200
            message = {"Message":"Status is changed successfully."}
            result_json = json.dumps(message)
            resp.body = result_json
            if (desired_status == 'CARGOCLEAREDDEPARTURE' or desired_status == 'CARGOCLEAREDARRIVAL'):
                EmailTools.CargoSendingAndCustomClearEmailNotify(row['official_email'],12)
            # else:
                # book_status_list = book_status_dict['current_order_status']
                # if(old_order_status in book_status_list):
                # Tools.ChangeCustomStatus(order_id,desired_status,cursor,database_connection)
                # resp.status = falcon.HTTP_200
                # resp.body = ("200")
                
                # else:
                #     resp.status = falcon.HTTP_202
                #     resp.body = ("202")
          
                
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
