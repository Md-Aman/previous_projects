'''
Name : HS_Wiki
Usage : Get Resource for HS_Wiki
Description : Gets the list of hs code from database and displays it on JSON dictionary format
'''

import sys
import traceback
import pymysql
import json
import falcon
from DatabaseConnection import *
from collections import OrderedDict
from Login import LoginResource__v1__
from memcacheResource import MemcacheFunctions


class HsWikiResource__v1__(object):
    def on_get(self, req, resp, login_id, session):
        # Authentication / Function call memcacheResource.py
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_401
                Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Err)
                resp.body = (result_json)
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        # If Authentication = true runs below
        try:
            # Database Connection
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            list_of_hscode = ("select hs_code_id as ID,CONCAT(hs_code_header,'.',hs_code_sub) AS Code,hs_code_sub AS SUB,description as 'Desc',cast(gst_percentage AS CHAR) as GST from hs_code")
            cursor.execute(list_of_hscode)
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                # Json response
                hs_code_detail_dictionary = row
                resp.status = falcon.HTTP_200
                result_json = json.dumps(hs_code_detail_dictionary,default=str,sort_keys=True)
                resp.body = (result_json)
            else:
                resp.status = falcon.HTTP_204
                message = {"message": "HSCode details not found"}
                result_json = json.dumps(message)
                resp.body = (result_json)

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
            
  