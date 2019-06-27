'''
Name  :  CustomAgentRoutes
Usage : A Get resource to display routes by country selection. The country should be written in generic format as in MY/CN .

'''


import sys
import traceback
import falcon
import json
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__


class CustomAgentRoutesResource__v1__(object):
    def on_get(self, req, resp, login_id, session, country):
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
            # Query to display data from this tbl w given country parameter
            route_list = ("SELECT DISTINCT country_code_departure,country_code_arrival \
                            FROM ship_custom_agent_quotation_booking_view \
                            where country_departure = '"+country+"' or country_arrival = '"+country+"'")
            cursor.execute(route_list)
            row = cursor.fetchall()  
            if(cursor.rowcount > 0):
                list_values = row
                for x in list_values:
                    country_dep = x.pop("country_code_departure")
                    country_arvl= x.pop("country_code_arrival")
                    x["country_code"] = "%s-%s"%(country_dep,country_arvl)
                result_json = json.dumps(list_values,sort_keys=True)
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

