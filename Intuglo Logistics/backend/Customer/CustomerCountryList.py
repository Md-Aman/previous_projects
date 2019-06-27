'''
Name   :   CustomerCountryList
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


class CustomerCountryListResource__v1__(object):
    def on_get(self, req, resp, login_id, session):
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
            list_of_booking_query = ("select c.country, count(c.order_id) as CountOrder\
                                    from ship_customer_booking_list_view as c\
                                    join customers on c.login_id = customers.login_id\
                                    where cargo_status_code != 'ORDERBOOKED' and c.login_id ='" + login_id + "'\
                                    group by country\
                                    order by CountOrder desc")
            cursor.execute(list_of_booking_query)
            row = cursor.fetchall()
            list_values = list(row)
            result_json = json.dumps(list_values)
            resp.status = falcon.HTTP_200
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