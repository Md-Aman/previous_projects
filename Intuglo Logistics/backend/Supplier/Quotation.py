'''
Name  :  Quotation
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
from Tools import Tools
import aws_cred

class QuotationResource__v1__(object):
    def on_post(self, req, resp, login_id, session):
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

            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()

            # Call the function to generate quotationID
            # passing paramater eg : GetQuotationID(merchant_id, CFC, CTC, incoterm)
            # Datatype             :                   INT        STR(2)    STR(3)
            cursor.execute("SELECT p1.country_code as port_from, p2.country_code as port_to\
                            FROM ports p1,ports p2\
                            WHERE p1.port_id = "+result_dictionary_json['port_id_from']+" AND p2.port_id = "+result_dictionary_json['port_id_to']+"")
            port_to_from_dict = cursor.fetchone()
            cursor.execute("SELECT merchant_id\
                            FROM logins\
                            WHERE login_id = "+login_id+"")
            merchant_id_dict = cursor.fetchone()
            merchant_id = merchant_id_dict['merchant_id']
            port_from = port_to_from_dict['port_from']
            port_to = port_to_from_dict['port_to']
            seq_status = 0
            quotation_id = Tools.GetQuotationID(login_id,port_from,port_to,result_dictionary_json['incoterm_code'],seq_status,cursor,database_connection)
            arguments = (quotation_id, login_id,result_dictionary_json['shipper_type'],
                            result_dictionary_json['vessel_flight_no'],
                            result_dictionary_json['custom_broker'],
                            result_dictionary_json['container_types'],
                            result_dictionary_json['shipment_type_id'],
                            result_dictionary_json['container_box_count'],
                            result_dictionary_json['container_box_size'],
                            result_dictionary_json['incoterm_code'],
                            result_dictionary_json['air_space_size'],
                            result_dictionary_json['cargo_transit_duration'],
                            result_dictionary_json['number_of_transit_ports'],
                            result_dictionary_json['halal_consolidation'],
                            result_dictionary_json['halal_unstuffing'],
                            result_dictionary_json['consolidation'],
                            result_dictionary_json['unstuffing'],
                            result_dictionary_json['departure_date'],
                            result_dictionary_json['arrival_date'],
                            result_dictionary_json['quotation_status'],
                            result_dictionary_json['quote_for'],
                            result_dictionary_json['port_id_from'],
                            result_dictionary_json['port_id_to'],
                            result_dictionary_json['part_a'])
                            # result_dictionary_json['part_b'])

            cursor.execute("insert into ship_quotations (quotation_id, supplier_login_id, shipper_type, vessel_id," 
                            "custom_agent_id, container_types, shipment_type_id, container_box_count, container_box_size," 
                            "incoterm_code, air_space_size, cargo_transit_duration, number_of_transit_ports, " 
                            "halal_consolidation, halal_unstuffing, consolidation, unstuffing, departure_date, arrival_date," 
                            "quotation_status, quote_ref_no, port_id_from, port_id_to,part_a) "
                            "values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", arguments)    
 
            database_connection.commit()
            resp.status = falcon.HTTP_200
            message = {"status":200,"Q_ID":quotation_id}
            result_json = json.dumps(message, sort_keys=True)
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
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
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
            cursor.execute("select q.quotation_id, q.supplier_login_id, q.quote_ref_no, q.shipper_type, v.vessel_no, q.port_id_from,\
                            port_id_to, q.container_types, q.shipment_type_id, q.container_box_count, q.container_box_size,\
                            incoterm_code, q.air_space_count, q.air_space_size, q.cargo_transit_duration, q.number_of_transit_ports,\
                            halal_consolidation, q.halal_unstuffing, q.consolidation, q.unstuffing, q.departure_date, q.arrival_date,\
                            hs_code_id, q.quotation_status, q.file_name, q.vessel_id, v.port_name_arrival, v.port_name_departure,q.custom_agent_id,\
                            c.agent_name\
                            from ship_quotations as q\
                            left join route_vessel_view as v on v.vessel_id = q.vessel_id\
                            left join custom_agent as c on c.custom_agent_id = q.custom_agent_id\
                            where quotation_id = '"+ quotation_id +"'")
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                quotation_details = list(row)            
                resp.status = falcon.HTTP_200
                result_json = json.dumps(quotation_details,default=str, sort_keys=True)
                resp.body = (result_json)
            else:
                Error = {"Message": "Quotation is not found."}
                resp.status = falcon.HTTP_204
                result_json = json.dumps(Error)
                resp.body = (result_json)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
    

    def on_patch(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
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
            # cursor.execute("select config_value from config where config_key = 's3-bucket-quotation' ")
            # bucket = cursor.fetchone()
            # BUCKET_NAME = bucket['config_value']
            # s3 = aws_cred.aws_s3(BUCKET_NAME)
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            list_values = [v for v in result_dict_json.values()]
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("SELECT merchant_id\
                            FROM logins\
                            WHERE login_id = "+login_id+"")
            merchant_id_dict = cursor.fetchone()
            merchant_id = merchant_id_dict['merchant_id']
            cursor.execute("SELECT p1.country_code as port_from, p2.country_code as port_to\
                            FROM ports p1,ports p2\
                            WHERE p1.port_id = "+result_dict_json['port_id_from']+" AND p2.port_id = "+result_dict_json['port_id_to']+"")
            port_to_from_dict = cursor.fetchone()
            port_from = port_to_from_dict['port_from']
            port_to = port_to_from_dict['port_to']
            seq_status = 1
            quotation_id_new = Tools.GetQuotationID(merchant_id,port_from,port_to,result_dict_json['incoterm_code'],seq_status,cursor,database_connection,result_dict_json['quotationId'])
            print(quotation_id_new)
            sql ="UPDATE ship_quotations SET quotation_id=%s, \
                    supplier_login_id=%s, \
                    shipper_type=%s, \
                    vessel_id=%s, \
                    custom_agent_id=%s, \
                    container_types=%s, \
                    shipment_type_id=%s, \
                    container_box_count=%s, \
                    container_box_size=%s, \
                    incoterm_code=%s, \
                    air_space_size=%s, \
                    cargo_transit_duration=%s, \
                    number_of_transit_ports=%s, \
                    halal_consolidation=%s, \
                    halal_unstuffing=%s, \
                    consolidation=%s, \
                    unstuffing=%s, \
                    departure_date=%s, \
                    arrival_date=%s, \
                    quotation_status=%s, \
                    quote_ref_no=%s, \
                    port_id_from=%s, \
                    port_id_to=%s, \
                    part_a=%s, \
                    part_b=%s WHERE quotation_id=%s"
            
            args = (quotation_id_new,login_id,result_dict_json['shipper_type'],
                    result_dict_json['vessel_flight_no'],
                    result_dict_json['custom_broker'],
                    result_dict_json['container_types'],
                    result_dict_json['shipment_type_id'],
                    result_dict_json['container_box_count'],
                    result_dict_json['container_box_size'],
                    result_dict_json['incoterm_code'],
                    result_dict_json['air_space_size'],
                    result_dict_json['cargo_transit_duration'],
                    result_dict_json['number_of_transit_ports'],
                    result_dict_json['halal_consolidation'],
                    result_dict_json['halal_unstuffing'],
                    result_dict_json['consolidation'],
                    result_dict_json['unstuffing'],
                    result_dict_json['departure_date'],
                    result_dict_json['arrival_date'],
                    result_dict_json['quotation_status'],
                    result_dict_json['quote_for'],
                    result_dict_json['port_id_from'],
                    result_dict_json['port_id_to'],
                    result_dict_json['part_a'],
                    result_dict_json['part_b'],
                    result_dict_json['quotationId'])
            cursor.execute("DELETE FROM ship_quotation_handling_charges WHERE quotation_id = '"+str(result_dict_json['quotationId'])+"' ")
            cursor.execute("delete from ship_quotation_sea_freight_charges where quotation_id = '"+str(result_dict_json['quotationId'])+"'")
            cursor.execute(sql,args)
            database_connection.commit()
            # # cursor.execute("select file_name from ship_quotations where quotation_id = '"+str(quotation_id_new)+"' ")
            # row = cursor.fetchone()
            # # filename = quotation_id_new + row['file_name'][-4:]
            # s3.Object(BUCKET_NAME,os.path.join(quotation_id_new,filename)).copy_from(CopySource=os.path.join(BUCKET_NAME,result_dict_json['quotationId'],row['file_name']))

            # cursor.execute("update ship_quotations set file_name = '"+str(quotation_id_new+row['file_name'][-4:])+"' where quotation_id = '"+str(quotation_id_new)+"' ")
            # cursor.execute("update ship_quotation_handling_charges set quotation_id = '"+str(quotation_id_new)+"' where quotation_id = '"+str(result_dict_json['quotation_id'])+"'")
            # cursor.execute("update ship_quotation_sea_freight_charges set quotation_id = '"+str(quotation_id_new)+"' where quotation_id = '"+str(result_dict_json['quotation_id'])+"'")
            
            # print("After execute")
            resp.status = falcon.HTTP_200
            message = {"status":200,"Q_ID":quotation_id_new}
            result_json = json.dumps(message, sort_keys=True)
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