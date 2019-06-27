'''
Name   :   AdminVesselByPortAndDeparture
Usage  :   Get number of route vessel list based on routeID
Description : This code is used to display route vessel lists in
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


class AdminVesselByPortAndDeparture__v1__(object):
    def on_get(self, req, resp, login_id, session, country_code):
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
            # Query to display data from this tbl w given routeID parameter
            country = country_code.split('-')
            print(country)
            total = {}
            route_list =("select port_name,port_id from ports where country_code = '"+str(country[0])+"' ")
            cursor.execute(route_list)
            row = cursor.fetchall()
            total['departure'] = row
            route_list =("select port_name,port_id from ports where country_code = '"+str(country[1])+"' ")
            cursor.execute(route_list)
            row = cursor.fetchall()
            total['arrival'] = row
            if(cursor.rowcount > 0):
                list_values = row
                result_json = json.dumps(total,sort_keys=True,default=str)
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