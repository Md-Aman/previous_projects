'''
Name  : OrderCsv
Usage : To display rest of the details based on the container id
Description  :  This code is used to get the order csv in Intuglo
                Logistics. It interacts with Orders table.
'''

import falcon
import json
import pymysql
from collections import OrderedDict
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
import traceback
import sys
from collections import OrderedDict

class OrderCsvResource__v1__(object):
    def on_get(self, req, resp, login_id, session, container_id):
        #Authenticate login id and session availability.
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
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', err.args)
        
        try:
            # Database Connection
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select o.consignor_company_name,o.consignor_email,c.container_no,o.order_id,o.duties_and_tax as zduties_and_tax\
                            from ship_orders as o\
                            inner join ship_containers as c on c.container_id = o.container_id \
                            where o.container_id= '"+str(container_id)+"'")
            row = cursor.fetchall()
            if (cursor.rowcount > 0):
                container_details = row
                result_json = json.dumps(container_details,default=str,sort_keys=True)
                resp.status = falcon.HTTP_200
                resp.body = result_json

            else:
                resp.status = falcon.HTTP_204
                message = {"message": "Container ID is not found in the database."}
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

   