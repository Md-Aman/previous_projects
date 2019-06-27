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
from Tools import Tools
import IntugloApp


class CalendarVesselList__v1__(object):
    def on_get(self, req, resp):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            print('dai')
            search_type = req.get_param('searchType')
            if search_type == 'landingPage':
                data_type = req.get_param('type')
                dates = req.get_param('date')
                if data_type == 'Month':
                    split_date = dates.split("-")
                    print(split_date)
                    sql = "select vessel_no,vessel_id,port_name_departure,port_name_arrival,eta,etd from route_vessel_view where YEAR(etd) = %s and MONTH(etd) = %s"
                    data = (split_date[0],split_date[1])
                    cursor.execute(sql,data)
                    row = cursor.fetchall()
                elif data_type == 'Day':
                    split_date = dates.split("-")
                    print(split_date)
                    sql = "select vessel_no,vessel_id,port_name_departure,port_name_arrival,eta,etd from route_vessel_view where YEAR(etd) = %s and MONTH(etd) = %s and DAY(etd) = %s"
                    data = (split_date[0],split_date[1],split_date[2])
                    cursor.execute(sql,data)
                    row = cursor.fetchall()
            elif search_type == 'departureAndArrival':
                depart_port = req.get_param('departurePortTerminal')
                arrival_port = req.get_param('arrivalPortTerminal')
                dates = req.get_param('date')
                split_date = dates.split("-")
                sql = "select concat(vessel_name,'/',vessel_no) as vessel_no,vessel_id,eta,etd from route_vessel_view where port_id_arrival = %s and port_id_departure = %s and YEAR(etd) = %s and MONTH(etd) = %s"
                data = (arrival_port,depart_port,split_date[0],split_date[1])
                cursor.execute(sql,data)
                row = cursor.fetchall()
            resp.status = falcon.HTTP_200
            result_json = json.dumps(row,default=str)
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