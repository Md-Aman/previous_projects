'''
Name  :  UserUpdateContainer
Description  :  This API is for modifying/updating the container based on container ID and quotation ID.
                ContainerID and  QuotationID is a passed parameter.This resource interacts with ship_containers 
                & ship_quotations table.
'''

import falcon
import json
import traceback
import sys
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
from Tools import Tools


class UserUpdateContainerResource__v1__(object):
	def on_patch(self, req, resp, login_id, session):
		# Authenticate login id and session availability.
		try:
			if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
				resp.status = falcon.HTTP_401
				message = {"Reason": "Invalid Login Credentials or Session Expired"}
				result_json = json.dumps(message)
				resp.body = result_json
				return
		except ValueError as err:
			raise falcon.HTTPError(falcon.HTTP_400,traceback.print_exc(file=sys.stdout),err.args)
		except Exception as err:
			raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout),err.args)
        
		try:
			# Receive containers details from json
			raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
			result_dict_json = json.loads(raw_json,object_pairs_hook=OrderedDict, encoding='utf-8')
			list_values = [v for v in result_dict_json[0].values()]

			# Connecting the database
			database_connection = get_db_connection()
			cursor = database_connection.cursor()
            # UPDATE CONTAINER
			cursor.execute("SELECT halal_status,remaining_cbm,number_people_sharing\
                            FROM ship_containers\
                            WHERE container_id = '"+list_values[3]+"'")
			container = cursor.fetchone()
			cursor.execute("SELECT total_req_cbm_per_shipment, total_people_per_shipment \
							FROM ship_quotations\
							WHERE quotation_id ='"+ list_values[2]+"'")
			quotation = cursor.fetchone()
			remainingCbm = container['remaining_cbm']
			total_people_share = container['number_people_sharing']
			cbm_req = int(list_values[0])
			total_people_ship = quotation['total_people_per_shipment']
			total_req_cbm_ship = quotation['total_req_cbm_per_shipment']
			container_id = list_values[3]
			quotation_id = list_values[2]
			if(cursor.rowcount >0):
				# Check if the user is a first time
				if(container['halal_status']=='U'):
					cursor.execute("UPDATE ship_containers\
									SET remaining_cbm='"+ str(remainingCbm - cbm_req) +"', number_people_sharing='1', halal_status= '"+str(list_values[1])+"'\
									WHERE container_id = "+container_id+"")
					cursor.execute("UPDATE ship_quotations\
									SET total_people_per_shipment='"+ str(total_people_ship + 1) +"', total_req_cbm_per_shipment='"+ str(total_req_cbm_ship + cbm_req) +"'\
									WHERE quotation_id = '"+quotation_id+"'")
					
					database_connection.commit()
					resp.status = falcon.HTTP_200
					message = {"Message": "Container and Quotation details are updated sucessfully!"}
					result_json = json.dumps(message)
					resp.body = result_json
				else:
					cursor.execute("UPDATE ship_containers SET remaining_cbm='"+ str(remainingCbm - cbm_req) +"', number_people_sharing='"+ str(total_people_share + 1) +"' WHERE container_id = "+str(container_id)+"")
					cursor.execute("UPDATE ship_quotations\
									SET total_people_per_shipment="+ str(total_people_ship + 1) +", total_req_cbm_per_shipment="+ str(total_req_cbm_ship + cbm_req) +"\
									WHERE quotation_id = '"+quotation_id+"'")
					database_connection.commit()
					resp.status = falcon.HTTP_200
					message = {"Message": "Container and Quotation details are updated sucessfully!"}
					result_json = json.dumps(message)
					resp.body = result_json
			else:
				resp.status = falcon.HTTP_204
				message = {"Message": "ContainerID/QuotationID is not exist"}
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

           