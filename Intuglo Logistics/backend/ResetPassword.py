'''
Name  :  Reset Password
Usage :  Reset's password and send the password through email.
Description  :  This code is to reset the password if the token validity is not expired then a generated password will be send to the users.
'''

import falcon
import json
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
import traceback
import sys
from datetime import datetime
from Tools import Tools
import string
import bcrypt
from EmailTools import EmailTools

class ResetPassword__V1__(object):
    def on_patch(self, req, resp):
        try:
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dictionary_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            list_values = [v for v in result_dictionary_json.values()]
            # call function to get database connection
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select token_validity from logins where token_id ='"+list_values[0]+"'")
            row = cursor.fetchone()
            
            tokenValidity = row['token_validity']

            todayDate = datetime.today().strftime('%Y-%m-%d')

            tokenValidityDate = tokenValidity.strftime('%Y-%m-%d')

            if todayDate <= tokenValidityDate:
                tempPassword = Tools.TemporaryPassword(size = 8, chars = string.ascii_uppercase + string.digits)
                binary_password = bcrypt.hashpw(tempPassword.encode('utf-8'),bcrypt.gensalt())
                cursor.execute("select email from logins where token_id ='"+list_values[0]+"'")
                row = cursor.fetchall()
                query = "update logins set password = %s where token_id = %s"
                data = (binary_password,list_values[0])
                cursor.execute(query,data)
                database_connection.commit()
                print("Email Fucntion")
                EmailTools.TemporaryPasswordEmail(row[0]['email'],3, tempPassword)
                print("Exit Email Function")
                resp.status = falcon.HTTP_200
                resp.body = json.dumps(200)
            else:
                resp.status = falcon.HTTP_204
                resp.body = json.dumps(204)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()

