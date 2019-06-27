'''
Name   :   CustomAgentList
Usage  :   Get details of custom agent
Description : This code is used to display custom agents details in
              Intuglo Logistics website and interacts with
              the columns from custom_agent table.
'''

import traceback
import sys
import json
import simplejson as json
import falcon
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions


class CustomAgentList__v1__(object):
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
            # Query to display all data from this tbl w verifed_user is active
            agent_list = ("select * \
                        from custom_agent c\
                        left join logins l on l.login_id = c.login_id\
                        where l.verified_user =1")
            cursor.execute(agent_list)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = row
                result_json = json.dumps(list_values,sort_keys=True,default=str)
                resp.status = falcon.HTTP_200
                resp.body = result_json
                
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Custom Agent is not found"}
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