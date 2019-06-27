'''
Name  :  SearchFiltering
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
import os

def formula(dict_search,cbm_req,halal_status,hs_code,merchandise_value,weight,price_start,price_end,filteration_status,cursor):
    try:
        eligible_container_list = list()
        cursor.execute("select config_value from config where config_key = 'merchandise_value_percentage'")
        merchandise_value_percentage = cursor.fetchone()
        cursor.execute("select config_value from config where config_key = 'serving-url-s3'")
        s3url = cursor.fetchone()
        cursor.execute("select config_value from config where config_key = 's3-bucket-profilepic'")
        bucket = cursor.fetchone()
        cursor.execute("select config_value from config where config_key = 'price-parameter-c1'")
        price_param_c1 = cursor.fetchone()
        cursor.execute("select config_value from config where config_key = 'price-parameter-c2'")
        price_param_c2 = cursor.fetchone()
        BUCKET_NAME = bucket['config_value']
        PC1 = float(price_param_c1['config_value'])
        PC2 = float(price_param_c2['config_value'])
        for quotation in dict_search:
            # print(quotation)
            cursor.execute("select shipment_type from ship_shipment_types where shipment_type_id = '"+str(quotation['shipment_type_id'])+"' ")
            shipment_type = cursor.fetchone()
            # print(shipment_type)
            cursor.execute("SELECT hs_code_set from hs_set where hs_chapter = '"+hs_code[0:2]+"'")
            hs_set = cursor.fetchone()
            cursor.execute("SELECT * FROM ship_containers where quotation_id ='"+str(quotation['quotation_id'])+"' order by remaining_cbm asc")
            containerlist = cursor.fetchall()
            for container in containerlist:
                # print(container['container_id'])
                if cbm_req <= container['remaining_cbm'] and (container['halal_status'] == halal_status or container['halal_status'] == 'U') and (container['hs_set_id'] == hs_set['hs_code_set'] or container['hs_set_id'] == 'HSX') and weight <= container['remaining_weight']:
                    # print('%d and %s and %s and %s'%(container['remaining_cbm'],container['hs_set_id'],hs_set['hs_code_set'],container['hs_set_id']))
                    
                    """
                    Data Gathering Part
                    """
                    
                    # cursor.execute("SELECT container_box_size,container_box_count,part_a,total_people_per_shipment,total_req_cbm_per_shipment FROM ship_quotations where quotation_id='"+x['quotation_id']+"'")
                    # quotation = cursor.fetchall()
                    cursor.execute("SELECT * FROM ship_quotation_handling_charges where quotation_id='"+container['quotation_id']+"' and charges_location = 'D'")
                    handling_charges_list_delivery = cursor.fetchall()
                    cursor.execute("SELECT * FROM ship_quotation_handling_charges where quotation_id='"+container['quotation_id']+"' and charges_location = 'A'")
                    handling_charges_list_arrival = cursor.fetchall()
                    L =  int(quotation['container_box_size'])
                    Xi = int(cbm_req)
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
                    # C2 = C2A+C2D
                    # C3 = C3A+C3D
                    # C4 = C4A+C4D
                    # C5 = C5A+C5D
                    C6 = float(merchandise_value_percentage['config_value'])
                    v  = float(merchandise_value)
                    Pi = 0
                    S  = container['remaining_cbm']
                    
                    """
                    Part BA
                    """
                    partBA = ((C2A/n) + (C3A/Mj) + C4A + (C5A*Xi) + (C6*v))
                    partEBA = ((C2A/PC1) + (C3A/PC2) + C4A + (C5A*Xi) + (C6*v))
                    # print(partBA)

                    """
                    Part BD
                    """
                    partBD = ((C2D/n) + (C3D/Mj) + C4D + (C5D*Xi) + (C6*v))
                    partEBD = ((C2D/PC1) + (C3D/PC2) + C4D + (C5D*Xi) + (C6*v))
                    # print(partBD)


                    """
                    Calculation Parts
                    """
                    
                    partA1 = (C1/L * Xi)
                    partA2 = ((S/n)*(C1/L))
                    partEA2 = ((S/PC1)*(C1/L))
                    # partBS = (C2/n)
                    # partBC = (C3/Mj)
                    # partBO = C4
                    # partBCBM = (C5*Xi)
                    # partBMV = (C6*v)
                    Pi = partA1 + partA2 + partBA + partBD
                    EPi = partA1 + partEA2 + partEBA + partEBD
                    if filteration_status is True and price_end is not None and price_start is not None:
                        # print(float(price_end))
                        # print(Pi)
                        if Pi >= float(price_start) and Pi <= float(price_end):
                            print("Price Match")
                        else:
                            break

                    cursor.execute("select p1.port_name as port_from,p2.port_name as port_to\
                                from ports as p1\
                                left join ports as p2 on p2.port_id = "+str(quotation['port_id_to'])+"\
                                where p1.port_id = "+str(quotation['port_id_from'])+"")
                    ports = cursor.fetchall()
                    cursor.execute("select company_name,tax_rate,tax_type,logo from logistic_providers where login_id = "+str(quotation['supplier_login_id'])+"")
                    supplier_name = cursor.fetchone()
                    # tax_amount = (float(supplier_name['tax_rate'])/100) * Pi
                    tax_amount = Pi * (float(supplier_name['tax_rate'])/100)
                    print(tax_amount)
                    total_amount_with_tax = Pi+tax_amount
                    eligible_container_list.append({
                            "arrival_date": quotation['arrival_date'],
                            "container_id": container['container_id'],
                            "departure_date": quotation['departure_date'],
                            "halal_status": "HALAL" if halal_status == 'H' else "NON-HALAL",
                            "number_people_sharing": quotation['total_people_per_shipment'],
                            "port_from": ports[0]['port_from'],
                            "port_to": ports[0]['port_to'],
                            "quotation_id": quotation['quotation_id'],
                            "remaining_cbm": container['remaining_cbm'],
                            "supplier_name": supplier_name['company_name'],
                            "supplier_logo":os.path.join(s3url['config_value'],BUCKET_NAME,supplier_name['logo']),
                            "total_price_without_tax":"%.2f"%Pi,
                            "charges_at_departure":"%.2f"%partBD,
                            "total_part_a":"%.2f" %(partA1+partA2),
                            "charges_at_arrival":"%.2f"%partBA,
                            "tax_amount":"%.2f"%tax_amount,
                            "total_price_with_tax":"%.2f"%total_amount_with_tax,
                            "estimated_price":"%.2f"%EPi,
                            "tax_type":supplier_name['tax_type'],
                            "tax_rate":"%.2f"%supplier_name['tax_rate'],
                            "shipment_type":shipment_type['shipment_type']
                    })
                    break
                else:
                    continue
        return eligible_container_list
    except ValueError as err:
        raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
    except pymysql.IntegrityError as err:
        raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
    except Exception as err:
        raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)