'''
Name  :  FakeSignUp
Usage :  Post Resource to create an account
Description  :  This code is used to create an account in Intuglo Logistics and interacts with logins and users tables. It uses SignupUser
                Stored procedure and creates temporary password automatically
'''

import IntugloApp
import falcon
import json
import string
import random
from Tools import Tools
from DatabaseConnection import *
from collections import OrderedDict
import traceback
import sys


class FakeSignupResource__v1__(object):
    def on_post(self, req, resp):
        try:
            # Reading Json
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            resultdict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Converting Json to List
            list_values = [v for v in resultdict_json.values()]
            # Get DB connection
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Accessing Temporary password function from Tools
            tempPassword = Tools.TemporaryPassword(size = 8, chars = string.ascii_uppercase + string.digits)
            # Accessing GenerateTokenId from Tools
            tokenID = Tools.GenerateTokenId()
            # Tools.ActivationEmail(list_values[5], "Activate your Account", list_values[0], tokenID)
            status_signup = Tools.SignupUser(list_values[0], str(list_values[1]), list_values[2], list_values[3], list_values[4],list_values[5],list_values[6],list_values[7],tempPassword,tokenID, cursor,database_connection)
            if(status_signup is True):
                resp.status = falcon.HTTP_200
                message = tempPassword
                result_json = json.dumps(message,default=str)
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_400
                message = {'Status': 'Email existed. Try login with another email'}
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