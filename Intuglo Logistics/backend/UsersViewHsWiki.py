'''
Name  :  UsersViewHsWiki
Description  :  This API is used to display the HS Wiki page for all the users 
                such as customers,supplier and custom agent.
'''

import traceback
import sys
import falcon
import json
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__
from Tools import Tools
from SessionManagement import createSession

class UsersViewHsWikiResource__v1__(object):
    def on_get(self, req, resp):
        # Gets Hs Wiki data
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("SELECT hs_code_id, hs_code_header, hs_code_sub, hs_code_item, tax_export, tax_import, description, gst_percentage, '' AS Unit , '' AS TRQ, '' AS OLD_HS\
                            FROM hs_code")
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = row
                resp.status = falcon.HTTP_200
                result_json = json.dumps(list_values, sort_keys=True, default=str)
                resp.body = result_json

            else:
                resp.status = falcon.HTTP_204
                message = {"message": "HS Wiki details not found"}
                result_json = json.dumps(message)
                resp.body = result_json

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()
