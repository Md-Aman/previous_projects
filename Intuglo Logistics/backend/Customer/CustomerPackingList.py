'''
Name   :   CustomerPackingList
Usage  :   Get details of order list in the packing list form
Description : This API is used to display and get the user details that has been filled up in the form. 
              The parameter that is required for this API is order ID.
'''


import traceback
import sys
import json
import simplejson as json
import falcon
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions


class CustomerPackingListResource__v1__(object):
    def on_get(self, req, resp, login_id, session, order_id):
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
            list_of_packing_query = ("select o.order_id, DATE_FORMAT(o.booking_date, '%d-%m-%Y') as booking_date, o.weight, o.cbm, o.consignor_company_name, consignee_company_name,\
                                    o.consignor_contact_person, o.consignee_contact_person, o.four_digit_hs_code, o.cargo_description,o.quantity,\
                                    o.tracking_number,o.bill_of_loading, o.packing_details, c.container_id, c.container_no,c.hs_code_id, \
                                    q.quotation_id,q.shipment_type_id, DATE_FORMAT(q.departure_date, '%d-%m-%Y') as departure_date, DATE_FORMAT(q.arrival_date, '%d-%m-%Y') as arrival_date,q.incoterm_code, q.shipper_type, rv.vessel_no, q.vessel_id,\
                                    q.consolidation , q.unstuffing, q.port_id_from, q.port_id_to, rv.port_name_departure, rv.port_name_arrival\
                                    from ship_orders o\
                                    left join ship_containers c on o.container_id = c.container_id\
                                    left join ship_quotations q on c.quotation_id = q.quotation_id\
                                    left join route_vessel_view rv on q.vessel_id = rv.vessel_id\
                                    where o.login_id ='" + login_id + "'")
            cursor.execute(list_of_packing_query)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = row
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