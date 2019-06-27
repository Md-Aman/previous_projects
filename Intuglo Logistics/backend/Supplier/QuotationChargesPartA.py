'''
Name  :  QuotationChargesBlockPartA
Usage : Post resource to generate quotation ID and Get resource to get details of particular quotationID
Description  : This code interacts with quotations table and a GenerateQuotationID function in stored procedure
'''

import falcon
import json
import sys
import traceback
import os
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__
# import UploadFile
from Tools import Tools
import IntugloApp


class QuotationChargesPartA__v1__(object):
    def on_post(self, req, resp, login_id, session,quotation_id):
        try:
            if (MemcacheFunctions.IsSessionValid(login_id,session) is False):
                resp.status = falcon.HTTP_401
                Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Err)
                resp.body = (result_json)
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
       
        try:
            # Raw JSON 
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dictionary_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # list_values_charges = [v for v in result_dictionary_json.values()]
            # Connecting the database
            # Tools.QuotationChargesDelete(quotation_id)
            database_connection = get_db_connection()
            cursor = database_connection.cursor()

            for dict_value in result_dictionary_json:
                arguments = (quotation_id,dict_value['amount'],dict_value['charges_description'])
                cursor.execute("INSERT INTO ship_quotation_sea_freight_charges(quotation_id,amount,charges_description)\
                                value(%s,%s,%s)", arguments)
            database_connection.commit()
            resp.status = falcon.HTTP_200
            message = {"status":"inserted succesfully"}
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

    def on_get(self, req, resp, login_id, session,quotation_id):
        try:
            if (MemcacheFunctions.IsSessionValid(login_id,session) is False):
                resp.status = falcon.HTTP_401
                Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Err)
                resp.body = (result_json)
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
       
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select amount,charges_description from ship_quotation_sea_freight_charges where quotation_id ='"+quotation_id+"'")
            part_a = cursor.fetchall()
            part_a_block = dict()
            part_a_block['part_a'] = part_a
            resp.status = falcon.HTTP_200
            result_json = json.dumps(part_a_block)
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
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', err.args)
            
    
        try:
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dict_json = json.loads(raw_json,object_pairs_hook=OrderedDict,encoding='utf-8')

            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            

            for dict_value in result_dict_json:
                arguments = (quotation_id,dict_value['amount'],dict_value['charges_description'])
                cursor.execute("INSERT INTO ship_quotation_sea_freight_charges(quotation_id,amount,charges_description)\
                                value(%s,%s,%s)", arguments)
            database_connection.commit()
            resp.status = falcon.HTTP_200
            message = {"Update": "Quotation charges is updated successfully"}
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