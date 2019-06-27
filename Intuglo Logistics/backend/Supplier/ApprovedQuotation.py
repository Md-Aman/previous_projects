'''
Name  : ApprovedQuotation
Description  : Update the quotation status with the given quotation ID.
               It interacts with the quotations table.
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


class ApprovedQuotationResource__v1__(object):
    def on_patch(self, req, resp, login_id, session, quotation_id):
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
        except Exception as ex:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', ex.message)
            
        
        try :
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Check the quotation status
            cursor.execute("select quotation_status from ship_quotations where quotation_id = '"+quotation_id+"'")
            row = cursor.fetchone()
            if (cursor.rowcount > 0):
                quotation_list = row
                if (quotation_list['quotation_status']== "PENDINGAPPROVAL"):
                    # Update quotation status
                    cursor.execute("update ship_quotations set quotation_status ='APPROVED'\
                                     where quotation_id = '"+quotation_id+"'")
                    database_connection.commit()
                    resp.status = falcon.HTTP_200
                    message = {"Update": "Quotation ID status is updated to approved."}
                    result_json = json.dumps(message)
                    resp.body = result_json
                else:
                    resp.status = falcon.HTTP_200
                    Err = {"Reason": "It is not requested for approval yet."}
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
            
