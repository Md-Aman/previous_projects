'''
Name  :  RequestConfirmation
Description  : Supplier can change quotation status from DRAFT to PENDINGAPPROVAL
'''

import falcon
import json
import pymysql
import traceback
import sys
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__


class RequestForConfirmationResource__v1__(object):
    def on_patch(self, req, resp, login_id, session):
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
            
        
        try :
            # Reading Json
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            resultdict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Converting Json to List
            list_values = [v for v in resultdict_json.values()]
            quotation_id = list_values[0]
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Check the quotation status
            cursor.execute("select quotation_status from ship_quotations where quotation_id = '"+quotation_id+"'")
            row = cursor.fetchall()
            if (cursor.rowcount > 0):
                quotation_list = list(row)
                if (quotation_list[0]['quotation_status']== "DRAFT"):
                    # Update quotation status
                    cursor.execute("update ship_quotations set quotation_status ='PENDINGAPPROVAL'\
                                 where quotation_id = '"+quotation_id+"'")
                    database_connection.commit()
                    resp.status = falcon.HTTP_200
                    message = {"Update": "Quotation ID status is updated to pending approval."}
                    result_json = json.dumps(message)
                    resp.body = result_json
                else:
                    resp.status = falcon.HTTP_200
                    Err = {"Reason": "You are not allowed to change status of this quotation."}
                    result_json = json.dumps(Err)
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
            
