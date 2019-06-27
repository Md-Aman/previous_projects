'''
Name   :   AdminViewListOfUser
Usage  :   Get the list of users based on their usertype and to update the status of verified_user.
Description : This API is used to display list of user based on their usertype. Usertype is a parameter.
              As for updating the status of verified user, it requires loginID and status as a passed parameter.
'''

import traceback
import sys
import json
import simplejson as json
import falcon
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from collections import OrderedDict


class AdminViewListOfUserResource__v1__(object):
    def on_get(self, req, resp, login_id, session, user_type, country_code):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_400
                Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Error)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()

            # usertype : 1-Supplier, 2-Customer, 3-Custom Agent    
            if user_type == '1':
                list_of_supplier = ("select l.login_id,l.merchant_id,l.verified_user,s.supplier_name as account_name\
                                    from logins l\
                                    LEFT JOIN logistic_providers s ON s.login_id = l.login_id\
                                    where l.user_type = '"+user_type+"' AND s.country_code = '"+country_code+"'")
                cursor.execute(list_of_supplier)
                row = cursor.fetchall()
                if(cursor.rowcount > 0):
                    list_values = row
                    # If list of document's files merge them together
                    for x in list_values:
                        cursor.execute("SELECT profile_documents_id,file_name FROM profile_documents\
                                        where login_id = "+str(x['login_id'])+"")
                        row = cursor.fetchall()
                        if(cursor.rowcount > 0):
                            x['documents'] = row
                        else:
                            x['documents'] = row
                    result_json = json.dumps(list_values,sort_keys=True,default=str)
                    resp.status = falcon.HTTP_200
                    resp.body = result_json
                else:
                    resp.status = falcon.HTTP_204
                    message = {"Message": "User is not found"}
                    result_json = json.dumps(message)
                    resp.body = result_json


            elif user_type == '2':
                list_of_customer = ("select l.login_id,l.merchant_id,l.verified_user,c.customer_name as account_name\
                                    from logins l\
                                    LEFT JOIN customers c ON c.login_id = l.login_id\
                                    where l.user_type = '"+user_type+"' AND c.country_code = '"+country_code+"'")
                cursor.execute(list_of_customer)
                row = cursor.fetchall()
                if(cursor.rowcount > 0):
                    list_values = row
                    # If list of document's files merge them together
                    for x in list_values:
                        cursor.execute("SELECT profile_documents_id,file_name FROM profile_documents\
                                        where login_id = "+str(x['login_id'])+"")
                        row = cursor.fetchall()
                        if(cursor.rowcount > 0):
                            x['documents'] = row
                        else:
                            x['documents'] = row
                    result_json = json.dumps(list_values,sort_keys=True,default=str)
                    resp.status = falcon.HTTP_200
                    resp.body = result_json
                else:
                    resp.status = falcon.HTTP_204
                    message = {"Message": "User is not found"}
                    result_json = json.dumps(message)
                    resp.body = result_json

            elif user_type == '3' :  
                list_of_customagent = ("select l.login_id,l.merchant_id,l.verified_user,ca.agent_name as account_name\
                                        from logins l\
                                        LEFT JOIN custom_agent ca ON ca.login_id = l.login_id\
                                        where l.user_type = '"+user_type+"' AND ca.country_code = '"+country_code+"'")
                cursor.execute(list_of_customagent)
                row = cursor.fetchall()
                if(cursor.rowcount > 0):
                    list_values = row
                    # If list of document's files merge them together
                    for x in list_values:
                        cursor.execute("SELECT profile_documents_id,file_name FROM profile_documents\
                                        where login_id = "+str(x['login_id'])+"")
                        row = cursor.fetchall()
                        if(cursor.rowcount > 0):
                            x['documents'] = row
                        else:
                            x['documents'] = row
                    result_json = json.dumps(list_values,sort_keys=True,default=str)
                    resp.status = falcon.HTTP_200
                    resp.body = result_json
                else:
                    resp.status = falcon.HTTP_204
                    message = {"Message": "User is not found"}
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



    # Function : To update verified_user    
    def on_patch(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id,session) == False):
                resp.status = falcon.HTTP_400
                message = {"status": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(message)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dict_json = json.loads(raw_json,object_pairs_hook=OrderedDict,encoding='utf-8')
            # Get dict values from passed parameter JSON. Contains key login_id&verified_user
            list_values = [v for v in result_dict_json.values()]
            login_id = str(list_values[0])
            verified_user = str(list_values[1])
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Query to update data from this tbl w given passed parameter
            cursor.execute("update logins set verified_user ='" + list_values[1] + "'\
                            where login_id = '"+login_id+"'")
            database_connection.commit()
            if cursor.rowcount > 0:
                resp.status = falcon.HTTP_200
                message = {"Update": "Status of user verification is updated"}
                result_json = json.dumps(message)
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                message = {"Update": "Status of user verification is updated"}
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
            
