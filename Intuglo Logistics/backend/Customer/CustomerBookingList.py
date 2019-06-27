'''
Name   :   CustomerBookingList
Usage  :   Get number of booking list
Description : This code is used to display booking lists in
              Intuglo Logistics website and interacts with
              the columns from multiple table.
'''


import traceback
import sys
import json
import simplejson as json
import falcon
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions


class CustomerBookingListResource__v1__(object):
    def on_get(self, req, resp, login_id, session):
        try:
            # Authenticate login id and session availability.
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
            list_of_booking_query = ("select c.login_id, c.order_id, c.quotation_id, c.booking_price_total,\
                                    c.closing_price_total, c.container_no, c.tracking_number,c.company_name as consignor_shipper, c.vessel, c.portFrom,\
                                    c.portTo, c.cargo_status_description, DATE_FORMAT(c.eta, '%d/%m/%Y') as eta, DATE_FORMAT(c.etd, '%d/%m/%Y') as etd,\
                                    c.country, c.button_code, o.cargo_status_code,o.payment_status_code,o.custom_status_code,c.incoterm_code,inco.cargo_pickup\
                                    from ship_customer_booking_list_view as c\
                                    join ship_orders as o on o.order_id = c.order_id\
                                    join ship_incoterms as inco on inco.incoterm_code = c.incoterm_code\
                                    where o.cargo_status_code != 'ORDERBOOKED' and c.login_id ='" + login_id + "'")
            cursor.execute(list_of_booking_query)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = row
                # If list of files available for order_id's then merge them together
                for x in list_values:
                    cursor.execute("SELECT file_name FROM ship_custom_documents where order_id = '"+x['order_id']+"'")
                    row = cursor.fetchall()
                    if(cursor.rowcount > 0):
                        x['document_name'] = row
                    else:
                        x['document_name'] = row
                result_json = json.dumps(list_values,sort_keys=True)
                resp.status = falcon.HTTP_200
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Booking is not found"}
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