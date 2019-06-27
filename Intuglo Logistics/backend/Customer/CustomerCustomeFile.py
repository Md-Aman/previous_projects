'''
Name  : BookingList
Description  : To store,get and delete the file that has been uploaded to the database. 
            The table used is custom_documents.
'''

import falcon
import json
import traceback
import sys
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
import aws_cred
import os


class CustomerCustomeFile__v1__(object):
    # To upload file 
    def on_post(self, req, resp, login_id, session,order_id):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id,session) == False):
                resp.status = falcon.HTTP_401
                Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Err)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            # Reading JSON from Restlet
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            resultdict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            list_values = [result_value for result_value in resultdict_json.values()]
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            args=(list_values[0],list_values[1],list_values[2],order_id)
            cursor.execute("insert into ship_custom_documents(custom_documents_id,file_name,file_title,order_id) \
                            values(%s,%s,%s,%s)",args)
            database_connection.commit()
            # JSON Response
            resp.status = falcon.HTTP_200
            message = {'Status': 'The file is uploaded successfully'}
            result_json = json.dumps(message)
            resp.body = result_json
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except mysql.connector.Error as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()

    # To display file uploaded from database
    def on_get(self, req, resp, login_id, session, order_id):
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
        
        try:
            # Database Connection
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select custom_documents_id,file_name\
                           from ship_custom_documents\
                           where order_id='"+ order_id +"'")
            row = cursor.fetchall()
            if (cursor.rowcount > 0) :
                list_values = row
                result_json = json.dumps(list_values,sort_keys=True)
                resp.status = falcon.HTTP_200
                resp.body = result_json
            else:
                # JSON response
                resp.status = falcon.HTTP_204
                resp.body = ("204")
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except mysql.connector.Error as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()

    #  To delete file from database
    def on_patch(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_401
                Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Error)
                resp.body = result_json
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as ex:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', ex.args)
        try :
           # Reading Json from Reslet
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            resultdict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Converting Json to List
            list_values = [v for v in resultdict_json.values()]
            custom_documents_id = list_values[0]
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 's3-bucket-customdoc'")
            BUCKET_NAME = cursor.fetchone()
            s3 = aws_cred.aws_s3(BUCKET_NAME['config_value'])
            cursor.execute("select order_id,file_name from ship_custom_documents where custom_documents_id ="+str(custom_documents_id)+"")
            row = cursor.fetchone()
            obj = s3.Object(BUCKET_NAME['config_value'],os.path.join(row['order_id'],row['file_name']))
            obj.delete()
            # Delete custom_documents_id
            cursor.execute("delete ship_custom_documents from ship_custom_documents where custom_documents_id ="+str(custom_documents_id)+"")
            database_connection.commit()
            if(cursor.rowcount == 1):
                resp.status = falcon.HTTP_200
                resp.body = ("200")
            else:
                resp.status = falcon.HTTP_204
                resp.body = ("204")
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except mysql.connector.Error as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
            