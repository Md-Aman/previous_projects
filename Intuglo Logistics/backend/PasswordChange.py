'''
Name  :  PasswordChange
Description  :  A patch resource that enable the customer to change the current password to a new password. 
				Updates customer password and saves them. This resources interacts
				with logins table.
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
import bcrypt
from EmailTools import EmailTools


class PasswordChange__v1__(object):
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
			# Receive customer passwords
			raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
			result_dict_json = json.loads(raw_json,object_pairs_hook=OrderedDict, encoding='utf-8')
			passwords = [v for v in result_dict_json.values()]
			old_password = passwords[0]
			new_password = passwords[1]
			# Connecting the database
			database_connection = get_db_connection()
			cursor = database_connection.cursor()
			cursor.execute("Select email,password from logins where login_id = '"+login_id+"'")
			row = cursor.fetchone()
			if row:
				status = bcrypt.checkpw(old_password.encode('utf-8'),row['password'])
				if status :
					binary_password = bcrypt.hashpw(new_password.encode('utf-8'),bcrypt.gensalt())
					similar = bcrypt.checkpw(old_password.encode('utf-8'),binary_password)
					print(similar)
					if not similar:
						Tools.ChangePassword(login_id, binary_password,cursor,database_connection)
						EmailTools.changePasswordNotification(row['email'])
						resp.status = falcon.HTTP_200
						message = {"status": "Your password is successfully updated"}
						result_json = json.dumps(message)
						resp.body = (result_json)
					else:
						resp.status = falcon.HTTP_200
						message = {"status": "New password can not be same as current password. Please enter different password."}
						result_json = json.dumps(message)
						resp.body = (result_json)
				else:
					resp.status = falcon.HTTP_200
					message = {"status": "Incorrect Password Entered"}
					result_json = json.dumps(message)
					resp.body = (result_json)
			else:
				resp.status = falcon.HTTP_204
				message = {"status": "No Content"}
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