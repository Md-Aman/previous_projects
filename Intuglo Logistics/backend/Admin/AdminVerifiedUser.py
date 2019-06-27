'''
Name  :  AdminVerifiedUser
Usage : This API will activate the status to "ACTIVE" / "DEACTIVE with the passed parameter loginID and verifiedUser.
Description  : This code interacts with logins table.
'''

import sys
import traceback
import falcon
import json
import pymysql
from SessionManagement import createSession
from memcacheResource import MemcacheFunctions
from DatabaseConnection import *
from collections import OrderedDict


class AdminVerifiedUserResource__v1__(object):
    def on_patch(self, req, resp, login_id, session):
        #Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_401
                Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Error)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', err.args)
            
        try :
            # Reading Json
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            resultdict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Get dict values from passed parameter JSON w key verified_user&login_id
            list_values = [v for v in resultdict_json.values()] 
            login_id = list_values[0]
            verified_user = list_values[1]
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Query to update data on this tbl based on passed parameter
            cursor.execute("UPDATE logins SET verified_user='"+str(verified_user)+"'\
                            WHERE login_id ='"+str(login_id)+"'")
            database_connection.commit()
            row = cursor.fetchone()
            if(cursor.rowcount>0):
                # UserDetails = row
                # print(UserDetails)
                # if(UserDetails['verified_user'] == '1'):
                resp.status = falcon.HTTP_200
                message = {"status":"200","Message": "Updated successfully!"}
                result_json = json.dumps(message)
                resp.body = result_json
                #     return
                # elif(UserDetails['verified_user'] =='0'):
                #     resp.status = falcon.HTTP_200
                #     message = {"Message": "Deactivated successfully!"}
                #     result_json = json.dumps(message)
                #     resp.body = result_json
                #     return
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "User is not found"}
                result_json = json.dumps(message)
                resp.body = result_json
                return
        except ValueError as err:
            raise resp.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise resp.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()



    def on_get(self, req, resp, login_id, session,merchant_id):
        #Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_401
                Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Error)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', err.args)
            
        try :
            # Connecting DB
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Query to display data from this tbl w given merchantID parameter
            cursor.execute("SELECT verified_user AS Status\
                            FROM logins\
                            WHERE merchant_id ='"+merchant_id+"'")
            row = cursor.fetchone()
            if(cursor.rowcount>0):
                UserDetails = row
                resp.status = falcon.HTTP_200
                result_json = json.dumps(UserDetails,sort_keys=True)
                resp.body = result_json
        
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Status is not found"}
                result_json = json.dumps(message)
                resp.body = result_json
        except ValueError as err:
            raise resp.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise resp.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()