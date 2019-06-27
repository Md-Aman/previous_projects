'''
Name   :  AdminPaymentFiltration
Usage  :   Get list of vessels(based on routes), routes(based on country and monthDate), country and monthDate. 
Description : This code is used to display multiple lists in Intuglo Logistics website and interacts with
              the columns from ship_admin_quotation_list_view table.
'''

import traceback
import sys
import simplejson as json
import json
import falcon
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions


class AdminPaymentFiltrationResource__v1__(object):
    def on_get(self, req, resp, login_id, session, month, country):
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
            date_splitter = month.split('-')
            print(date_splitter)
            # SQL to display country based on selected month
            sql = ("select distinct country from ship_admin_quotation_list_view where MONTH(departure_date) ='"+date_splitter[0]+"' and YEAR(departure_date) = '"+date_splitter[1]+"' and country_code_dep_name = '"+country+"'")
            cursor.execute(sql)
            row = cursor.fetchall()


            for x in row:
                # SQL to display route's details based on country
                cursor.execute("select distinct route_id,portName from ship_admin_quotation_list_view where country = '"+x['country']+"' and MONTH(departure_date) = '"+date_splitter[0]+"'")
                row1 = cursor.fetchall()
                x['route'] = row1
                
            for x in row:
                for y in x['route']:
                    # SQL to display vessel's details based on routes
                    cursor.execute("select distinct vessel_id,vessel_name from ship_admin_quotation_list_view where route_id = '"+str(y['route_id'])+"' ")
                    row1 = cursor.fetchall()
                    y['vessel'] = row1
            print(sorted(row))
            if(cursor.rowcount > 0):
                list_values = sorted(row)
                result_json = json.dumps(list_values, sort_keys=True)
                resp.status = falcon.HTTP_200
                resp.body = result_json
                
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Data is not found"}
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








































