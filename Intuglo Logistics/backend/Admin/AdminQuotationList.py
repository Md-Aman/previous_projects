'''
Name   :   AdminQuotationList
Usage  :   Get number of quotation list
Description : This code is used to display quotation lists in
              Intuglo Logistics website and interacts with
              the columns from multiple table.
'''

import traceback
import sys
import json
import falcon
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions


class AdminQuotationListResource__v1__(object):
    def on_get(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) == False):
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
            # Query to display data from this tbl w qt_status_id criteria
            list_of_quotation_list_query = ("select supplier_login_id, quotation_id, quotationStatus, portName,\
                                            DATE_FORMAT(departure_date, '%m-%d-%Y') as etd,\
                                            country, vessel, DATE_FORMAT(arrival_date, '%m-%d-%Y') as eta, container_no, quotation_status_id,\
                                            port_id_from, port_id_to, total_cbm, number_people_sharing, halal_status, total_weight \
                                            from ship_admin_quotation_list_view\
                                            where quotation_status_id = 'APPROVED' OR quotation_status_id = 'PENDINGAPPROVAL'")
            cursor.execute(list_of_quotation_list_query)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = list(row)
                resp.status = falcon.HTTP_200
                result_json = json.dumps(list_values, sort_keys=True, default=str)
                resp.body = result_json

            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Quotation is not found"}
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