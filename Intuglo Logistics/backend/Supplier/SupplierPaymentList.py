'''
Name   :  SupplierPaymentList
Usage  :   Get list of payments.
Description : This code is used to display lists in Intuglo Logistics website and interacts with
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


class SupplierPaymentListResource__v1__(object):
    def on_get(self, req, resp, login_id, session, vessel_id):
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
           
            # SQL to display list of payment
            sql = ("select DATE_FORMAT(o.booking_date,'%d/%m/%Y') as booking_date,o.created_on,\
                    q.quotation_id, o.order_id , c.customer_name, o.closing_price_total, o.closing_price_gst,\
                    q.supplier_login_id,q.vessel_id\
                    from ship_orders o\
                    JOIN ship_quotations q ON o.quotation_id = q.quotation_id\
                    JOIN logistic_providers l ON q.supplier_login_id = l.login_id\
                    JOIN customers c ON o.login_id = c.login_id\
                    where q.supplier_login_id = '"+login_id+"' and q.vessel_id = '"+vessel_id+"' and o.cargo_status_code = 'LOCKEDIN'")
            cursor.execute(sql)
            row = cursor.fetchall()


            if(cursor.rowcount > 0):
                list_values = row
                result_json = json.dumps(list_values,default=str)
                resp.status = falcon.HTTP_200
                resp.body = result_json
                
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Payment list is not found"}
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








































