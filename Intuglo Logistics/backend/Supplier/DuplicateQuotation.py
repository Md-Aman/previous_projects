import sys
import traceback
import falcon
import json
import pymysql
from SessionManagement import createSession
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from Tools import Tools


class DuplicateQuotation__v1__(object):
    def on_get(self, req, resp, login_id, session, quotation_id):
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
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("SELECT p1.country_code as port_from,p2.country_code as port_to,incoterm_code\
                            FROM ship_quotations\
                            INNER JOIN ports as p1 on p1.port_id = ship_quotations.port_id_from\
                            INNER JOIN ports as p2 on p2.port_id = ship_quotations.port_id_to\
                            WHERE ship_quotations.quotation_id = '"+quotation_id+"' ")
            port_to_from_dict = cursor.fetchone()
            cursor.execute("SELECT merchant_id\
                            FROM logins\
                            WHERE login_id = "+login_id+"")
            merchant_id_dict = cursor.fetchone()
            merchant_id = merchant_id_dict['merchant_id']
            port_from = port_to_from_dict['port_from']
            port_to = port_to_from_dict['port_to']
            inc_code = port_to_from_dict['incoterm_code']
            seq_status = 0
            new_quotation_id = Tools.GetQuotationID(login_id,port_from,port_to,port_to_from_dict['incoterm_code'],seq_status,cursor,database_connection)
            database_connection.begin()
            cursor.execute("INSERT INTO ship_quotations (quotation_id, supplier_login_id, shipper_type, vessel_id, \
            custom_agent_id, container_types, shipment_type_id, container_box_count, container_box_size, \
            incoterm_code, air_space_count, air_space_size, cargo_transit_duration, number_of_transit_ports, \
            halal_consolidation, halal_unstuffing, consolidation, unstuffing, departure_date, arrival_date, \
            quotation_status, quote_ref_no, port_id_from, port_id_to,part_a,part_b) \
            SELECT '"+new_quotation_id+"',supplier_login_id, shipper_type, vessel_id, \
            custom_agent_id, container_types, shipment_type_id, container_box_count, container_box_size, \
            incoterm_code, air_space_count, air_space_size, cargo_transit_duration, number_of_transit_ports, \
            halal_consolidation, halal_unstuffing, consolidation, unstuffing, departure_date, arrival_date, \
            'DRAFT', quote_ref_no, port_id_from, port_id_to, part_a, part_b FROM ship_quotations WHERE ship_quotations.quotation_id = '"+quotation_id+"'")
            cursor.execute("INSERT INTO ship_quotation_handling_charges (quotation_id,charges_description,amount,charges_location,unit_of_measure_id) \
            SELECT '"+new_quotation_id+"',charges_description,amount,charges_location,unit_of_measure_id from ship_quotation_handling_charges where quotation_id = '"+quotation_id+"'")
            cursor.execute("INSERT INTO ship_quotation_sea_freight_charges (quotation_id,charges_description,amount) \
            SELECT '"+new_quotation_id+"',charges_description,amount from ship_quotation_sea_freight_charges where quotation_id = '"+quotation_id+"'")
            database_connection.commit()
            if cursor.rowcount is 1:
                resp.status = falcon.HTTP_200 
                message = {"Message": "Quotation is duplicated succesfully."}
                result_json = json.dumps(message)
                resp.body = (result_json)
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Quotation duplication failed"}
                result_json = json.dumps(message)
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