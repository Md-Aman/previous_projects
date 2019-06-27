'''
Name  :  CustomAgentProfile
Description  :  This API returns details of custom agent and updates custom agent details with parameters of
                LoginID and SessionID. It interacts with custom_agent table.  
'''

import traceback
import sys
import falcon
import json
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__
from Tools import Tools
from SessionManagement import createSession


class CustomAgentProfileResource__v1__(object):
    def on_get(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
            try:
                if(MemcacheFunctions.IsSessionValid(login_id, session)):
                    resp.status = falcon.HTTP_401
                    Err = {"status": "Invalid Login Credentials or Session is Expired"}
                    result_json = json.dumps(Err)
                    resp.body = (result_json)
            except ValueError as err:
                raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
            except Exception as err:
                raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
            try:
                # Connecting the database
                database_connection = get_db_connection()
                cursor = database_connection.cursor()
                # Query to display custom agent data from this tbl w given custom_agent_login_id
                cursor.execute("select custom_agent.agent_name,custom_agent.company_name,custom_agent.company_registration_no,custom_agent.mobile_no,\
                            custom_agent.address_line_one,custom_agent.address_line_two,custom_agent.official_email,custom_agent.website,\
                            custom_agent.office_phone,custom_agent.office_fax,custom_agent.association_club,custom_agent.nature_of_business,\
                            custom_agent.import_export_license,custom_agent.business_license,custom_agent.city,custom_agent.postal_code,custom_agent.state,\
                            custom_agent.country_code,custom_agent.business_id,custom_agent.industry_id,custom_agent.business_size,custom_agent.timezone, l.merchant_id \
                            from custom_agent as custom_agent\
                            join logins l on custom_agent.login_id = l.login_id\
                            where custom_agent.login_id = '"+login_id+"'")
                row = cursor.fetchall()
                if(cursor.rowcount > 0):
                    list_values = list(row)
                    resp.status = falcon.HTTP_200
                    result_json = json.dumps(list_values, sort_keys=True)
                    resp.body = result_json

                else:
                    resp.status = falcon.HTTP_204
                    message = {"message": "Custom agent details not found!"}
                    result_json = json.dumps(message)
                    resp.body = result_json

            except ValueError as err:
                raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
            except pymysql.IntegrityError as err:
                raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
            except Exception as err:
                raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
            finally:
                cursor.close()
                database_connection.close()



    def on_patch(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        print("PATCH")
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_400
                Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Err)
                resp.body = result_json
                return

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        
        try:
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Get dict values from passed parameter JSON. 
            list_values = [v for v in result_dict_json.values()]
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Query to display data from this tbl w given login_id
            cursor.execute("select is_on_boarded from logins where login_id = '"+login_id+"'")
            row = cursor.fetchone()

            if row:
                # Query to update data from this tbl based on passed parameter JSON
                cursor.execute("""update custom_agent SET company_name=%s,company_registration_no=%s,agent_name=%s,mobile_no=%s,
                                official_email=%s,office_phone=%s,office_fax=%s,website=%s,address_line_one=%s,address_line_two=%s, industry_id=%s, business_id=%s,
                                business_size=%s,association_club=%s, business_license=%s, import_export_license=%s,
                                city=%s, postal_code=%s, state=%s, country_code=%s, timezone=%s WHERE login_id=%s""",
                                (list_values[0], list_values[1], list_values[2], list_values[3], list_values[4],list_values[5], list_values[6], list_values[7],
                                list_values[8], list_values[9], list_values[10], list_values[11], list_values[12],list_values[13], list_values[14],
                                list_values[15], list_values[16], list_values[17], list_values[18], list_values[19],list_values[20],login_id))
                database_connection.commit()
                on_boarded_status = list(row)

                if (on_boarded_status[0] != 1):
                    Tools.ChangeUserOnBoardedStatus(login_id, "1",cursor,database_connection)
                    Tools.GetMerchantID(list_values[19],list_values[11],list_values[10],list_values[12],login_id,cursor,database_connection)
                    print("Merchant")
                    SessionID = createSession(session)
                    on_boarded_status.append(session)
                    print("onboarded",on_boarded_status)
                    resp.status = falcon.HTTP_200
                    login_id = str(on_boarded_status[1])
                    MemcacheFunctions.mc.set(login_id, SessionID, 300)
                    columns = ('Login_ID', 'Active', 'User Type', 'Is On Boarded', 'CustomAgentName', 'CustomAgentName', 'SessionID')
                    UserInfo_dictionary = dict(zip(columns, on_boarded_status))
                    result_json = json.dumps(UserInfo_dictionary, sort_keys=True)

                    if (resp.status == falcon.HTTP_200):
                        message = {"status": "200"}
                        result_json = json.dumps(message)
                        resp.body = (result_json)

                else:
                    resp.status = falcon.HTTP_200
                    message = {"status": 200}
                    result_json = json.dumps(message)
                    resp.body = (result_json)
             
            else:
                resp.status = falcon.HTTP_400
                message = {"status": "Something wrong happened. Please login and try again"}
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