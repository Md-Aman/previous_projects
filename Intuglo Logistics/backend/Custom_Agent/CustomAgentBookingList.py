'''
Name   :   CustomAgentBookingList
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


class CustomAgentBookingListResource__v1__(object):
    def on_get(self, req, resp, login_id, session, quotation_id):
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
            # Query to display this data from this tbl with given qt_id
            list_of_booking_query = ("select c.order_id, ca.agent_name, o.duties_and_tax, l.verified_user\
                                    from ship_custom_agent_quotation_booking_view c\
                                    left join custom_agent ca ON ca.login_id = c.custom_agent_login_id\
                                    left join ship_orders o ON o.order_id = c.order_id\
                                    left join logins l ON l.login_id = c.custom_agent_login_id\
                                    where c.quotation_id ='"+quotation_id+"'")
            cursor.execute(list_of_booking_query)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = row
                # If list of files available for order_id's then merge them together
                # for x in list_values:
                #     cursor.execute("SELECT file_name FROM ship_custom_documents where order_id = '"+x['order_id']+"'")
                #     row = cursor.fetchall()
                #     if(cursor.rowcount > 0):
                #         x['document_name'] = row
                #     else:
                #         x['document_name'] = row
                result_json = json.dumps(list_values,sort_keys=True,default=str)
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