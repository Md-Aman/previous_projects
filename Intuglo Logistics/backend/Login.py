'''
Name   :   Login
Usage  :   Get Resource for Login screen
Description : This code is used to Login into Intuglo Logistics and interacts with the logins and config tables.
'''

import falcon
import json
import pymysql
from SessionManagement import createSession
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
import traceback
import sys
import bcrypt

class LoginResource__v1__(object):
    def on_get(self, req, resp, user, password):
        try:
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("SELECT password from logins where email = '"+user+"' ")
            row = cursor.fetchone()
            if(cursor.rowcount>0):
                status = bcrypt.checkpw(password.encode('utf-8'),row['password'])
                if status:
                    cursor.execute("SELECT logins.login_id,logins.is_active,logins.is_on_boarded, logins.merchant_id,logistic_providers.supplier_id,\
                    logistic_providers.supplier_name,customers.customer_name, customers.customer_id,custom_agent.agent_name,customers.cart_id,\
                    custom_agent.custom_agent_id,admin_profile.admin_name,admin_profile.admin_id,logins.user_type\
                        FROM logins\
                        LEFT JOIN logistic_providers ON  logins.login_id = logistic_providers.login_id\
                        LEFT JOIN customers ON logins.login_id = customers.login_id\
                        LEFT JOIN custom_agent ON logins.login_id = custom_agent.login_id\
                        LEFT JOIN admin_profile ON logins.login_id = admin_profile.login_id\
                        WHERE logins.email = '"+user+"'")
                    
                    row = cursor.fetchall()
                    UserDetails=list(row)
                    NewDict = dict()
                    for k,v in UserDetails[0].items():
                        if v is not None:
                            NewDict[k] = v
                    if(NewDict['is_active']==1):
                        SessionID = createSession(user)
                        resp.status = falcon.HTTP_200
                        login_id = str(NewDict['login_id'])
                        MemcacheFunctions.mc.set(login_id,SessionID,300)
                        NewDict['SessionID'] = SessionID
                        if (NewDict['user_type'] is 1):
                            NewDict['UserID'] = NewDict.pop('supplier_id')
                            NewDict['UserName'] = NewDict.pop('supplier_name')
                        elif (NewDict['user_type'] is 2):
                            NewDict['UserID'] = NewDict.pop('customer_id')
                            NewDict['UserName'] = NewDict.pop('customer_name')
                            if 'cart_id' in NewDict:
                                old_cart_id = NewDict['cart_id']
                                cursor.execute("select cart_status from carts where cart_id = "+str(NewDict['cart_id'])+"")
                                cart_info = cursor.fetchone()
                                if cursor.rowcount > 0:
                                    if cart_info['cart_status'] == 'PAID':
                                        database_connection.begin()
                                        cursor.execute("insert into carts(login_id) VALUES ("+str(NewDict['login_id'])+")")
                                        cart_id = cursor.lastrowid
                                        NewDict['cart_id'] = cart_id
                                        cursor.execute("update customers set cart_id = "+str(cart_id)+" where cart_id = "+str(old_cart_id)+"")
                                        database_connection.commit()
                            else:
                                cursor.execute("insert into carts(login_id) VALUES ("+str(NewDict['login_id'])+")")
                                database_connection.commit()
                                cart_id = cursor.lastrowid
                                NewDict['cart_id'] = cart_id
                                cursor.execute("update customers set cart_id = "+str(cart_id)+" where customer_id = "+str(NewDict['UserID'])+"")
                                database_connection.commit()
                        elif (NewDict['user_type'] is 3):
                            NewDict['UserID'] = NewDict.pop('custom_agent_id')
                            NewDict['UserName'] = NewDict.pop('agent_name')
                        elif (NewDict['user_type'] is 0):
                            NewDict['UserID'] = NewDict.pop('admin_id')
                            NewDict['UserName'] = NewDict.pop('admin_name')
                        result_json = json.dumps(NewDict, sort_keys=True)
                        resp.body = (result_json)
                    else:
                        resp.status = falcon.HTTP_200
                        Err = {"Reason": "Your account is not active"}
                        result_json = json.dumps(Err)
                        resp.body = (result_json)
                else:
                    resp.status = falcon.HTTP_401
                    Error = {"Error Message": "Your email or password is incorrect."}
                    jsonresult = json.dumps(Error)
                    resp.body = (jsonresult)
            else:
                resp.status = falcon.HTTP_204
                Error = {"Error Message": "Email is not found. Please Sign Up."}
                jsonresult = json.dumps(Error)
                resp.body = (jsonresult)
            
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()