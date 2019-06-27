'''
Name   :  SupplierOrderList
Usage  :   Get number of order list
Description : This code is used to display booking lists in
              Intuglo Logistics website and interacts with
              the columns from multiple table.
'''

import traceback
import sys
import simplejson as json
import json
import falcon
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions


class SupplierOrderListResource__v1__(object):
    def on_get(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_401
                Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Error)
                resp.body = result_json
                return

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            list_of_booking_query = ("select container_id, vessel, consignor_company_name, consignor_email, DATE_FORMAT(booking_date, '%d/%m/%Y') as bookingDate, DATE_FORMAT(confirmation_date, '%d/%m/%Y') as confirmDate, order_id,\
            container_no, portFrom, portTo, supplier_login_id, DATE_FORMAT(eta, '%d/%m/%Y') as ETA, DATE_FORMAT(etd, '%d/%m/%Y') as ETD, hs_code,\
            country, quotation_id, tracking_number, weight, cbm, merchant_value, commercial_value, cargo_status_code,button_code,cargo_status_description,payment_status_description,custom_status_description,payment_status_code,custom_status_code\
            from ship_logistic_providers_order_list_view\
            where supplier_login_id = '" + login_id + "'")
            cursor.execute(list_of_booking_query)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = list(row)
                resp.status = falcon.HTTP_200
                result_json = json.dumps(list_values)
                resp.body = result_json
                
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Order is not found"}
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