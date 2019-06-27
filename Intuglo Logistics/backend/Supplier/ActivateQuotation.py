'''
Name  :  ActivateQuotation
Usage : This API checks the quotation status and if the status is "APPROVED",
         it will activate the quotation by changing the quotation status to "ACTIVE". activated.
Description  : This code interacts with quotations table 
'''

import sys
import traceback
import falcon
import json
import pymysql
from SessionManagement import createSession
from memcacheResource import MemcacheFunctions
from DatabaseConnection import *
from collections import OrderedDict
from Tools import *
from EmailTools import EmailTools


class ActivateQuotation__v1__(object):
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
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("SELECT q.quotation_status,q.container_box_count,l.official_email\
                            FROM ship_quotations q\
                            JOIN logistic_providers l on q.supplier_login_id = l.login_id\
                            WHERE q.quotation_id ='"+quotation_id+"'")
            row = cursor.fetchone()
            if(cursor.rowcount>0):
                UserDetails = row
                if (UserDetails['quotation_status'] == 'APPROVED'):
                    container_count = UserDetails['container_box_count']
                    cursor.execute("UPDATE ship_quotations\
                                    SET ship_quotations.quotation_status = 'ACTIVE'\
                                    WHERE ship_quotations.quotation_id ='"+quotation_id+"'")
                    for i in range(container_count):
                        container_ID = Tools.GetContainerID(quotation_id,0,cursor,database_connection)
                        cursor.execute("INSERT INTO ship_containers (container_id,container_no,quotation_id,total_cbm,remaining_cbm,halal_status,number_people_sharing,percentage_full,total_weight,remaining_weight)\
                        SELECT '"+container_ID+"',0,ship_quotations.quotation_id,ship_quotations.container_box_size,ship_quotations.container_box_size,'U',\
                        0,0,ship_quotations.air_space_size,air_space_size\
                        FROM ship_quotations WHERE ship_quotations.quotation_id ='"+quotation_id+"'")
                    database_connection.commit()
                    resp.status = falcon.HTTP_200
                    message = {"Message": "Quotation ID status is updated to active."}
                    result_json = json.dumps(message)
                    resp.body = result_json
                    EmailTools.UponSetUpEmailNotify(UserDetails['official_email'],quotation_id)
                else:
                    resp.status = falcon.HTTP_200
                    message = {"Message": "Quotation is not confirmed to be activated."}
                    result_json = json.dumps(message)
                    resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Quotation status is not found."}
                result_json = json.dumps(message)
                resp.body = result_json
        except ValueError as err:
            raise resp.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise resp.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()