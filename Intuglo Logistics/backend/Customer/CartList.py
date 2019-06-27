'''
Name  :  CartList
Description  :  Gets details of the cart list and displays them.
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
from Tools import Tools


class CartList__v1__(object):
    def on_get(self, req, resp, login_id, session,cart_id):
        # Authenticate login id and session availability.
        # try:
        #     if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
        #         resp.status = falcon.HTTP_401
        #         Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
        #         result_json = json.dumps(Err)
        #         resp.body = result_json
        #         return
        # except ValueError as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        # except Exception as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # cart_id = req.get_param('cart_id')
            # cart_id = 1
            # cursor.execute("select cart_item_id from carts_item where login_id = '"+login_id+"'")
            # row = cursor.fetchone()
            # Query to display data from this table based on loginID passed paramete
            # cursor.execute("select config_value from config where config_key = 'platform-tax_type'")
            # row = cursor.fetchone()
            # tax_type = row['config_value']

            # cursor.execute("select config_value from config where config_key = 'platform-tax_rate'")
            # row = cursor.fetchone()
            # tax_rate = row['config_value']

            cursor.execute("select tax_type,tax_rate,amount,total_amount,tax_amount from carts where cart_id = '"+str(cart_id)+"'")
            carts_info = cursor.fetchone()

            cart_list = {}
            cursor.execute("select \
            company_name,\
            official_email,\
            office_phone,\
            address_line_one,\
            address_line_two,\
            city,\
            postal_code,\
            state, \
            country_name \
            from customers join countries on customers.country_code=countries.country_code \
            where login_id = "+login_id+"")
            customer_info = cursor.fetchone()
            
            # address_line_one = '' if customer_info['address_line_one'] is None or customer_info['address_line_one'] == '' else customer_info['address_line_one']+', '
            # address_line_two = '' if customer_info['address_line_two'] is None or customer_info['address_line_two'] == '' else customer_info['address_line_two']+', '
            # city = '' if customer_info['city'] is None or customer_info['city'] == '' else customer_info['city']+', '
            # state = '' if customer_info['state'] is None or customer_info['state'] == '' else customer_info['state']+', '
            # postal_code = '' if customer_info['postal_code'] is None or customer_info['postal_code'] == '' else customer_info['postal_code']+', '
            # country_name = '' if customer_info['country_name'] is None or customer_info['country_name'] == '' else customer_info['country_name']
            # customer_info['customer_address'] = "{} {} {} {} {} {}".format(address_line_one,address_line_two,city,state,postal_code,country_name)
            # customer_info.pop('address_line_one')
            # customer_info.pop('address_line_two')
            # customer_info.pop('city')
            # customer_info.pop('state')
            # customer_info.pop('postal_code')

            cursor.execute("select c.temp_order_id as order_id,\
                            p1.port_name as portFrom,\
                            p2.port_name as portTo,\
                            DATE_FORMAT(s.departure_date,\
                            '%d/%m/%Y') as ETD,\
                            DATE_FORMAT(s.arrival_date,\
                            '%d/%m/%Y') as ETA,\
                            c.cart_item_id, \
                            c.cbm, \
                            ct.transaction_description,\
                            ct.transaction_fee\
                            from ship_temp_orders as c \
                            left join ship_quotations s on s.quotation_id = c.quotation_id \
                            left join ports as p1 on s.port_id_from = p1.port_id \
                            left join ports as p2 on s.port_id_to = p2.port_id \
                            left join carts_item as ct on ct.cart_item_id = c.cart_item_id \
                            where c.cart_id = "+str(cart_id)+" and c.booking_fee_payment_status != 'DELETED' and c.booking_fee_payment_status != 'PAID'")
            row = cursor.fetchall()
            customer_info['cart_list'] = row
            customer_info['tax_type'] = carts_info['tax_type']
            customer_info['tax_rate'] = carts_info['tax_rate']
            customer_info['amount'] = carts_info['amount']
            customer_info['tax_amount'] = carts_info['tax_amount']
            customer_info['total_amount'] = carts_info['total_amount']
            if(cursor.rowcount > 0):
                resp.status = falcon.HTTP_200
                result_json = json.dumps(customer_info, sort_keys=True, default=str)
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                message = {"message": "cart details not found"}
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