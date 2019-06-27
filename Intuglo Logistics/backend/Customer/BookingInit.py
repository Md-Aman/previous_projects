'''
Name  : BookingInit
Usage : Get Resource to auto populate the details based on login_id and quotation_id
Description  :  This code is used to get BookingInit in Intuglo
                Logistics and interacts with logins, customers and quotations table.
'''

import falcon
import json
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from Tools import Tools
import traceback
import sys
from datetime import *
from dictionary_merge import *


class BookingInitResource__v1__(object):
    # Authenticate login id and session availability.
    def on_get(self, req, resp, login_id, session, container_id):
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

        # Checks whether the User is Customer or not
        try:
            if (Tools.IsCustomer(login_id) is False):
                resp.status = falcon.HTTP_401
                Err = {"Reason": "Cannot access Quotation"}
                result_json = json.dumps(Err)
                resp.body = (result_json)
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Query to display data from this tbl based on given loginID parameter
            cursor.execute("select company_name as customer_company_name,customer_name,mobile_no,address_line_one,address_line_two,city,state,postal_code,official_email from customers "
                           "where login_id = '"+login_id+"'")
            customer_info = cursor.fetchone()
            address_line_two = '' if customer_info['address_line_two'] is None else customer_info['address_line_two']
            customer_info['customer_address'] = "{},{},{},{},{}".format(customer_info['address_line_one'],address_line_two,customer_info['city'],customer_info['state'],customer_info['postal_code'])
            customer_info.pop('address_line_one')
            customer_info.pop('address_line_two')
            customer_info.pop('city')
            customer_info.pop('state')
            customer_info.pop('postal_code')
            # Query to quotation details based on containerID parameter
            cursor.execute("select ship_logistic_providers_quotations_for_booking.quotation_id,DATE_FORMAT(departure_date, '%d/%m/%Y') AS departure_date,"
                           "DATE_FORMAT(arrival_date, '%d/%m/%Y') AS arrival_date,portFrom,portTo,"
                           "halal_consolidation, halal_unstuffing,vessel_no,vessel_name,custom_broker,hs_code,custom_agent_id,"
                           "consolidation, unstuffing, company_name from ship_logistic_providers_quotations_for_booking "
                           "join ship_containers on ship_containers.quotation_id = ship_logistic_providers_quotations_for_booking.quotation_id"
                           " and ship_containers.container_id = '"+container_id+"'")
            quotation_info = cursor.fetchone()
            
            if cursor.rowcount > 0:
                date_str = quotation_info['departure_date'] #The date
                format_str = '%d/%m/%Y' # The format
                datetime_obj = datetime.strptime(date_str, format_str) #convert str to datetime
                # Query to get configVal from this tbl with configKey criteria
                cursor.execute("select config_value from config where config_key = 'end-credit-block'")
                row = cursor.fetchone()
                credit_block = row
                last_credit_block = datetime_obj + timedelta(days=int(credit_block['config_value']))
                last_credit_block = last_credit_block.strftime("%d/%m/%Y")
                # Query to get configVal from this tbl w configKey criteria
                cursor.execute("select config_value from config where config_key = 'start-warehouse-accept-cargo'")
                row = cursor.fetchone()
                accept_cargo = row
                warehouse_accept_cargo = datetime_obj + timedelta(days=int(accept_cargo['config_value']))
                warehouse_accept_cargo = warehouse_accept_cargo.strftime("%d/%m/%Y")
                # Query to get configVal from this tbl based on configKey criteria
                cursor.execute("select config_value from config where config_key = 'end-upload-custom-declaration-document'")
                row = cursor.fetchone()
                custom_file = row
                last_custom_file = datetime_obj + timedelta(days=int(custom_file['config_value']))
                last_custom_file = last_custom_file.strftime("%d/%m/%Y")
                if(cursor.rowcount > 0):
                    customer_details = customer_info
                    quotation_details = quotation_info
                    quotation_details['CreditBlock']=last_credit_block
                    quotation_details['WarehouseAcceptCargo']=warehouse_accept_cargo
                    quotation_details['CustomFile']=last_custom_file
                    booking_detail_dictionary  = customer_details.copy()# start with x's keys and values
                    booking_detail_dictionary.update(quotation_details)# modifies z with y's keys and values & returns None
                    # hs_code_details = list(hs_code_info)
                    # booking_detail_dictionary = {**customer_details,**quotation_details}
                    # booking_details = customer_details.extend(hs_code_details)
                    resp.status = falcon.HTTP_200
                    result_json = json.dumps(booking_detail_dictionary, sort_keys=True)
                    resp.body = (result_json)
            else:
                resp.status = falcon.HTTP_204
                message = {"Reason":"Data is not found"}
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
            