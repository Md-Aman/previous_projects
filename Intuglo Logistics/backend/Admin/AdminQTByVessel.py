'''
Name   :   AdminQTByVessel
Usage  :   Get number of quotation list based on vesselID
Description : This code is used to display quotation lists by the given vessel_ID in
              Intuglo Logistics website and interacts with
              the columns from admin_quotation_list_view table.
'''

import traceback
import sys
import json
import simplejson as json
import falcon
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions


class AdminQTByVessel__v1__(object):
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
            # Query to display all data from this tbl w given vesselID
            route_list = ("select *\
                        from ship_admin_quotation_list_view\
                        where vessel_id = '"+vessel_id+"'")
            cursor.execute(route_list)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = row
                supplier_name_list = list()
                ###
                """
                Data Structure Example:
                [
                    {
                        "one":[
                        {"arrival_date": "2018-08-18", "container_no": null, "country": "AU-MY", "country_code_arrival": "MY",…},
                        {"arrival_date": "2018-07-08", "container_no": null, "country": "AU-MY", "country_code_arrival": "MY",…},
                        {"arrival_date": "2018-08-05", "container_no": null, "country": "AU-MY", "country_code_arrival": "MY",…}
                        ]
                        },
                    {
                        "ahmas":[
                            {"arrival_date": "2018-08-18", "container_no": null, "country": "AU-MY", "country_code_arrival": "MY",…}
                            ]
                    }
                ]
                """
                ###
                # for x in list_values: #Iterating through the results fetched
                #     if any(x['supplier_name'] in d for d in supplier_name_list): # Keys will be searched in the list if exists return true
                #         for y in supplier_name_list:
                #             y[x['supplier_name']].append(x)
                #     else: # Creating key to based on supplier-name
                #         supplier_name_list.append({x['supplier_name']:[x]})
                result_json = json.dumps(list_values,sort_keys=True,default=str)
                resp.status = falcon.HTTP_200
                resp.body = result_json
                
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Quotation is not found"}
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

"""
Performance Imporvement for Data-Structure(Consideration)
https://stackoverflow.com/questions/12905999/python-dict-how-to-create-key-or-append-an-element-to-key
https://stackoverflow.com/questions/14790980/how-can-i-check-if-key-exists-in-list-of-dicts-in-python
https://stackoverflow.com/questions/12782344/dictionaries-inside-a-list-merging-values-for-the-same-keys?rq=1

"""