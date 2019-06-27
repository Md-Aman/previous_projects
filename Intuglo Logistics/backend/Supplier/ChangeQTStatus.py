'''
Name  :  ChangeQTStatus
Description  : API resource to handle status changes for Delete, Approved, Pending Approval, Closed and Archived with the given quotation ID.
               It interacts with the quotations table.
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
from Tools import Tools
from EmailTools import EmailTools


class ChangeQTStatusResource__v1__(object):
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
            # Json value
            quotation_id = resultdict_json['quotation_id']
            old_status = resultdict_json['current_quotation_status']
            desired_status = resultdict_json['quotation_status']
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Check the quotation status
            cursor.execute("select q.quotation_status, l.official_email\
                            from ship_quotations q\
                            join logistic_providers l on q.supplier_login_id = l.login_id\
                            where q.quotation_id = '"+quotation_id+"'")
            row = cursor.fetchone()
            if (cursor.rowcount > 0):
                book_status_dict = Tools.QuotationStatus(desired_status,old_status)
                print(book_status_dict)
                book_status_list = book_status_dict['current_quotation_status']
                if(old_status in book_status_list):
                    index_code = book_status_list.index(old_status)
                    Tools.ChangeQuotationStatus(quotation_id, desired_status,cursor,database_connection)
                    resp.status = falcon.HTTP_200
                    resp.body = ("200")
                    if(desired_status == 'CLOSED'):
                        EmailTools.QTClosedEmailNotify(row['official_email'],quotation_id,10)
                else:
                    resp.status = falcon.HTTP_202
                    resp.body = ("202")
            else:
                resp.status = falcon.HTTP_204
                resp.body = ("204")
        

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
            
