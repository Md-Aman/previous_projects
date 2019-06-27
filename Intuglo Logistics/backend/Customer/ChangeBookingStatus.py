'''
Name   :   ChangeBookingStatus
Description : This code is used to change the booking status based on desired status. 
            It uses the ship_orders table and ship_order_status table for the availability of desired booking status.
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


class ChangeBookingStatus__v1__(object):
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
            order_id = list_values[0]
            old_status = list_values[1]
            old_button_code = list_values[2]
            desired_status = list_values[3]
    
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select s.official_email\
                            from ship_orders o\
                            join ship_quotations q on o.quotation_id = q.quotation_id\
                            join logistic_providers s on q.supplier_login_id = s.login_id\
                            where o.order_id = '"+order_id+"'")
            row = cursor.fetchone()
            supplier_email = row['official_email']
            cursor.execute("select c.official_email,o.payment_id\
                            from ship_orders o\
                            join ship_quotations q on o.quotation_id = q.quotation_id\
                            join customers c  on o.login_id = c.login_id\
                            where o.order_id = '"+order_id+"'")
            row = cursor.fetchone()
            customer_email = row['official_email']
            paymentID = row['payment_id']
            print(old_status)
            print(desired_status)

            if (desired_status == 'CARGOSENT') :
                print("inside cargo")
                book_status_dict = Tools.CargoStatus(desired_status,old_button_code)
                current_booking_status = book_status_dict['current_order_status']
                current_payment_status = book_status_dict['payment_status']
                button_code_list = book_status_dict['future_button_code']
                print("before payment execute")
                cursor.execute("select payment_status_code from ship_orders where order_id = '"+order_id+"'")
                row = cursor.fetchone()
                if(old_status in current_booking_status):
                    index_code = current_booking_status.index(old_status)
                    print(current_payment_status)
                    if(row['payment_status_code'] in current_payment_status):
                        print(current_payment_status)
                        print("Before Tools")
                        Tools.ChangeBookingStatus(order_id,desired_status,button_code_list[index_code],cursor,database_connection)
                        print("After tools")
                        resp.status = falcon.HTTP_200
                        message = {"Message":"Status is changed successfully."}
                        result_json = json.dumps(message)
                        resp.body = result_json
                        EmailTools.CargoSendingAndCustomClearEmailNotify(supplier_email,7)
                        
                    else:
                        print("else")
                        resp.status = falcon.HTTP_404
                        message = {"Message":"Creditblocked is not approved."}
                        result_json = json.dumps(message)
                        resp.body = result_json
                else:
                    resp.status = falcon.HTTP_202
                    resp.body = ("202")

            elif (desired_status =='CARGOREADYFORPICKUP'):
                book_status_dict = Tools.CargoStatus(desired_status,old_button_code)
                current_booking_status = book_status_dict['current_order_status']
                current_payment_status = book_status_dict['payment_status']
                button_code_list = book_status_dict['future_button_code']
                cursor.execute("select payment_status_code from ship_orders where order_id = '"+order_id+"'")
                row = cursor.fetchone()

                if(old_status in current_booking_status):
                    index_code = current_booking_status.index(old_status)
                    print(current_payment_status)
                    if(row['payment_status_code'] in current_payment_status):
                        print(current_payment_status)
                        print("Before Tools")
                        Tools.ChangeBookingStatus(order_id,desired_status,button_code_list[index_code],cursor,database_connection)
                        print("After tools")
                        resp.status = falcon.HTTP_200
                        message = {"Message":"Status is changed successfully."}
                        result_json = json.dumps(message)
                        resp.body = result_json
                    else:
                        print("else")
                        resp.status = falcon.HTTP_404
                        message = {"Message":"Creditblocked is not approved."}
                        result_json = json.dumps(message)
                        resp.body = result_json
                else:
                    resp.status = falcon.HTTP_202
                    resp.body = ("202")

            elif (desired_status == 'CARGOSHIPPED'):
                book_status_dict = Tools.CargoStatus(desired_status,old_button_code)
                current_booking_status = book_status_dict['current_order_status']
                current_payment_status = book_status_dict['payment_status']
                button_code_list = book_status_dict['future_button_code']
                cursor.execute("select payment_status_code from ship_orders where order_id = '"+order_id+"'")
                row = cursor.fetchone()
                row1 =row['payment_status_code']
                print(row1)
                if(old_status in current_booking_status):
                    index_code = current_booking_status.index(old_status)
                    print(current_payment_status)
                    if(row['payment_status_code'] in current_payment_status):
                        print(current_payment_status)
                        print("Before Tools")
                        Tools.ChangeBookingStatus(order_id,desired_status,button_code_list[index_code],cursor,database_connection)
                        print("After tools")
                        resp.status = falcon.HTTP_200
                        message = {"Message":"Status is changed successfully."}
                        result_json = json.dumps(message)
                        resp.body = result_json
                    else:
                        print("else")
                        resp.status = falcon.HTTP_404
                        message = {"Message":"CreditDeducted is not approved."}
                        result_json = json.dumps(message)
                        resp.body = result_json
                else:
                    resp.status = falcon.HTTP_202
                    resp.body = ("202")

            elif(desired_status == 'LOCKEDIN'):
                print(desired_status)
                # hardcoded_email = "misshanyn@gmail.com"
                book_status_dict = Tools.CargoStatus(desired_status,old_button_code)
                book_status_list = book_status_dict['current_order_status']
                print(book_status_list)
                button_code_list = book_status_dict['future_button_code']
                action_by = book_status_dict['action_by']
                print("before if 1")
                if(old_status in book_status_list):
                    index_code = book_status_list.index(old_status)
                    print("before tools changebookingstatus")
                    Tools.ChangeBookingStatus(order_id,desired_status,button_code_list[index_code],cursor,database_connection)
                    EmailTools.FinalShipmentConfirmationEmailNotify(order_id,email)
                    print("After emailtools")
                    resp.status = falcon.HTTP_200
                    resp.body = ("200")
                elif desired_status == "ORDERDROPPED":
                    Tools.ChangeBookingStatus(order_id,desired_status,'16777215',cursor,database_connection)
                    resp.status = falcon.HTTP_200
                    resp.body = ("200")
                else:
                    resp.status = falcon.HTTP_202
                    resp.body = ("202") 
               
            else:
                book_status_dict = Tools.CargoStatus(desired_status,old_button_code)
                book_status_list = book_status_dict['current_order_status']
                print(book_status_list)
                button_code_list = book_status_dict['future_button_code']
                action_by = book_status_dict['action_by']
                if(old_status in book_status_list):
                    index_code = book_status_list.index(old_status)
                    Tools.ChangeBookingStatus(order_id,desired_status,button_code_list[index_code],cursor,database_connection)
                    resp.status = falcon.HTTP_200
                    resp.body = ("200")
                    if(desired_status == 'ORDERPLACED'):
                        EmailTools.UponOrderEmailNotify(customer_email,paymentID)
                elif desired_status == "ORDERDROPPED":
                    Tools.ChangeBookingStatus(order_id,desired_status,'16777215',cursor,database_connection)
                    resp.status = falcon.HTTP_200
                    resp.body = ("200")
                else:
                    resp.status = falcon.HTTP_202
                    resp.body = ("202")
                
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally :
            cursor.close()
            database_connection.close()
