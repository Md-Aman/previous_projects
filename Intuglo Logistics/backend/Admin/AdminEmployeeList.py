'''
Name   :  AdminEmployeeList
Usage  :   Get list of employees.
Description : This code is used to display lists of employees in Intuglo Logistics website and interacts with
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


class AdminEmployeeListResource__v1__(object):
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
            sql = ("select l.company_name, q.quotation_id, DATE_SUB(q.departure_date, INTERVAL 7 day) as etd\
                    from ship_quotations q\
                    join logistic_providers l on q.supplier_login_id = l.login_id\
                    where q.vessel_id = '"+vessel_id+"'")
            cursor.execute(sql)
            row = cursor.fetchall()


            if(cursor.rowcount > 0):
                list_values = row
                result_json = json.dumps(list_values, sort_keys=True,default=str)
                resp.status = falcon.HTTP_200
                resp.body = result_json
                
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Employee list is not found"}
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








































