'''
Name  :  QuotationChargesBlock
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


class QuotationChargesResource__v1__(object):
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
            # list_values_charges = [v for v in result_dictionary_json.values()]z
            list_values_charges = list()
            for x in result_dictionary_json['part_A']:
                list_values_charges.append(x)
            for x in result_dictionary_json['part_D']:
                list_values_charges.append(x)
            # Connecting the database
            # Tools.QuotationChargesDelete(quotation_id)
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            total_of_part_b = 0
            
            for list_values in list_values_charges:
                print(list_values)
                if list_values['unit_of_measure_id'] == 1 or list_values['unit_of_measure_id'] == 2 or list_values['unit_of_measure_id'] == '2' or list_values['unit_of_measure_id'] == '1':
                    print("Inside If")
                    print(list_values)
                    total_of_part_b = total_of_part_b + list_values['amount']
                arguments = (quotation_id,list_values['charges_description'],list_values['amount'],list_values['unit_of_measure_id'],list_values['charges_location'])
                cursor.execute("INSERT INTO ship_quotation_handling_charges(quotation_id,charges_description,amount,unit_of_measure_id,charges_location)\
                                value(%s,%s,%s,%s,%s)", arguments)
            arguments_quotation = (total_of_part_b,quotation_id)
            cursor.execute("UPDATE ship_quotations set part_b =%s where quotation_id = %s", arguments_quotation)
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
            cursor.execute("select charges_description,amount,charges_location,unit_of_measure_id from ship_quotation_handling_charges where quotation_id ='"+quotation_id+"'")
            charges_blocks = cursor.fetchall()
            print(charges_blocks)
            quotation_charges_block = dict()
            quotation_charges_block['location_D'] = list()
            quotation_charges_block['location_A'] = list()
            for x in charges_blocks:
                if x['charges_location'] == 'D':
                    quotation_charges_block['location_D'].append(x)
                elif x['charges_location'] == 'A':
                    quotation_charges_block['location_A'].append(x)
            resp.status = falcon.HTTP_200
            result_json = json.dumps(quotation_charges_block)
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
            result_dict_json = json.loads(raw_json,
                                          object_pairs_hook=OrderedDict,
                                          encoding='utf-8')
            list_values_charges = list()
            for x in result_dict_json['part_A']:
                list_values_charges.append(x)
            for x in result_dict_json['part_D']:
                list_values_charges.append(x)
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()            

            total_of_part_b = 0
            for list_values in list_values_charges:
                if list_values['unit_of_measure_id'] == 1 or list_values['unit_of_measure_id'] == 2 or list_values['unit_of_measure_id'] == '2' or list_values['unit_of_measure_id'] == '1':
                    total_of_part_b = total_of_part_b + list_values['amount']
                arguments = (quotation_id,list_values['charges_description'],list_values['amount'],list_values['charges_location'],list_values['unit_of_measure_id'])
                cursor.execute("INSERT INTO ship_quotation_handling_charges(quotation_id,charges_description,amount,charges_location,unit_of_measure_id)\
                                value(%s,%s,%s,%s,%s)", arguments)
            arguments_quotation = (total_of_part_b,quotation_id)
            cursor.execute("UPDATE ship_quotations set part_b =%s where quotation_id = %s", arguments_quotation)
            database_connection.commit()
            resp.status = falcon.HTTP_200
            message = {"Update": "QuotationID is deleted successfully. "}
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
            
