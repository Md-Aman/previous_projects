'''
Name  :  CheckEmailValidity
Usage :  To check email validity before sending a reset link for password reset
Description  :  This code checks if the email is valid in database and send a link to the user for password reset.
                If email is valid a new token is generated with the expiry time and a email notification is send to user
                with the reset link.
'''

import pymysql
import falcon
import json
import string
import random
from Tools import Tools
from DatabaseConnection import *
import traceback
import sys
from EmailTools import EmailTools



class CheckEmailValidity__v1__(object):
    def on_get(self, req, resp,email):
        try:
            database_connection =get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select count(1) from logins where email = '"+email+"'")
            row = cursor.fetchone()
            if row['count(1)'] is 1:
                cursor.execute("select config_value from config where config_key='validity-days'")
                row = cursor.fetchone()
                validity_days = row['config_value']
                tokenID = Tools.GenerateTokenId()
                
                query = "update logins set token_id = %s , token_validity = DATE_ADD(current_timestamp, INTERVAL %s DAY) where email = %s"
                data = (tokenID,validity_days,email)
                cursor.execute(query,data)
                database_connection.commit()
                EmailTools.ResetPasswordEmail(email,2,tokenID)
                if cursor.rowcount is 1:
                    resp.status = falcon.HTTP_200
                    resp.body = ("200")
            else:
                resp.status = falcon.HTTP_204
                resp.body = ("204")
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()