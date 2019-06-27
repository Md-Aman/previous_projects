'''
Name  :  SearchFiltering
Description  : Get the quotation details based on filter parameters 
'''

import traceback
import sys
import falcon
import json
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from collections import OrderedDict
from Tools import Tools
from datetime import datetime
import IntugloFormula
from decimal import Decimal

class SearchFiltering__v1__(object):
    def on_get(self,req,resp):
        try:
            ETD = req.get_param("etd")  #yyyy-mm-dd
            ETA = req.get_param("eta")  #yyyy-mm-yy
            PortTo = req.get_param("port_to")   #port_id
            PortFrom = req.get_param("port_from") #port_id
            CBM = req.get_param("cbm") #remaning_CBM
            HALAL_STATUS = req.get_param("halal_status") #halal_status
            WEIGHT = req.get_param("weight") # weight
            SHIPPER_TYPE = req.get_param("shipper_type") # shipper_type
            TRANSPORT_TYPE = req.get_param("transport_type") # transport type
            HS_CODE = req.get_param("hs_code") # hs_code
            CONTAINER_TYPE = req.get_param("container_type")
            MERCHANDISE_VALUE = req.get_param("merchandise_value")
            QUOTATION_ID = req.get_param("quotation_id")
            LOGISTIC_PATNER = req.get_param("logistic_patner")
            INCOTERM = req.get_param("incoterm")
            PEOPLESHARING = req.get_param("num_people")
            FILTER = req.get_param("filter")
            PRICE_START = req.get_param("price_start")
            PRICE_END = req.get_param("price_end")
            # print(TRANSPORT_TYPE)
            if MERCHANDISE_VALUE is None or MERCHANDISE_VALUE == '':
                MERCHANDISE_VALUE = 0
            
            sql = "select * from ship_quotations as q1 \
            inner join logistic_providers l1 on l1.login_id = q1.supplier_login_id \
            inner join ship_container_types_size s1 on s1.container_id = q1.container_types\
            inner join ship_container_types s2 on s2.container_id = s1.container_type_id\
            WHERE q1.departure_date >= %s AND q1.arrival_date <= %s AND q1.port_id_from = %s AND q1.port_id_to = %s AND q1.shipper_type = %s"
            args = [ETD,ETA,PortFrom,PortTo,SHIPPER_TYPE]
            # print(INCOTERM)
            
            # print(type(ap[0]))
            if TRANSPORT_TYPE != '0':
                sql = sql + " AND q1.shipment_type_id = %s"
                args.append(TRANSPORT_TYPE)

            if QUOTATION_ID is not None:
                sql = sql + " AND q1.quotation_id = %s"
                args.append(QUOTATION_ID)
            
            if INCOTERM is not None:
                ap = []
                ap.append(INCOTERM.split(','))
                sql = sql + " AND q1.incoterm_code in %s"
                args.append(tuple(ap[0]))
            
            if PEOPLESHARING is not None:
                sql = sql + " AND q1.total_people_per_shipment >= %s"
                args.append(PEOPLESHARING)
            
            if LOGISTIC_PATNER is not None:
                sql = sql + " AND l1.company_name = %s"
                args.append(LOGISTIC_PATNER)
            
            if CONTAINER_TYPE is not None:
                sql = sql + "AND s2.container_id = %s"
                args.append(CONTAINER_TYPE)

            argument = tuple(args)
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute(sql,argument)
            row = cursor.fetchall()
            print(row)

            if FILTER is not None:
                filteration_status = True
            else:
                filteration_status = False
            related_pointer = True
            random_pointer = True
            

            """
            First Search
            """
            if (cursor.rowcount > 0):
                print("Search")
                list_values = row
                P = IntugloFormula.formula(list_values,float(CBM),HALAL_STATUS,HS_CODE,MERCHANDISE_VALUE,float(WEIGHT),PRICE_START,PRICE_END,filteration_status,cursor)
                if P:
                    print("Entering here")
                    print(P)
                    searched_result = dict()
                    searched_result['result_type'] = 'searched_result'
                    searched_result['result_set'] = P
                    searched_result['search_match'] = True
                    resp.status = falcon.HTTP_200
                    result_json = json.dumps(searched_result,sort_keys=True,default=str)
                    resp.body = result_json
                    related_pointer = False
                    random_pointer = False
            else:
                if filteration_status is True:
                    searched_result = dict()
                    searched_result['result_type'] = 'filtered_result'
                    searched_result['result_set'] = None
                    searched_result['search_match'] = False
                    resp.status = falcon.HTTP_200
                    result_json = json.dumps(searched_result,sort_keys=True,default=str)
                    resp.body = result_json


            """
            Releated Search
            """
            if filteration_status is False and related_pointer is True :
                print("From Search")
                if TRANSPORT_TYPE == '0':
                    sql = "select * from ship_quotations as q1 WHERE q1.departure_date >= %s AND q1.port_id_from = %s AND q1.port_id_to = %s AND q1.shipper_type = %s"
                    args = (ETD,PortFrom,PortTo,SHIPPER_TYPE)
                else:
                    sql = "select * from ship_quotations as q1 WHERE q1.departure_date >= %s AND q1.port_id_from = %s AND q1.port_id_to = %s AND q1.shipper_type = %s AND q1.shipment_type_id = %s"
                    args = (ETD,PortFrom,PortTo,SHIPPER_TYPE,TRANSPORT_TYPE)
                cursor.execute(sql,args)
                row = cursor.fetchall()
                list_values = row
                if cursor.rowcount > 0:
                    P = IntugloFormula.formula(list_values,float(CBM),HALAL_STATUS,HS_CODE,MERCHANDISE_VALUE,float(WEIGHT),PRICE_START,PRICE_END,filteration_status,cursor)
                    if P:
                        searched_result = dict()
                        searched_result['result_type'] = 'related_search_result'
                        searched_result['result_set'] = P
                        searched_result['search_match'] = True
                        resp.status = falcon.HTTP_200
                        result_json = json.dumps(searched_result,sort_keys=True,default=str)
                        resp.body = result_json
                        related_pointer = False
                        random_pointer = False
            
            """
            Random Search
            """
            if filteration_status is False and random_pointer is True:
                print("From HERe")
                sql = "select * from ship_quotations as q1 WHERE q1.departure_date >= %s"
                args = (ETD)
                cursor.execute(sql,args)
                row = cursor.fetchall()
                list_values = row
                P = IntugloFormula.formula(list_values,float(CBM),HALAL_STATUS,HS_CODE,MERCHANDISE_VALUE,float(WEIGHT),PRICE_START,PRICE_END,filteration_status,cursor)
                if P:
                    searched_result = dict()
                    searched_result['result_type'] = 'random_search_result'
                    searched_result['result_set'] = P
                    searched_result['search_match'] = True
                    resp.status = falcon.HTTP_200
                    result_json = json.dumps(searched_result,sort_keys=True,default=str)
                    resp.body = result_json
                else:
                    searched_result = dict()
                    searched_result['result_type'] = 'random_search_result'
                    searched_result['result_set'] = []
                    searched_result['search_match'] = False
                    resp.status = falcon.HTTP_200
                    result_json = json.dumps(searched_result,sort_keys=True,default=str)
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