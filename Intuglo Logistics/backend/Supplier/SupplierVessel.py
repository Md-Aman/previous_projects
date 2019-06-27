'''
Name   :   SupplierVessel
Usage  :   Get details of vessel
Description : This code is used to display vessel lists in
              Intuglo Logistics website and interacts with
              the columns from route_vessel_view table.
'''
import traceback
import sys
import json
import simplejson as json
import falcon
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions


class SupplierVessel__v1__(object):
    def on_get(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        # try:
        #     if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
        #         resp.status = falcon.HTTP_401
        #         Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
        #         result_json = json.dumps(Error)
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
            route_list = ("select country_code_arrival,\
                            country_code_arvl_name,\
                            country_code_dep_name,\
                            country_code_departure,\
                            eta,\
                            etd,\
                            port_id_arrival,\
                            port_id_departure,\
                            port_name_arrival,\
                            port_name_departure,\
                            route_id,\
                            vessel_id,\
                            CONCAT(vessel_name,'/',vessel_no) as vessel_no from route_vessel_view")
            cursor.execute(route_list)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = row
                result_json = json.dumps(list_values,sort_keys=True,default=str)
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