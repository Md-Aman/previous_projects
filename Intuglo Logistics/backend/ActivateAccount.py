import falcon
import json
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
import traceback
import sys
from datetime import datetime
import string
import bcrypt
from EmailTools import EmailTools
from Tools import *

class ActivateAccount__v1__(object):
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
            query = ("update logins set is_active = 1 where token_id ='"+list_values[0]+"' and '"+todayDate+"' < '"+tokenValidityDate+"'")
            cursor.execute(query)
            database_connection.commit()
            if(cursor.rowcount == 1):
                tempPassword = Tools.TemporaryPassword(size = 8, chars = string.ascii_uppercase + string.digits)
                binary_password = bcrypt.hashpw(tempPassword.encode('utf-8'),bcrypt.gensalt())
                print(binary_password)
                cursor.execute("select email from logins where token_id ='"+list_values[0]+"'")
                row = cursor.fetchall()
                query = "update logins set password = %s where token_id = %s"
                data = (binary_password,list_values[0])
                cursor.execute(query,data)
                database_connection.commit()
                EmailTools.TemporaryPasswordEmail(row[0]['email'],1, tempPassword)
                resp.status = falcon.HTTP_200
                message = {"status": "Your account is activated successully"}
                print(message)
                result_json = json.dumps(message)
                resp.body = (result_json)
            else:
                resp.status = falcon.HTTP_200
                message = {"Status": "Your account is not activated"}
                print(message)
                result_json = json.dumps(message)
                resp.body = (result_json)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()

