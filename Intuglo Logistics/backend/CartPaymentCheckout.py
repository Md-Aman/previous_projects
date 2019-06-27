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
import random
from PriceLeveraging import *
from Tools import *
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__


class CartPaymentCheckout__v1__(object):
    def on_patch(self, req, resp, login_id, session,cart_id):
        # try:
        #     if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
        #         resp.status = falcon.HTTP_401
        #         Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
        #         result_json = json.dumps(Error)
        #         resp.body = result_json
        #         return
        # except ValueError as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        # except Exception as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        # if Authentication true the code below runs
        try:
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dict_json = json.loads(raw_json,object_pairs_hook=OrderedDict,encoding='utf-8')
            # list_values = [v for v in result_dict_json.values()]
            print(result_dict_json)
            # cart_id = str(list_values[0])
            # cart_id = 1
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select * from ship_temp_orders where cart_id = '"+str(cart_id)+"'")
            cart_list = cursor.fetchall()
            check_pointer = True
            transaction_ref = "FXT" + str(random.randint(0,9))
            print("Entering Row")
            if (cursor.rowcount > 0):
                try:
                    database_connection.begin()
                    cursor.execute("insert into payments (transaction_id,payment_gateway,payment_tax_type,payment_tax_rate,payment_amount_wo_tax,payment_tax_amount,payment_amount_with_tax,payment_status,payment_type,payment_gateway_reciept)\
                    select '"+transaction_ref+"','PAYPAYL',tax_type,tax_rate,amount,tax_amount,total_amount,'"+str(result_dict_json['data']['state'])+"','BOOKING','"+json.dumps(result_dict_json['data'])+"' from carts where cart_id = '"+str(cart_id)+"'")
                    payment_id = cursor.lastrowid
                    print("Generating Payment_ID")
                    for carts in cart_list:
                        sql1 = "INSERT INTO ship_orders(order_id,booking_payment_id,quotation_id,login_id,hs_code_id,cargo_status_code,container_id,consignor_company_name,\
                        consignor_contact_person,consignor_contact_number,consignor_email,consignor_delivery_address,consignor_billing_address,\
                        consignor_shipper,four_digit_hs_code,halal_status,cargo_description,consignor_merchandise_value,consignor_commercial_value,\
                        consignee_merchandise_value,consignee_commercial_value,consignee_company_name,consignee_contact_person,\
                        consignee_contact_number,consignee_email,consignee_delivery_address,consignee_billing_address,consignee_shipper, \
                        weight,cbm,booking_date,confirmation_date,booking_price_a,booking_price_ba,booking_price_bd,booking_price_tax,booking_price_tax_type,booking_price_total,booking_price_total_wo_tax,booking_price_tax_amount,\
                        closing_price_tax_type,closing_price_tax,quantity,tracking_number,logistic_provider,packing_details,custom_agent_id,bill_of_loading,booking_fee_payment_status,button_code,booking_fee_tax_type,booking_fee_tax_rate)\
                        values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                        data1 = (str(carts['temp_order_id']),str(payment_id),carts['quotation_id'],carts['login_id'],carts['hs_code_id'],'ORDERPLACED',carts['container_id'],
                        carts['consignor_company_name'],carts['consignor_contact_person'],carts['consignor_contact_number'],carts['consignor_email'],carts['consignor_delivery_address'],
                        carts['consignor_billing_address'],carts['consignor_shipper'],carts['four_digit_hs_code'],carts['halal_status'],carts['cargo_description'],carts['consignor_merchandise_value'],
                        carts['consignor_commercial_value'],carts['consignee_merchandise_value'],carts['consignee_commercial_value'],carts['consignee_company_name'],carts['consignee_contact_person'],
                        carts['consignee_contact_number'],carts['consignee_email'],carts['consignee_delivery_address'],carts['consignee_billing_address'],carts['consignee_shipper'],
                        carts['weight'],carts['cbm'],carts['booking_date'],carts['confirmation_date'],carts['booking_price_a'],carts['booking_price_ba'],carts['booking_price_bd'],carts['booking_price_tax'],carts['booking_price_tax_type'],
                        carts['booking_price_total'],carts['booking_price_total_wo_tax'],carts['booking_price_tax_amount'],carts['closing_price_tax_type'],carts['closing_price_tax'],
                        carts['quantity'],carts['tracking_number'],carts['logistic_provider'],carts['packing_details'],carts['custom_agent_id'],carts['bill_of_loading'],'PAID','16777215',carts['booking_fee_tax_type'],carts['booking_fee_tax_rate'])
                        cursor.execute(sql1,data1)
                        print("Tranfer to Orders")
                        args2 = (carts['cbm'],carts['quotation_id'])
                        quotation_quert = ("update ship_quotations set total_people_per_shipment = total_people_per_shipment + 1,total_req_cbm_per_shipment = total_req_cbm_per_shipment + %s where quotation_id = %s")
                        cursor.execute(quotation_quert,args2)
                        cursor.execute("delete from ship_temp_orders where cart_item_id = %s",(carts['cart_item_id']))
                        cursor.execute("delete from carts_item where cart_item_id = %s",(carts['cart_item_id']))
                        PriveLeveraging(carts['quotation_id'],cursor)
                    cursor.execute("update carts set cart_status = 'PAID' where cart_id = "+str(cart_id)+"")
                    cursor.execute("insert into carts(login_id) VALUES ("+str(login_id)+")")
                    cart_id_new = cursor.lastrowid
                    cursor.execute("update customers set cart_id = "+str(cart_id_new)+" where cart_id = "+str(cart_id)+"")
                    database_connection.commit()
                    resp.status = falcon.HTTP_200
                    message = {"status":"Order Succesfully Placed","cart_id":cart_id_new}
                    result_json = json.dumps(message)
                    resp.body = result_json
                except Exception as err:
                    database_connection.rollback()
                    raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) ,err.args)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) ,err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) ,err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) ,err.args)
        finally:
            cursor.close()
            database_connection.close()
            
