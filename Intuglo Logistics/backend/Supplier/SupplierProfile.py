'''
Name  :  supplierProfile
Description  :  Gets supplier details and displays them. Updates supplier details and saves them.
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


class SupplierProfileResource__v1__(object):
    def on_get(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        # try:
        #     if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
        #         resp.status = falcon.HTTP_401
        #         Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
        #         result_json = json.dumps(Err)
        #         resp.body = (result_json)
        #         return

        # except ValueError as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        # except Exception as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        # if Authentication true the code below runs
        # Gets supplier data
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select lg.supplier_name,lg.company_name,lg.company_registration_no,lg.mobile_no, \
                            lg.address_line_one,lg.address_line_two,lg.official_email,lg.website,lg.office_phone,lg.office_fax, \
                            lg.association_club,lg.business_size,lg.import_export_license,lg.business_license, \
                            lg.city, lg.postal_code, lg.state, lg.country_code, \
                            lg.business_id, lg.industry_id,lg.timezone,lg.tax_rate,lg.tax_type,lg.tax_number,lg.bank_acc_no,lg.bank_name,lg.iban_no,lg.swift_code,lo.merchant_id \
                            from logistic_providers lg \
                            left join logins lo on lg.login_id = lo.login_id \
                            where lg.login_id = "+str(login_id)+"")
            row = cursor.fetchall()
            if(cursor.rowcount > 0):
                list_values = list(row)
                resp.status = falcon.HTTP_200
                result_json = json.dumps(list_values, sort_keys=True,default=str)
                resp.body = result_json

            else:
                resp.status = falcon.HTTP_204
                message = {"message": "supplier details not found"}
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


    def on_patch(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
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
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dict_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select is_on_boarded from logins where login_id = '"+login_id+"'")
            row = cursor.fetchone()
            
            if row:
                sql_query = "update logistic_providers SET address_line_one=%s,\
                            address_line_two=%s,\
                            association_club=%s,\
                            bank_acc_no=%s, \
                            bank_name=%s, \
                            business_id=%s, \
                            business_license=%s, \
                            business_size=%s, \
                            city=%s, \
                            company_name=%s, \
                            company_registration_no=%s, \
                            country_code=%s, \
                            iban_no=%s, \
                            import_export_license=%s, \
                            industry_id=%s, \
                            mobile_no=%s, \
                            office_fax=%s, \
                            office_phone=%s, \
                            official_email=%s, \
                            postal_code=%s, \
                            state=%s, \
                            supplier_name=%s, \
                            swift_code=%s, \
                            tax_number=%s, \
                            tax_rate=%s, \
                            tax_type=%s, \
                            website=%s, \
                            timezone=%s \
                            where login_id = %s"
                
                args = (result_dict_json['official_address_line_one'],
                        result_dict_json['official_address_line_two'],
                        result_dict_json['association_club'],
                        result_dict_json['bank_acc_no'],
                        result_dict_json['bank_name'],
                        result_dict_json['business_type'],
                        result_dict_json['license_number'],
                        result_dict_json['business_nature'],
                        result_dict_json['city'],
                        result_dict_json['company_name'],
                        result_dict_json['company_registration_no'],
                        result_dict_json['country_code'],
                        result_dict_json['iban_no'],
                        result_dict_json['importer_exporter'],
                        result_dict_json['industry_type'],
                        result_dict_json['phone_number'],
                        result_dict_json['fax_no'],
                        result_dict_json['official_phone'],
                        result_dict_json['official_email'],
                        result_dict_json['postal_code'],
                        result_dict_json['state'],
                        result_dict_json['contact_person'],
                        result_dict_json['swift_code'],
                        result_dict_json['tax_number'],
                        result_dict_json['tax_rate'],
                        result_dict_json['tax_type'],
                        result_dict_json['company_website'],
                        result_dict_json['timezone'],
                        login_id
                        )
                cursor.execute(sql_query,args)
                database_connection.commit()
                Tools.GetMerchantID(result_dict_json['country_code'],result_dict_json['business_type'],result_dict_json['industry_type'],result_dict_json['business_nature'],login_id,cursor,database_connection)
                
                if(row['is_on_boarded'] != 1):
                    Tools.ChangeUserOnBoardedStatus(login_id, "1",cursor,database_connection)              
                    SessionID = createSession(session)
                    MemcacheFunctions.mc.set(login_id,SessionID,300)
                    row.update({'Login_ID':login_id, 'Active':1, 'User Type':1, 'Is On Boarded':1, 'supplierName':result_dict_json['contact_person'], 'SessionID':session})
                    
                    resp.status = falcon.HTTP_200
                    result_json = json.dumps(row, sort_keys=True)
                    message = {"status": "On Boarded"}
                    resp.body = result_json

                # if cursor.rowcount is 1:
                resp.status = falcon.HTTP_200
                message = json.dumps({"status": "Updated"})
                resp.body = message
            else:
                resp.status = falcon.HTTP_204
                message = {"status": "No content"}
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