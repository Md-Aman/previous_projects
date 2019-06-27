'''
Name  : OrderCSV
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


class OrderCSV__v1__(object):
    def on_get(self, req, resp, login_id, session, container_id):
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
            database_connection = get_db_connection_list()
            cursor = database_connection.cursor()
            # Query to display data from this tbl with given orderID parameter
            cursor.execute ("select c.company_name,c.official_email,o.booking_date,o.confirmation_date,\
                            o.order_id,co.container_no,q.departure_date,q.arrival_date,p1.port_name as departure_port,p2.port_name as arrival_port,\
                            o.hs_code_id,o.halal_status,pa.packing_type_description,\
                            o.weight,o.cbm,o.tracking_number,o.consignor_merchandise_value,o.consignee_merchandise_value,\
                            o.consignor_commercial_value,o.consignee_commercial_value,o.cargo_status_code,o.cargo_status_code,o.final_price_payment,o.custom_declaration_form,o.buyer_documentation,\
                            o.duties_and_tax,o.custom_status_code\
                            from ship_containers co\
                            inner join ship_quotations q on q.quotation_id = co.quotation_id\
                            inner join ship_orders o on o.quotation_id = q.quotation_id\
                            inner join customers c on o.login_id = c.login_id\
                            left join ship_packing_types pa on pa.packing_type_id = o.packing_details\
                            inner join ports p1 on p1.port_id = q.port_id_from\
                            inner join ports p2 on p2.port_id = q.port_id_to\
                            where co.container_id = '"+str(container_id)+"'")
            row = cursor.fetchall()
            if (cursor.rowcount > 0):
                resp.status = falcon.HTTP_200
                result_json = json.dumps(row,default=str)
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                Err = {"Reason": "Container Not Found."}
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