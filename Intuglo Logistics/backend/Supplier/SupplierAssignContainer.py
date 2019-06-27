'''
Name  :  SupplierAssignContainer
Description  : This API is used to update the containerNo based on their containerID.
               It interacts with the container table.
'''

import falcon
import json
import traceback
import sys
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__


class SupplierAssignContainer__v1__(object):
    def on_patch(self, req, resp, login_id, session):
        #Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_400
                Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Error)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', err.args)
            
        
        try :
            # Reading Json
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            resultdict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Converting Json to List
            list_values = [v for v in resultdict_json.values()]
            container_id = list_values[0]
            container_no = list_values[1]
            print (container_id)
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Updating Container No
            cursor.execute("update ship_containers set container_no = '"+str(container_no)+"' where container_id = '"+str(container_id)+"'") 
            database_connection.commit()
            resp.status = falcon.HTTP_200
            message = {"Update": "Container number is updated"}
            result_json = json.dumps(message)
            resp.body = result_json

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            resp.status = falcon.HTTP_200
            message = {"Update": "Container number failed to be updated"}
            result_json = json.dumps(message)
            resp.body = result_json
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()