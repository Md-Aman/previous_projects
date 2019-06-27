'''
Name  :  UpdateOrderStatus
Description  : Gets customer order details and displays them.
Updates customer order details and saves them.
'''

import traceback
import sys
import falcon
import json
import pymysql
import random
from PriceLeveraging import *
from Tools import *
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__


class EnterPaymentGateway__v1__(object):
    def on_get(self, req, resp, login_id, session,cart_id):
        # try:
        #     if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
        #         resp.status = falcon.HTTP_401
        #         Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
        #         result_json = json.dumps(Error)
        #         resp.body = result_json
        #         return
        # except ValueError as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        # except Exception as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        # if Authentication true the code below runs
        try:
            # raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            # result_dict_json = json.loads(raw_json,object_pairs_hook=OrderedDict,encoding='utf-8')
            # list_values = [v for v in result_dict_json.values()]
            # cart_id = str(list_values[0])
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # cart_id = req.get_param('cart_id')
            cursor.execute("select * from ship_temp_orders where cart_id = '"+cart_id+"'")
            cart_list = cursor.fetchall()
            if (cursor.rowcount > 0):
                database_connection.begin()
                for carts in cart_list:
                    if Tools.container_avail_status(carts['cbm'],carts['weight'],carts['container_id'],cursor) is True:
                        cursor.execute("select remaining_cbm,total_cbm,hs_set_id,number_people_sharing,remaining_weight,total_weight from ship_containers where container_id =%s",carts['container_id'])
                        row = cursor.fetchone()
                        print("Getting Containers")
                        remaining_cbm = int(row['remaining_cbm']) - int(carts['cbm'])
                        percentage = 100 - (remaining_cbm/int(row['total_cbm'])*100)
                        people_sharing = int(row['number_people_sharing']) + 1
                        remaining_weight = int(row['remaining_weight']) - int(carts['weight'])
                        if row['hs_set_id'] == 'HSX':
                            print("Updating Containers")
                            halal_status = carts['halal_status']
                            cursor.execute("select hs_code_set from hs_set where hs_chapter = "+str(carts['hs_code_id'])[0:2]+"")
                            hs_set_of_cust = cursor.fetchone()
                            print(hs_set_of_cust)
                            # container_id = Tools.GetContainerID(carts['quotation_id'],1,None,None,carts['container_id'],hs_set_of_cust['hs_code_set'],halal_status)
                            sql = "update ship_containers set remaining_cbm = %s,halal_status = %s,number_people_sharing = %s,percentage_full = %s,hs_set_id = %s,remaining_weight=%s where container_id = %s"
                            data = (remaining_cbm,halal_status,people_sharing,percentage,hs_set_of_cust['hs_code_set'],remaining_weight,carts['container_id'])
                            cursor.execute(sql,data)
                        else:
                            print("Updtating Containers on else")
                            sql = "update ship_containers set remaining_cbm = %s,number_people_sharing = %s,percentage_full = %s,remaining_weight=%s where container_id = %s"
                            data = (remaining_cbm,people_sharing,percentage,remaining_weight,carts['container_id'])
                            cursor.execute(sql,data)
                    else:
                        database_connection.rollback()
                        cursor.execute("delete from ship_temp_orders where cart_item_id = %s",(carts['cart_item_id']))
                        cursor.execute("delete from carts_item where cart_item_id = %s",carts['cart_item_id'])
                        cursor.execute("select port_name_departure,port_name_arrival from ship_admin_quotation_list_view where quotation_id = '"+carts['quotation_id']+"'")
                        row = cursor.fetchone()
                        resp.status = falcon.HTTP_401
                        message = {"status":"Container for shipment %s-%s if fully occupied.This item will removed from the cart. Please choose a different shipment container." %(row['port_name_departure'],row['port_name_arrival'])}
                        result_json = json.dumps(message)
                        resp.body = result_json
                        break
                else:
                    resp.status = falcon.HTTP_200
                    message = {"Reason": "Allowed"}
                    result_json = json.dumps(message)
                    resp.body = result_json
                database_connection.commit()
                    
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) ,err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) ,err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) ,err.args)
        finally:
            cursor.close()
            database_connection.close()
            
