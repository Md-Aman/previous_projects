'''
Name   :   AdminChangeQuotationStatus
Description : This code is used to change the quotation status based on desired status. 
            It uses the quotation table and quotation_status table for the availability of desired booking status.
'''

import traceback
import sys
import falcon
import json
from memcacheResource import MemcacheFunctions
from collections import OrderedDict
from Tools import Tools
from DatabaseConnection import *

class AdminChangeQuotationStatus__v1__(object):
    def on_patch(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id,session) == False):
                resp.status = falcon.HTTP_401
                message = {"status": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(message)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Get dictionary values from passed parameter JSON in list values. 
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dictionary_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # list values contains qtId, qtCurrentStatus and desiredStatus
            list_values = [v for v in result_dictionary_json.values()]
            quotation_id = list_values[0]
            quotation_current_status = list_values[1]
            quotation_desired_status = list_values[2]
            if len(list_values) is 3:
                quotation_status_dict = Tools.QuotationStatus(quotation_desired_status,quotation_current_status)
                quotation_status_list = quotation_status_dict['current_quotation_status']
                if(quotation_current_status in quotation_status_list):
                    Tools.ChangeQuotationStatus(quotation_id,quotation_desired_status,cursor,database_connection)
                    resp.status = falcon.HTTP_200
                    resp.body = ("200")
                else:
                    resp.status = falcon.HTTP_202
                    resp.body = ("202")
            else:
                resp.status = falcon.HTTP_204
                resp.body = ("204")
                
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
