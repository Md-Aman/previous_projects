'''
Name   :   AdminCountryListReport
Usage  :   Get number of country list based on quotation status ACTIVE or CLOSED
Description : This code is used to display country lists in
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


class AdminCountryListReportResource__v1__(object):
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
            # Query to display these data frm multiple tbl
            country_list = ("select c.country_name as 'country_dep', c2.country_name as 'country_arrv'\
                            from ship_quotations as q\
                            join vessel as v on q.vessel_id = v.vessel_id\
                            join routes as r on v.route_id = r.route_id\
                            join ports as p on r.port_id_from = p.port_id\
                            join ports as p2 on r.port_id_to = p2.port_id\
                            join countries as c on p.country_code = c.country_code\
                            join countries as c2 on p2.country_code = c2.country_code\
                            where q.quotation_status ='ACTIVE' or q.quotation_status = 'CLOSED'")
            cursor.execute(country_list)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = row
                # Convert the dict value to json string format
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