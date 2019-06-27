'''
Name  :  SignUp
Usage :  Post Resource to create an account
Description  :  This code is used to create an account in Intuglo Logistics and interacts with logins and users tables. It uses SignupUser
                Stored procedure and creates temporary password automatically
'''

import pymysql
import falcon
import json
import string
import random
from Tools import Tools
from EmailTools import EmailTools
from DatabaseConnection import *
from collections import OrderedDict
import traceback
import sys



class SignupResource__v1__(object):
    def on_post(self, req, resp):
        try:
            # Reading Json
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            resultdict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Converting Json to List
            list_values = [v for v in resultdict_json.values()]
            # Database Connection
            database_connection =get_db_connection()
            cursor = database_connection.cursor()
            # Accessing Temporary password function from Tools
            tempPassword = Tools.TemporaryPassword(size = 8, chars = string.ascii_uppercase + string.digits)
            # Accessing GenerateTokenId from Tools
            tokenID = Tools.GenerateTokenId()
            EmailTools.ActivationEmail(list_values[5],"Intuglo Account Activation",list_values[0],tokenID)
            status_signup = Tools.SignupUser(resultdict_json['Name'], resultdict_json['PhoneNumber'], resultdict_json['Country'], resultdict_json['Business'], resultdict_json['Industry'],resultdict_json['Email'],resultdict_json['UserType'],2,tokenID,tempPassword,cursor,database_connection)
            if(status_signup is True):
                resp.status = falcon.HTTP_200
                message = {'Status': 'Your account is successfully created'}
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