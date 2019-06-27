'''
Name  :  Price Leveraging
Description  : Get the quotation details based on filter parameters 
'''
import math

"""
Parameters = SearchResult Dictionary

L   = Max CBM per Container (From DB['ship_quotation.container_box_size'])
Xi  = CBM Req by Customer i (From Parameter)
n   = Total number of customers so far (From DB['ship_quotation.total_people_per_shipment'])
Mj  = Total number of customers sharing one container (From DB[ship_containers.number_people_sharing])
C1  = Cost per container
C2  = Document Cost per shipment
C3  = Documnet Cost per container
C4  = Document Cost per order
C5  = Document Cost per CBM
Pi  = Price For Customer i (Final Price)
S   = Total empty space for all user containers
X   = Total CBM request by all Customers so far (From DB[ship_quotations.total_req_cbm_per_shipment])
Xj  = Total CBM requested by all customers in container j so far (From DB['ship_container.total_cbm - remaining_cbm'])
V   = Merchandise Value
C6  = Merchandise percentage
Please Populate
quotation table
    - total_people_per_shipment
    - total_req_cbm_per_shipment
    - part A
    - container_box_size
    - container_box_count

container table
    - remaining_cbm
    - halal_status
    - number_people_sharing
    - hs_code_id

handling_charges
    - * all collumns must have values
"""
import traceback
import sys
import falcon
import json
import pymysql
from DatabaseConnection import *


def PriveLeveraging(quotation_id,cursor):
    try:
        eligible_container_list = list()
        cursor.execute("select config_value from config where config_key = 'merchandise_value_percentage'")
        merchandise_value_percentage = cursor.fetchone()
        cursor.execute("select container_box_size,total_people_per_shipment,part_a,supplier_login_id from ship_quotations where quotation_id = '"+str(quotation_id)+"'")
        quotation = cursor.fetchone()
        cursor.execute("SELECT * FROM ship_containers where quotation_id ='"+str(quotation_id)+"'")
        containerlist = cursor.fetchall()
        print(containerlist)
        for container in containerlist:
            cursor.execute("SELECT * from ship_orders where container_id = '"+str(container['container_id'])+"' and cargo_status_code != 'ORDERCANCELLED'")
            orders_details = cursor.fetchall()
            for order in orders_details:
                """
                Data Gathering Part
                """
                cursor.execute("SELECT * FROM ship_quotation_handling_charges where quotation_id='"+container['quotation_id']+"' and charges_location = 'D'")
                handling_charges_list_delivery = cursor.fetchall()
                cursor.execute("SELECT * FROM ship_quotation_handling_charges where quotation_id='"+container['quotation_id']+"' and charges_location = 'A'")
                handling_charges_list_arrival = cursor.fetchall()
                L =  int(quotation['container_box_size'])
                Xi = int(order['cbm'])
                n  = int(quotation['total_people_per_shipment'])+1
                Mj = int(container['number_people_sharing'])+1
                C1 = float(quotation['part_a'])
                C2A = 0
                C3A = 0
                C4A = 0
                C5A = 0
                for charges in handling_charges_list_arrival:
                    if charges['unit_of_measure_id'] == 2:
                        C2A = C2A + charges['amount']
                    if charges['unit_of_measure_id'] == 1:
                        C3A = C3A + charges['amount']
                    if charges['unit_of_measure_id'] == 3:
                        C4A = C4A + charges['amount']
                    if charges['unit_of_measure_id'] == 4:
                        C5A = C5A + charges['amount']
                C2D = 0
                C3D = 0
                C4D = 0
                C5D = 0
                for charges in handling_charges_list_delivery:
                    if charges['unit_of_measure_id'] == 2:
                        C2D = C2D + charges['amount']
                    if charges['unit_of_measure_id'] == 1:
                        C3D = C3D + charges['amount']
                    if charges['unit_of_measure_id'] == 3:
                        C4D = C4D + charges['amount']
                    if charges['unit_of_measure_id'] == 4:
                        C5D = C5D + charges['amount']
                C6 = float(merchandise_value_percentage['config_value'])
                v  = float(order['consignee_merchandise_value'])
                Pi = 0
                S  = container['remaining_cbm']

                """
                Part BA
                """
                partBA = ((C2A/n) + (C3A/Mj) + C4A + (C5A*Xi) + (C6*v))
                print(partBA)
                """
                Part BD
                """
                partBD = ((C2D/n) + (C3D/Mj) + C4D + (C5D*Xi) + (C6*v))
                print(partBD)
                """
                Calculation Parts
                """
                
                
                partA1 = (C1/L * Xi)
                partA2 = ((S/n)*(C1/L))
                Pi = partA1 + partA2 + partBA + partBD


                cursor.execute("select tax_rate,tax_type from logistic_providers where login_id = "+str(quotation['supplier_login_id'])+"")
                supplier_name = cursor.fetchone()
                # tax_amount = (float(supplier_name['tax_rate'])/100) * Pi
                tax_amount = Pi * (float(supplier_name['tax_rate'])/100)
                total_amount_with_tax = Pi+tax_amount

                print(total_amount_with_tax)
                sql = "update ship_orders set closing_price_a = %s,closing_price_ba = %s,closing_price_bd = %s,closing_price_total=%s,closing_price_tax=%s,\
                closing_price_tax_type= %s,closing_price_total_wo_tax=%s,closing_price_tax_amount=%s where order_id = %s"
                # data = ((partA1+partA2),partBA,partBD)
                data = ("%.2f" %(partA1+partA2),"%.2f"%partBA,"%.2f"%partBD,"%.2f"%total_amount_with_tax,"%.2f"%supplier_name['tax_rate'],supplier_name['tax_type'],"%.2f"%Pi,"%.2f"%tax_amount,order['order_id'])
                cursor.execute(sql,data)
    except ValueError as err:
        raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
    except pymysql.IntegrityError as err:
        raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
    except Exception as err:
        raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)