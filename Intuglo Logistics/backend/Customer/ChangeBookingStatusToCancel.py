

import traceback
import sys
import falcon
import json
from memcacheResource import MemcacheFunctions
from collections import OrderedDict
from Tools import Tools
from DatabaseConnection import *
from PriceLeveraging import *



class ChangeBookingStatusToCancel__v1__(object):
    def on_patch(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        # try:
        #     if (MemcacheFunctions.IsSessionValid(login_id,session) == False):
        #         resp.status = falcon.HTTP_400
        #         message = {"status": "Invalid Login Credentials or Session is Expired"}
        #         result_json = json.dumps(message)
        #         resp.body = (result_json)
        #         return
        # except ValueError as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        # except Exception as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            # Get DB connection
            database_connection = get_db_connection()
            cursor = database_connection.cursor()           
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dictionary_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            order_id = [v for v in result_dictionary_json.values()]
            execute_price_leverage = False
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            row = Tools.getOrderStatusAndButtonCode(order_id[0],cursor)
            
            if row:
                order_status = row
                if(order_status['cargo_status_code'] == "ORDERBOOKED" or order_status['cargo_status_code']=="ORDERPLACED"):
                    order_status_code = "ORDERCANCELLED"
                    # Here setting button value 0 after cancellation of any order. 
                    # that means we don't want to display any button of this order
                    
                    database_connection.begin()
                    cursor.execute("SELECT o.cbm,q.total_req_cbm_per_shipment,q.total_people_per_shipment,c.total_cbm, c.remaining_cbm,c.halal_status,c.number_people_sharing,c.percentage_full,c.hs_set_id, \
                                    o.quotation_id,o.container_id,o.weight,c.remaining_weight \
                                    FROM ship_orders o \
                                    LEFT JOIN ship_quotations q ON o.quotation_id = q.quotation_id \
                                    LEFT JOIN ship_containers c ON o.container_id = c.container_id \
                                    where o.order_id = '"+str(order_id[0])+"'")
                    data = cursor.fetchone()
                    requested_cbm = int(data['cbm'])
                    total_req_cbm_quotation = int(data['total_req_cbm_per_shipment'])
                    total_people_per_shipment = int(data['total_people_per_shipment'])
                    cont_remaining_cbm = int(data['remaining_cbm'])
                    cont_total_cbm  = int(data['total_cbm'])
                    cont_number_people_sharing = int(data['number_people_sharing'])
                    cont_hs_set_id = data['hs_set_id']
                    cont_halal_stat = data['halal_status']
                    req_weight = int(data['weight'])
                    remaning_weight = int(data['remaining_weight'])

                    if cont_number_people_sharing >= 2:
                        total_people_per_shipment = total_people_per_shipment - 1
                        total_req_cbm_quotation = total_req_cbm_quotation - requested_cbm
                        cont_remaining_cbm = cont_remaining_cbm + requested_cbm
                        percentage_full = 100 - ((cont_remaining_cbm/cont_total_cbm)*100)
                        cont_number_people_sharing = cont_number_people_sharing - 1
                        weight = remaning_weight + req_weight
                        sql_quotation = ("update ship_quotations set total_people_per_shipment=%s,total_req_cbm_per_shipment=%s where quotation_id = %s")
                        sql_container = ("update ship_containers set remaining_cbm = %s,number_people_sharing = %s, percentage_full = %s, remaining_weight = %s where container_id = %s")
                        args_quotation = (total_people_per_shipment,total_req_cbm_quotation,data['quotation_id'])
                        args_container = (cont_remaining_cbm,cont_number_people_sharing,percentage_full,weight,data['container_id'])
                        execute_price_leverage = True
                    elif cont_number_people_sharing == 1:
                        print("entering elif")
                        total_people_per_shipment = total_people_per_shipment - 1
                        total_req_cbm_quotation = total_req_cbm_quotation - requested_cbm
                        cont_remaining_cbm = cont_remaining_cbm + requested_cbm
                        percentage_full = 100 - ((cont_remaining_cbm/cont_total_cbm)*100)
                        cont_number_people_sharing = cont_number_people_sharing - 1
                        weight = remaning_weight + req_weight
                        cont_hs_set_id = 'HSX'
                        cont_halal_stat = 'U'
                        container_new_id = Tools.GetContainerID("DUMMY",1,cursor,database_connection,data['container_id'],cont_hs_set_id,cont_halal_stat)
                        sql_quotation = ("update ship_quotations set total_people_per_shipment = %s,total_req_cbm_per_shipment=%s where quotation_id = %s")
                        sql_container = ("update ship_containers set remaining_cbm = %s,number_people_sharing = %s, percentage_full = %s,hs_set_id = %s,halal_status = %s,container_id=%s, remaining_weight = %s where container_id = %s")
                        args_quotation = (total_people_per_shipment,total_req_cbm_quotation,data['quotation_id'])
                        args_container = (cont_remaining_cbm,cont_number_people_sharing,percentage_full,cont_hs_set_id,cont_halal_stat,container_new_id,weight,data['container_id'])
                        execute_price_leverage = False
                    cursor.execute(sql_quotation,args_quotation)
                    cursor.execute(sql_container,args_container)
                    if execute_price_leverage:
                        print("Leveraging")
                        PriveLeveraging(data['quotation_id'],cursor)
                    database_connection.commit()
                    current_button_code = 0
                    Tools.ChangeBookingStatus(order_id[0],order_status_code,current_button_code,cursor,database_connection)
                    resp.status = falcon.HTTP_200
                    message = {"status": "Booking Status has been cancelled successfully"}
                    result_json = json.dumps(message)
                    resp.body = (result_json)
                else:
                    resp.status = falcon.HTTP_200
                    message = {"status": "You are not allowed to cancel the booking status of this booking"}
                    result_json = json.dumps(message)
                    resp.body = (result_json)
            else:
                resp.status = falcon.HTTP_400
                message = {"status": "Please login and try again"}
                result_json = json.dumps(message)
                resp.body = (result_json)
                
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
