'''
Name   :   SupplierFilterList
Usage  :   Get number of vessel, quotation list
Description : This code is used to display vessel, quotation lists in
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


class SupplierFilterListResource__v1__(object):
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
            list_of_booking_query = ("select distinct s.vessel, s.quotation_id, DATE_FORMAT(s.eta, '%d/%m/%Y') as eta, DATE_FORMAT(s.etd, '%d/%m/%Y') as etd, s.portTo, s.portFrom, s.country, s.vessel_id, s.vessel_no\
                                    from ship_logistic_providers_order_list_view as s\
                                    join logistic_providers on s.supplier_login_id = logistic_providers.login_id\
                                    where s.supplier_login_id ='" + login_id + "'")
            cursor.execute(list_of_booking_query)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = list(row)
                result_json = json.dumps(list_values, sort_keys=True)
                resp.status = falcon.HTTP_200
                resp.body = result_json
                
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Country is not found"}
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