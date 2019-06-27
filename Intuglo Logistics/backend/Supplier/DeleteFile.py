'''
Name  :  DeleteFile
Description  :  Gets customer orderID details and displays them. 
Pre-required : Need to create a folder named "uploads" where the file are located, 
              unless the upload files would not work.
'''

import traceback
import sys
import json
import simplejson as json
import falcon
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
import os
import aws_cred

class DeleteFile__V1__(object):
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
        
        try:
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            resultdict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Converting Json to List
            list_values = [v for v in resultdict_json.values()]
            quotation_id = list_values[0]
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 's3-bucket-quotation' ")
            bucket = cursor.fetchone()
            BUCKET_NAME = bucket['config_value']
            s3 = aws_cred.aws_s3(BUCKET_NAME)
            cursor.execute("select file_name from ship_quotations where quotation_id = '"+quotation_id+"'")
            row = cursor.fetchone()
            if(cursor.rowcount > 0):
                obj = s3.Object(BUCKET_NAME,os.path.join(quotation_id,row['file_name']))
                obj.delete()
                cursor.execute("update ship_quotations set file_name = '' where quotation_id = '"+quotation_id+"' ")
                database_connection.commit()
                resp.status = falcon.HTTP_200
                message = {"Update": "File is removed"}
                result_json = json.dumps(message)
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                message = {"Error": "Quotation is not found"}
                result_json = json.dumps(message)
                resp.body = result_json
        except OSError as err:  ## if failed, report it back to the user ##
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()