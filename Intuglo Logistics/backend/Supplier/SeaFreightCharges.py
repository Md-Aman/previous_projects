'''
Name  :  SeaFreightCharges
Description  : This API returns details for quotation handling charges (with parameter of quotationID).
                This API is for inserting new data to the table (with parameter of quotationID). QuotationID is getting from the ship_quotation table. 
                This API is to modify the data changes (with parameters of quotationID & sea_freight_charges_id). 
                This resource interacts with ship_quotation_sea_freight_charges table.
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


class SeaFreightChargesResource__v1__(object):
    def on_post(self, req, resp, login_id, session, quotation_id):
        try:
            if (MemcacheFunctions.IsSessionValid(login_id,session) is False):
                resp.status = falcon.HTTP_401
                Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Err)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
       
        try:
            # Raw JSON 
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dictionary_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            list_values_charges = list()
            for x in result_dictionary_json:
                list_values_charges.append([v for v in x.values()])
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            for list_values in list_values_charges:
                arguments = (quotation_id,list_values[0],list_values[1])
                cursor.execute("INSERT INTO ship_quotation_sea_freight_charges (ship_quotation_sea_freight_charges.quotation_id,ship_quotation_sea_freight_charges.charges_description,\
                                ship_quotation_sea_freight_charges.amount)\
                                value(%s,%s,%s)", arguments)
            database_connection.commit()
            resp.status = falcon.HTTP_200
            message = {"status":"Inserted succesfully"}
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

    def on_get(self, req, resp, login_id, session, quotation_id):
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
            cursor.execute("select * from ship_quotation_sea_freight_charges where quotation_id ='"+quotation_id+"'")
            row = cursor.fetchall()
            resp.status = falcon.HTTP_200
            result_json = json.dumps(row)
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


    def on_patch(self, req, resp, login_id, session, quotation_id, sea_freight_charges_id):
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
            list_values = [v for v in result_dict_json.values()]
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("UPDATE ship_quotation_sea_freight_charges SET charges_description='"+list_values[0]+"', amount='"+list_values[1]+"'\
                WHERE quotation_id='"+quotation_id+"' AND sea_freight_charges_id ='"+sea_freight_charges_id+"'")
            database_connection.commit()
            resp.status = falcon.HTTP_200
            message = {"Update": "Sea Freight charges is updated successfully"}
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
            
