'''
Name  : Booking
Usage : Get Resource to auto populate the details based on login_id and order_id,
        Post Resource to create/insert order based on login_id,
        Patch Resource to update order based on login_id and order_id
Description  :  This code is used to get,post,update Booking order details information in Intuglo
                Logistics and interacts with logins, customers and orders table.
'''

import traceback
import sys
import falcon
import json
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from collections import OrderedDict
from decimal import Decimal
from Tools import Tools
from datetime import datetime


class BookingResource__v1__(object):
    def on_get(self, req, resp, login_id, session, order_id):
        # Authenticate login id and session availability.
        # try:
        #     if (MemcacheFunctions.IsSessionValid(login_id, session) == False):
        #         resp.status = falcon.HTTP_401
        #         Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
        #         result_json = json.dumps(Err)
        #         resp.body = (result_json)
        #         return
        # except ValueError as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        # except Exception as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        

        # Get order details based on the given order_id
        try:
             # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Query to display data from this tbl with given orderID parameter
            cursor.execute ("select o.login_id, o.quotation_id,o.consignor_company_name,o.consignor_contact_person,o.consignor_contact_number,\
                            o.consignor_email,o.consignor_delivery_address,o.consignor_merchandise_value, o.consignor_commercial_value,\
                            o.consignor_billing_address,o.consignor_shipper,o.consignee_company_name,o.consignee_contact_person,\
                            o.consignee_contact_number,o.consignee_email,o.consignee_delivery_address,o.consignee_merchandise_value,\
                            o.consignee_commercial_value,o.consignee_billing_address,o.consignee_shipper,o.hs_code_id,\
                            o.logistic_provider,a.agent_name as custom_broker,o.bill_of_loading,o.four_digit_hs_code,o.cargo_description,o.cbm,o.weight,\
                            o.packing_details,o.quantity,o.halal_status,o.tracking_number,DATE_FORMAT(o.booking_date, '%d/%m/%Y') AS booking_date,\
                            DATE_FORMAT(q.departure_date, '%d/%m/%Y') AS departure_date,DATE_FORMAT(q.arrival_date, '%d/%m/%Y') AS arrival_date,\
                            p1.port_name as port_from,p2.port_name as port_to,q.vessel,o.closing_price_a,o.closing_price_ba,o.closing_price_bd,o.closing_price_tax,o.closing_price_total,\
                            o.booking_price_a,o.booking_price_ba,o.booking_price_bd,o.booking_price_tax as booking_price_tax_rate,o.booking_price_tax,o.booking_price_tax_amount,o.booking_price_total,o.booking_fee_tax_type,o.booking_fee_tax_rate,o.booking_price_tax_type, \
                            s.packing_type_description,q.halal_unstuffing,q.halal_consolidation,q.unstuffing,q.consolidation,lo.company_name,\
                            c1.customer_name,c1.address_line_one,c1.address_line_two,c1.country_code,c1.postal_code,c1.mobile_no,c1.city,c1.state,v1.vessel_no,a.custom_agent_id\
                            from ship_orders o\
                            left join ship_quotations q on o.quotation_id = q.quotation_id\
                            left join vessel v1 on v1.vessel_id = q.vessel_id\
                            left join ports as p1 on p1.port_id = q.port_id_from\
                            left join ports as p2 on p2.port_id = q.port_id_to\
                            left join hs_code as hs on o.hs_code_id = hs.hs_code_id\
                            left join custom_agent a on o.custom_agent_id = a.custom_agent_id\
                            left join ship_packing_types as s on s.packing_type_id = o.packing_details\
                            left join logistic_providers as lo on q.supplier_login_id = lo.login_id\
                            left join customers as c1 on c1.login_id = o.login_id\
                            where o.order_id= '"+order_id+"' ")
            row = cursor.fetchone()
            if (cursor.rowcount > 0):
                resp.status = falcon.HTTP_200
                result_json = json.dumps(row,sort_keys=True,default=str)
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                Err = {"Reason": "Booking with this Order ID is not found."}
                result_json = json.dumps(Err)
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

    def on_post(self, req, resp, login_id, session,order_id):
        # Authenticate login id and session availability.
        # try:
        #     if (MemcacheFunctions.IsSessionValid(login_id,session) == False):
        #         resp.status = falcon.HTTP_401
        #         Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
        #         result_json = json.dumps(Err)
        #         resp.body = result_json
        #         return
        # except ValueError as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        # except Exception as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        # checks whether the user is_on_boarded, in order to create an order
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Query to display data from this tbl with given loginID parameter
            cursor.execute("select is_on_boarded from logins where login_id = '"+login_id+"'")
            row = cursor.fetchone()
            if(row['is_on_boarded'] == 0):
                resp.status = falcon.HTTP_204
                Err = {"Reason": "Please complete your profile"}
                result_json = json.dumps(Err)
                resp.body = (result_json)
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()

        # If the user is valid and is_on_boarded, proceeds to create an order
        try:
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            bookings = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # cart_id = req.get_param('cart_id')
            cart_id = order_id
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Query to display merchant from this tbl w given loginID parameter
            # cursor.execute("SELECT merchant_id\
            #                 FROM logins\
            #                 WHERE login_id = "+login_id+"")
            # merchant_id_dict = cursor.fetchone()
            # merchant_id = merchant_id_dict['merchant_id']
            # Query to dispay data from this tbl with given quotationID JSON parameter
            # cursor.execute("SELECT p1.country_code as port_from,p2.country_code as port_to\
            #                 FROM ship_quotations as q\
            #                 INNER JOIN ports as p1 on p1.port_id = q.port_id_from\
            #                 INNER JOIN ports as p2 on p2.port_id = q.port_id_to\
            #                 WHERE q.quotation_id = '"+bookings['quotation_id']+"'")
            # port_to_from_dict = cursor.fetchone()
            # port_from = port_to_from_dict['port_from']
            # port_to = port_to_from_dict['port_to']
            # Query to display configVal from this tbl w configKey criteria
            cursor.execute("select config_value from config where config_key = 'logistic-booking-fee'")
            row = cursor.fetchone()
            booking_fee = row['config_value']
            # Query to display configVal from this tbl w configKey criteria
            cursor.execute("select config_value from config where config_key = 'logistic-booking-fee-description'")
            row = cursor.fetchone()
            fee_description = row['config_value']

            cursor.execute("select config_value from config where config_key = 'platform-tax_type'")
            row = cursor.fetchone()
            tax_type = row['config_value']

            cursor.execute("select config_value from config where config_key = 'platform-tax_rate'")
            row = cursor.fetchone()
            tax_rate = row['config_value']

            # Query to display cartID from this tbl w given loginID parameter
            # cursor.execute("select cart_id from carts where login_id = "+login_id+"")
            # row = cursor.fetchone()
            # if cursor.rowcount is 1:
            #     cart_id = row['cart_id']
            # else:
            #     # Query to create new cart
            #     cursor.execute("insert into carts(login_id) values(%s)",login_id)
            #     database_connection.commit()
            #     cart_id = cursor.lastrowid
            todayDate = datetime.today()
            database_connection.begin()
            cursor.execute("insert into carts_item(cart_id,transaction_description,transaction_fee,platform_id,status) values (%s,%s,%s,%s,%s)",(cart_id,fee_description,booking_fee,'1','UNPAID'))
            cart_item_id = cursor.lastrowid
            cursor.execute("update carts as c1 \
                            set c1.amount = c1.amount+ "+str(booking_fee)+"\
                            ,c1.tax_type = '"+str(tax_type)+"'\
                            ,c1.tax_rate = "+str(tax_rate)+"\
                            ,c1.tax_amount = (c1.amount*(c1.tax_rate/100))\
                            ,c1.total_amount = c1.amount + c1.tax_amount\
                            where c1.cart_id = "+str(cart_id)+"")
            order_id_new = Tools.GetOrderID(bookings['quotation_id'],cursor,database_connection)
            price_without_tax = float(bookings['booking_price']) - float(bookings['booking_tax_amount'])
            arguments =     (order_id_new,
                            cart_item_id,
                            cart_id,
                            login_id,
                            bookings['quotation_id'],
                            bookings['hs_code_id']['hs_code'] if type(bookings['hs_code_id']) is OrderedDict else bookings['hs_code_id'],
                            'ORDERBOOKED',
                            bookings['container_id'],
                            bookings['consignor_company_name'],
                            bookings['consignor_contact_person'],
                            bookings['consignor_contact_number'],
                            bookings['consignor_email'],
                            bookings['consignor_delivery_address'],
                            bookings['consignor_billing_address'],
                            bookings['consignor_shipper'],
                            bookings['four_digit_hs_code'],
                            bookings['halal_status'],
                            bookings['cargo_description'],
                            bookings['consignor_merchandise_value'],
                            bookings['consignor_commercial_value'],
                            bookings['consignee_merchandise_value'],	
                            bookings['consignee_commercial_value'],
                            bookings['consignee_company_name'],
                            bookings['consignee_contact_person'],
                            bookings['consignee_contact_number'],
                            bookings['consignee_email'],
                            bookings['consignee_delivery_address'],
                            bookings['consignee_billing_address'],
                            bookings['consignee_shipper'],
                            bookings['cbm'],
                            todayDate,
                            todayDate,
                            bookings['booking_price_total'],
                            bookings['booking_price_ba'],
                            bookings['booking_price_bd'],
                            bookings['booking_tax_rate'],
                            bookings['booking_tax_amount'],
                            bookings['booking_tax_type'],
                            bookings['booking_price'],
                            price_without_tax,
                            bookings['booking_tax_rate'],
                            bookings['booking_tax_amount'],
                            bookings['booking_tax_type'],
                            bookings['quantity'],
                            bookings['tracking_number'],
                            bookings['logistic_freight_provider'],
                            bookings['packing_details'],
                            bookings['customBroker'],
                            bookings['billing_of_loading'],
                            'UNPAID',
                            booking_fee,
                            fee_description,
                            bookings['weight'],
                            tax_type,
                            tax_rate)
            
            # Query to create new data in cartItems
            cursor.execute("insert into ship_temp_orders(temp_order_id ,\
                                                        cart_item_id,\
                                                        cart_id ,\
                                                        login_id,\
                                                        quotation_id,\
                                                        hs_code_id,\
                                                        cargo_status_code,\
                                                        container_id,\
                                                        consignor_company_name,\
                                                        consignor_contact_person,\
                                                        consignor_contact_number,\
                                                        consignor_email,\
                                                        consignor_delivery_address,\
                                                        consignor_billing_address,\
                                                        consignor_shipper,\
                                                        four_digit_hs_code,\
                                                        halal_status,\
                                                        cargo_description,\
                                                        consignor_merchandise_value,\
                                                        consignor_commercial_value,\
                                                        consignee_merchandise_value,\
                                                        consignee_commercial_value,\
                                                        consignee_company_name,\
                                                        consignee_contact_person,\
                                                        consignee_contact_number,\
                                                        consignee_email,\
                                                        consignee_delivery_address,\
                                                        consignee_billing_address,\
                                                        consignee_shipper,\
                                                        cbm,\
                                                        booking_date,\
                                                        confirmation_date,\
                                                        booking_price_a,\
                                                        booking_price_ba,\
                                                        booking_price_bd,\
                                                        booking_price_tax,\
                                                        booking_price_tax_amount,\
                                                        booking_price_tax_type,\
                                                        booking_price_total,\
                                                        booking_price_total_wo_tax,\
                                                        closing_price_tax,\
                                                        closing_price_tax_amount,\
                                                        closing_price_tax_type,\
                                                        quantity,\
                                                        tracking_number,\
                                                        logistic_provider,\
                                                        packing_details,\
                                                        custom_agent_id,\
                                                        bill_of_loading,\
                                                        booking_fee_payment_status,\
                                                        transaction_fee,\
                                                        transaction_description,\
                                                        weight,\
                                                        booking_fee_tax_type,\
                                                        booking_fee_tax_rate)\
            values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",arguments)
            database_connection.commit()
            if cursor.rowcount > 0 :
                resp.status = falcon.HTTP_200
                message = {"status":order_id_new}
                result_json = json.dumps(message)
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_406
                message = {"Status": "Order is failed to be created"}
                result_json = json.dumps(message)
                resp.body = result_json
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            database_connection.rollback()
            cursor.close()
            database_connection.close()




    def on_patch(self, req, resp, login_id, session, order_id):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id,session) == False):
                resp.status = falcon.HTTP_401
                Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Err)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)


        try:
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dictionary_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Get dict values from JSON passed parameter that contained multi keys
            list_values = [v for v in result_dictionary_json.values()]
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Query to update data from this tbl based on given JSON passed parameter
            query = ("update ship_orders set consignor_delivery_address='" + list_values[0] + "',four_digit_hs_code='" + list_values[1][:4] + "'," \
                    "cargo_description='"+list_values[2]+"',confirmation_date= CURRENT_TIMESTAMP(),"\
                    "consignor_merchandise_value='" + list_values[3] + "'"\
                    "where order_id ='"+order_id+"' and login_id ='"+login_id+"'")
            cursor.execute(query)
            database_connection.commit()
            if(cursor.rowcount > 0):
                resp.status = falcon.HTTP_200
                message = {"Update": "Booking order updated successfully"}
                result_json = json.dumps(message)
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204   
                message = {"Status": "Order is not found."}
                result_json = json.dumps(message)
                resp.body = result_json
            cursor.close()
            database_connection.close

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
