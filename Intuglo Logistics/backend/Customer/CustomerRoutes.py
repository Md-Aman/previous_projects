'''
Name  :  CustomerRoutes
Usage : A Get resource to get data from Post Booking resource to display country code/routes
        and reduce redundancy. This code interacts with ship_orders table, ship_quotations table
        and ports table.
'''


import sys
import traceback
import falcon
import json
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__


class CustomerRoutesResource__v1__(object):
    def on_get(self, req, resp, login_id, session):
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
            list_values = list()
            nested_list = list()
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute (" select distinct\
                            departure.country_code,arrival.country_code\
                            from ship_orders\
                            inner join ship_quotations ON ship_orders.quotation_id = ship_quotations.quotation_id\
                            inner join ports AS departure ON ship_quotations.port_id_from = departure.port_id\
                            inner join ports AS arrival ON ship_quotations.port_id_to = arrival.port_id\
                            where ship_orders.login_id='"+login_id+"'")
            row = cursor.fetchall()
            print(row)
            for x in row[0].values():
                list_values.append(x)
                print(list_values)
            if(cursor.rowcount > 0):
                columns = dict()
                nested_list.append(list_values)
                print(nested_list)
                columns['Routes'] = nested_list
                routes_detail_dictionary = columns
                print (routes_detail_dictionary)
                result_json = json.dumps(routes_detail_dictionary)
                resp.status = falcon.HTTP_200
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Routes is not found."}
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
