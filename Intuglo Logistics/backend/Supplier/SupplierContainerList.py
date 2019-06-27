'''
Name   :  SupplierContainerList
Usage  :   Get container list
Description : This code is used to display container lists in
              Intuglo Logistics website and interacts with
              the columns from multiple table which is containers and supplier_order_list_view.
'''

import traceback
import sys
import simplejson as json
import json
import falcon
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions


class SupplierContainerListResource__v1__(object):
    def on_get(self, req, resp, login_id, session, quotation_id):
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
            list_of_container_query = ("SELECT distinct s.container_id, s.container_no, s.quotation_id, c.number_people_sharing \
                                    FROM ship_logistic_providers_order_list_view s \
                                    LEFT JOIN ship_containers c on c.container_id = s.container_id \
                                    WHERE  s.quotation_id = '"+quotation_id+"'")
            cursor.execute(list_of_container_query)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = list(row)
                resp.status = falcon.HTTP_200
                result_json = json.dumps(list_values)
                resp.body = result_json
                
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Container is not found"}
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