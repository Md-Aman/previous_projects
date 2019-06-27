'''
Name  :  PackingTypesList
Usage : A Get resource to get list of packing types from DB. This code interacts with ship_packing_types table.
'''


import sys
import traceback
import falcon
import json
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__


class PackingTypesListResource__v1__(object):
    def on_get(self, req, resp, login_id, session):
        # Authentication
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
            # Connect DB
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # SQL to display data from this tbl
            cursor.execute (" select packing_type_id, packing_type_description\
                            from ship_packing_types")
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                packing_types = row
                result_json = json.dumps(packing_types)
                resp.status = falcon.HTTP_200
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Packing list is not available"}
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
