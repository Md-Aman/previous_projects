'''
Name   :   CustomAgentCountryList
Usage  :   Get list of country
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


class CustomAgentCountryListResource__v1__(object):
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
            # Query to display departure from this tbl with given custom_agent_login_id
            list_of_booking_query_departure = ("select country_code_departure,country_departure \
                                    from ship_custom_agent_quotation_booking_view \
                                    union \
                                    select country_code_arrival,country_arrival \
                                    from ship_custom_agent_quotation_booking_view \
                                    where custom_agent_login_id ="+login_id+"")
            cursor.execute(list_of_booking_query_departure)
            country_list = cursor.fetchall()
            # Query to display arrival from this tbl with given custom_agent_login_id
            # list_of_booking_query_arrival = ("select country_code_arrival,country_arrival \
            #                         from ship_custom_agent_quotation_booking_view \
            #                         where custom_agent_login_id ="+login_id+"")
            # cursor.execute(list_of_booking_query_arrival) 
            # country_arv = cursor.fetchall()
            # country_list = dict()
            # country_list["country_list"]=list()
            if(cursor.rowcount > 0):
                # for x in country_dep:
                #    country_list["country_list"].append(x["departure"])
                # for y in country_arv:
                #     if y['arrival'] not in country_list['country_list']:
                #         country_list['country_list'].append(y['arrival'])
                # print(country_list)
                result_json = json.dumps(country_list,sort_keys=True)
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
        