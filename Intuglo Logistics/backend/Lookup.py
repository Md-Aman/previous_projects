'''
Name  :  Lookup
Usage :  Gets data from Database
Description  :   This code used to get all the data from database that is used to display on website
'''

import pymysql
from collections import OrderedDict
from DatabaseConnection import *


class Lookup():
    @staticmethod
    def getCountryList():
        # Connecting the database
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("select country_code,country_name from countries order by country_name asc")
        country_result = cursor.fetchall()
        cursor.close()
        database_connection.close()
        # country_list_values = [list(i)for i in country_result]
        # country_key_values = ['code','name']
        # country_dictionary = [OrderedDict(zip(country_key_values, values)) for values in country_list_values]
        return country_result

    @staticmethod
    def getTermsConditionsList():
        # Connecting the database
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("select tc_id,terms_conditions_text from terms_conditions where tc_type = '"+user_type+"' ORDER BY tc_id desc limit 1")
        termsconditions_dictionary = cursor.fetchone()
        cursor.close()
        database_connection.close()
        return termsconditions_dictionary
    
    @staticmethod
    def getPortList():
        # Connecting the database
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("select port_id,port_name from ports ")
        port_result = cursor.fetchall()
        cursor.close()
        database_connection.close()
        # port_id = [id[0] for id in port_result]
        # port_name = [name[1] for name in port_result]
        # Ports_dictionary = dict(zip(port_id, port_name))
        return port_result
        # return []
    
    @staticmethod
    def getHSCode():
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("select distinct CONCAT(hs_code_header,'.',hs_code_sub) as hs_code from hs_code")
        HSCode_result = cursor.fetchall()
        cursor.close()
        database_connection.close()
        # hs_code_id = [id[0] for id in HSCode_result]
        # hs_code = [code[1] for code in HSCode_result]
        # HSCode_dictionary = dict(zip(hs_code_id, hs_code))
        return HSCode_result
        # return []

    @staticmethod
    def getContainerTypes():
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("SELECT container_id, container_type FROM ship_container_types")
        container_type = cursor.fetchall()
        cursor.close()
        database_connection.close()
        return container_type

    @staticmethod
    def getContainerTypeSize():
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("SELECT container_id, description FROM ship_container_types_size")
        container_result = cursor.fetchall()
        cursor.close()
        database_connection.close()
        return container_result

    @staticmethod
    def getIndustryList():
        # Connecting the database
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("select industry_id, industry_no, industry_name from industries\
                        order by length(industry_no),industry_no")
        industry_result = cursor.fetchall()  
        cursor.close()
        database_connection.close()
        # industry_list_values = [list(i) for i in industry_result]
        # industry_key_values = ['IndustryID','IndustryName']
        # industry_dictionary = [OrderedDict(zip(industry_key_values, values)) for values in industry_list_values]
        return industry_result

    @staticmethod
    def getBusinessList():
        # Connecting the database
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("select business_id,business_no, business_name from businesses order by length(business_no),business_no")
        business_result = cursor.fetchall()
        cursor.close()
        database_connection.close()
        # business_list_values = [list(i) for key,value in business_result]
        # business_key_values = ['BusinessID', 'IndustryID', 'BusinessName']
        # business_dictionary = [OrderedDict(zip(business_key_values, values)) for values in business_list_values]
        return business_result
        
    @staticmethod
    def getIncotermList():
       # Connecting the database
       database_connection = get_db_connection()
       cursor = database_connection.cursor()
       cursor.execute("select incoterm_code, description from ship_incoterms")
       incoterm_result = cursor.fetchall()
       cursor.close()
       database_connection.close()
    #    incoterm_code = [code[0] for code in incoterm_result]
    #    incoterm_description = [description[1] for description in incoterm_result]
    #    incoterm_dictionary = dict(zip(incoterm_code, incoterm_description))
       return incoterm_result
    #    return []

    @staticmethod
    def getShipmentList():
        # Connecting the database
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("select shipment_type_id, shipment_type\
                        from ship_shipment_types")
        shipment_result = cursor.fetchall()
        cursor.close()
        database_connection.close()
        # shipment_type_id = [id[0] for id in shipment_result]
        # shipment_type = [type[1] for type in shipment_result]
        # shipment_dictionary = dict(zip(shipment_type_id, shipment_type))
        return shipment_result
        # return []
    
    # def getQuotationChargesList():
    #     # Connecting the database
    #     database_connection = get_db_connection()
    #     cursor = database_connection.cursor()
    #     cursor.execute("select charges_id, charges_description\
    #                     from quotation_charges")
    #     charges_result = cursor.fetchall()
    #     cursor.close()
    #     database_connection.close()
    #     # shipment_type_id = [id[0] for id in shipment_result]
    #     # shipment_type = [type[1] for type in shipment_result]
    #     # shipment_dictionary = dict(zip(shipment_type_id, shipment_type))
    #     return charges_result
    #     # return []
    
    @staticmethod
    def getUnitMeasureList():
        # Connecting the database
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("select unit_of_measure_id, unit_of_measure_description\
                        from ship_unit_of_measure")
        measure_result = cursor.fetchall()
        cursor.close()
        database_connection.close()
        # shipment_type_id = [id[0] for id in shipment_result]
        # shipment_type = [type[1] for type in shipment_result]
        # shipment_dictionary = dict(zip(shipment_type_id, shipment_type))
        return measure_result
        # return []
    
    @staticmethod
    def getTermsAndCondition():
        # Connecting the database
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("select tc_id,terms_conditions_text from terms_conditions")
        termsconditions_dictionary = cursor.fetchall()
        cursor.close()
        database_connection.close()
        # shipment_type_id = [id[0] for id in shipment_result]
        # shipment_type = [type[1] for type in shipment_result]
        # shipment_dictionary = dict(zip(shipment_type_id, shipment_type))
        return termsconditions_dictionary
        # return []


    @staticmethod
    def getClientServerURLBackend():
        # Connecting DB
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("SELECT config_value FROM config WHERE config_key='server_backend_route'")
        b_server_url = cursor.fetchone()
        backend = str(b_server_url['config_value'])
        cursor.close()
        database_connection.close()
        return backend

    @staticmethod
    def getClientServerURLFrontend():
        # Connecting DB
        database_connection = get_db_connection()
        cursor = database_connection.cursor()
        cursor.execute("SELECT config_value FROM config WHERE config_key='server_frontend_route'")
        f_server_url = cursor.fetchone()
        frontend = str(f_server_url['config_value'])
        cursor.close()
        database_connection.close()
 
        return frontend