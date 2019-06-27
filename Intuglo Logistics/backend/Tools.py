'''
This file includes generic functions to be imported in other resources
'''
import random
import falcon
import json
from DatabaseConnection import *
import smtplib
import pymysql
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from datetime import datetime
import csv
import traceback
import sys
import uuid
import os

class Tools(object):
    """Contains generic functions to be used in other resources"""

    # server_url = ''
#    Function to get server URL
    @staticmethod
    def getServerURL():
         # Reading server url from JSON file 
        with open('../src/assets/custom-config.json') as f:
            serverConfig = json.load(f)
            #  get environment name and set url 
            if (serverConfig["environment"]["name"]=="PRODUCTION"):
                server_url = serverConfig["production"]["api"]
            elif(serverConfig["environment"]["name"]=="STAGING"):
                server_url = serverConfig["staging"]["api"]
            else:
                server_url = serverConfig["development"]["api"]

            return server_url

#   Function to get client URL
    @staticmethod
    def getClientURL():
        # # Reading server url from JSON file 
        with open('../src/assets/custom-config.json') as f:
            serverConfig = json.load(f)
            #  get environment name and set url 
            if (serverConfig["environment"]["name"]=="PRODUCTION"):
                client_url = serverConfig["production"]["application"]
            elif(serverConfig["environment"]["name"]=="STAGING"):
                client_url = serverConfig["staging"]["application"]
            else:
                client_url = serverConfig["development"]["application"]
            print(client_url)
            return client_url
        # try:
        #     # Connecting the database
        #     database_connection = get_db_connection()
        #     cursor = database_connection.cursor()
        #     cursor.execute("select config_value from config where config_key = 'serving-url-link'")
        #     serving_url_link = cursor.fetchone()
        #     return serving_url_link
        # finally:
        #     cursor.close()
        #     database_connection.close()

    @staticmethod
    def getOrderStatusAndButtonCode(order_id,cursor):
        #  this function will return order status and button 
        #  code based on the order id passing as parameter 
        cursor.execute("select cargo_status_code ,button_code from ship_orders where order_id = '"+order_id+"'")
        order_status_And_button_code = cursor.fetchone()
        return order_status_And_button_code

    
    # @staticmethod
    # def getQuotationStatus(quotation_id):
    #     #  this function will return order status and button 
    #     #   code based on the order id passing as parameter 
    #     try:
    #         # Connecting the database
    #         database_connection = get_db_connection()
    #         cursor = database_connection.cursor()
    #         cursor.execute("select quotation_status from quotations where quotation_id = '"+quotation_id+"'")
    #         quotation_status = cursor.fetchone()
    #         return quotation_status
    #     finally:
    #         cursor.close()
    #         database_connection.close()

    @staticmethod
    def QuotationChargesDelete(quotation_id):
        try:
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("delete from ship_quotation_handling_charges where quotation_id ='"+quotation_id+"'")
            database_connection.commit()
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
    
    @staticmethod
    def ChangeUserOnBoardedStatus(login_id, is_on_boarded,cursor,database_connection):
        cursor.execute(
            "update logins set is_on_boarded='" + is_on_boarded + "' where login_id ='" + login_id + "'")
        database_connection.commit()  

    # Change cargo booking status
    @staticmethod
    def ChangeBookingStatus(order_id, order_status_code, current_button_code,cursor,database_connection):
        cursor.execute(
            "update ship_orders set cargo_status_code='" + order_status_code + "', button_code='"+ str(current_button_code) +"' where order_id ='" + order_id + "'")
        database_connection.commit()

    @staticmethod
    def ChangePaymentStatus(order_id, order_status_code,cursor,database_connection):
        cursor.execute(
            "update ship_orders set payment_status_code ='" + order_status_code + "' where order_id ='" + order_id + "'")
        database_connection.commit()
    

    @staticmethod
    def ChangeCustomStatus(order_id, order_status_code,cursor,database_connection):
        cursor.execute(
            "update ship_orders set custom_status_code='" + order_status_code + "' where order_id ='" + order_id + "'")
        database_connection.commit()
        
    
    @staticmethod
    def ChangeQuotationStatus(quotation_id, quotation_status,cursor,database_connection):
        cursor.execute("update ship_quotations set quotation_status='"+quotation_status+"' where quotation_id='"+quotation_id+"'")
        database_connection.commit()
       
            
    # Change user's password
    @staticmethod
    def ChangePassword(login_id, new_password,cursor,database_connection):
        sql = ("update logins set password=%s where login_id = %s")
        data = (new_password,login_id)
        cursor.execute(sql,data)
        database_connection.commit()

    @staticmethod
    def TemporaryPassword(size, chars):
        return ''.join(random.choice(chars) for _ in range(size))

   
    @staticmethod
    def GetQuotationID(login_id, CFC, CTC, incoterm, seq_status,cursor,database_connection, *args):
        try:
            if seq_status is 0:
                cursor.execute("select supplier_id from logistic_providers where login_id = "+str(login_id)+"")
                supp= cursor.fetchone()
                user_type = "L"
                supplier_int_sequence = "%04d" %supp['supplier_id']
                cursor.execute("insert into ship_seq_quotations() values()")
                database_connection.commit()
                row = cursor.lastrowid
                if(cursor.rowcount > 0):
                    sequence_num = "%06d" %row
                    cursor.execute("SELECT CURDATE();")
                    row = cursor.fetchone()
                    month_year = row['CURDATE()']
                    quotation_id_str = "{}_{}{}_{}{}{}_{}"
                    quotation_id = quotation_id_str.format(month_year.strftime("%m%y"),user_type,supplier_int_sequence,CFC,sequence_num,CTC,incoterm)
                    return quotation_id
                else:
                    return("Generation of QuotationID Sequence Failed")
            elif seq_status is 1:
                quotation_id = args[0]
                sequence_num = quotation_id[13:19]
                print(sequence_num)
                supplier_int_sequence = quotation_id[5:10]
                cursor.execute("SELECT CURDATE();")
                row = cursor.fetchone()
                month_year = row['CURDATE()']
                quotation_id_str = "{}_{}_{}{}{}_{}"
                quotation_id_after = quotation_id_str.format(month_year.strftime("%m%y"),supplier_int_sequence,CFC,sequence_num,CTC,incoterm)
                return quotation_id_after
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)


    @staticmethod
    def CargoStatus(order_status,actual_button_code): 
        # Check status
        switcher = {
            "ORDERPLACED":{"current_order_status":["ORDERBOOKED"],"future_button_code":[actual_button_code-0],"action_by":[2]},
            "CARGOSENT":{"current_order_status":["ORDERPLACED"],"payment_status":["CREDITBLOCKED"],"future_button_code":[actual_button_code-0],"action_by":[2]},
            "CARGOREADYFORPICKUP":{"current_order_status":["ORDERPLACED"],"payment_status":["CREDITBLOCKED"],"future_button_code":[actual_button_code-0],"action_by":[2]},
            "ORDERCANCELLED":{"current_order_status":["ORDERPLACED"],"future_button_code":[actual_button_code-0],"action_by":[2]},
            "CARGORECEIVED":{"current_order_status":["CARGOSENT"],"future_button_code":[actual_button_code-0],"action_by":[1]},
            "CARGOPICKUP":{"current_order_status":["CARGOREADYFORPICKUP"],"future_button_code":[actual_button_code-0],"action_by":[1]},
            "LOCKEDIN":{"current_order_status":["CARGORECEIVED","CARGOPICKUP","CARGOCLEAREDDEPARTURE"],"future_button_code":[actual_button_code-0,actual_button_code-0,actual_button_code-0],"action_by":[0]},
            "ORDERDROPPED":{"current_order_status":[],"future_button_code":[actual_button_code-0],"action_by":[0]},
            "CONTAINERSEALED":{"current_order_status":["LOCKEDIN"],"future_button_code":[actual_button_code-0,actual_button_code-0],"action_by":[1]},
            "CARGOSHIPPED":{"current_order_status":["CONTAINERSEALED"],"payment_status":["CREDITDEDUCTED"],"future_button_code":[actual_button_code-0],"action_by":[1]},
            "CARGODELIVERED":{"current_order_status":["CARGOSHIPPED","CARGOCLEAREDARRIVAL"],"future_button_code":[actual_button_code-0,actual_button_code-0],"action_by":[1]},
            "SHIPMENTCOMPLETED":{"current_order_status":["CARGODELIVERED"],"future_button_code":[actual_button_code-0],"action_by":[1]}

            # "CARGORELEASED":{"current_order_status":["HOLDBYCUSTOM"],"future_button_code":[actual_button_code-0],"action_by":["ADMIN"]},       
            
            }
        return switcher.get(order_status,"STATUSNOTFOUND")


    @staticmethod
    def CustomStatus(order_status,actual_button_code):
        # Check status
        switcher = {
            "CLEARINGCUSTOMDEPARTURE":{"current_order_status":["CARGORECEIVED","CARGOPICKUP"],"quotation_status":["CLOSED"],"future_button_code":[actual_button_code-0,actual_button_code-0],"action_by":[3]},
            "CARGOCLEAREDDEPARTURE":{"current_order_status":["CLEARINGCUSTOMDEPARTURE"],"future_button_code":[actual_button_code-0],"action_by":[3]},
            "REJECTEDBYCUSTOM":{"current_order_status":["CLEARINGCUSTOMDEPARTURE"],"future_button_code":[actual_button_code-0],"action_by":[3]},
            "CLEARINGCUSTOMARRIVAL":{"current_order_status":["CARGOSHIPPED"],"future_button_code":[actual_button_code-0],"action_by":[3]},
            "HOLDBYCUSTOM":{"current_order_status":["CLEARINGCUSTOMARRIVAL"],"future_button_code":[actual_button_code-0],"action_by":[3]},
            "CARGOCLEAREDARRIVAL":{"current_order_status":["CLEARINGCUSTOMARRIVAL","CARGORELEASED"],"future_button_code":[actual_button_code-0,actual_button_code-0],"action_by":[3]},
            "CARGORELEASED":{"current_order_status":["HOLDBYCUSTOM"],"future_button_code":[actual_button_code-0],"action_by":[3]}

            # "SHIPMENTCOMPLETED":{"current_order_status":["CARGODELIVERED"],"future_button_code":[actual_button_code-0],"action_by":["CUSTOMAGENT"]}
        }
        return switcher.get(order_status,"STATUSNOTFOUND")


    @staticmethod
    def PaymentStatus(order_status,actual_button_code): 
        # Check status
        switcher = {
            "CREDITBLOCKED":{"current_order_status":["ORDERPLACED"],"future_button_code":[actual_button_code-0],"action_by":[2]},
            "CONFIRMPAYMENTAMOUNT":{"current_order_status":["CREDITBLOCKED"],"cargo_status":["CARGOSENT","CARGOREADYFORPICKUP"],"future_button_code":[actual_button_code-0],"action_by":[1]},
            "CREDITDEDUCTED":{"current_order_status":["CONFIRMPAYMENTAMOUNT"],"future_button_code":[actual_button_code-0],"action_by":[0]}
        }           
        return switcher.get(order_status,"STATUSNOTFOUND")
    
    

    @staticmethod
    def QuotationStatus(quotation_status,current_status):
        # Checking status.
        switcher = {
            "APPROVED":{"current_quotation_status":["PENDINGAPPROVAL"]},
            "DELETED":{"current_quotation_status":["DRAFT"]},
            "PENDINGAPPROVAL":{"current_quotation_status":["DRAFT"]},
            "APPROVED":{"current_quotation_status":["PENDINGAPPROVAL"]},
            "ACTIVE":{"current_quotation_status":["APPROVED"]},
            "CLOSED":{"current_quotation_status":["ACTIVE"]},
            "ARCHIVED":{"current_quotation_status":["CLOSED"]},
        
        }
        return switcher.get(quotation_status,"STATUSNOTFOUND")


    @staticmethod
    def IsCustomer(login_id):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select user_type from logins where login_id = '"+login_id+"'")
            row = cursor.fetchall()
            if (row[0]['user_type'] == 2):
                return True
            else:
                return False
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()

    @staticmethod
    def IsSupplier(login_id):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select user_type from logins where login_id = '"+login_id+"'")
            row = cursor.fetchall()
            if (row[0]['user_type'] == 1):
                return True
            else:
                return False
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()

    @staticmethod
    def IsCustomAgent(login_id):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select user_type from logins where login_id = '" + login_id + "'")
            row = cursor.fetchall()
            if (row[0]['user_type'] == 3):
                return True
            else:
                return False
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()

    @staticmethod
    def IsAdmin(login_id):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select user_type from logins where login_id = '"+login_id+"'")
            row = cursor.fetchall()
            if (row[0]['user_type'] == 0):
                return True
            else:
                return False
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()


    @staticmethod
    # Generating order id
    def GetOrderID(quotation_id,cursor,database_connection):
        try:
            cursor.execute("insert into ship_seq_orders() values();")
            database_connection.commit()
            row = cursor.lastrowid
            if(cursor.rowcount > 0):
                sequence_num = "%08d" %row
                cursor.execute("SELECT CURDATE();")
                row = cursor.fetchone()
                month_year = row['CURDATE()']
                unique_qt = quotation_id[11:21]
                quotation_id_str = "{}_{}_{}"
                return(quotation_id_str.format(unique_qt,sequence_num,month_year.strftime("%m%y")))
            else:
                return("Generation of OrderID Sequence Failed")
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)


    # @staticmethod
    # # Generating container id
    # def GetContainerID(quotation_id, hs_set_code, Halal_status, container_type):
    #     try:
    #         database_connection = get_db_connection()
    #         cursor = database_connection.cursor()
    #         cursor.execute("select hs_set_code from hs_set")
    #         row=cursor.fetchall()
    #         cursor.execute("insert into ship_seq_containers() values();")
    #         database_connection.commit()
    #         row = cursor.lastrowid
    #         if(cursor.rowcount > 0):
    #             sequence_num = "%08d" %row
    #             unique_qt = quotation_id[11:21]
    #             quotation_id_str = "{}_{}_{}_{}"
    #             return(quotation_id_str.format(unique_qt,hs_set_code,sequence_num,Halal_status))
    #         else:
    #             return("Generation of OrderID Sequence Failed")
    #     except ValueError as err:
    #         raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
    #     except pymysql.IntegrityError as err:
    #         raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
    #     except Exception as err:
    #         raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
    #     finally:
    #         cursor.close()
    #         database_connection.close()


    @staticmethod
    # Generating container id
    def GetContainerID(quotation_id, type, cursor, database_connection, *args):
        try:
            if type is 0 :
                cursor.execute("insert into ship_seq_containers() values();")
                database_connection.commit()
                row = cursor.lastrowid
                if(cursor.rowcount > 0):
                    sequence_num = "%08d" %row
                unique_qt = quotation_id[11:21]
                quotation_id_str = "{}_{}_{}_{}"
                hs_set_code = "HSX"
                Halal_status = "U"
                return quotation_id_str.format(unique_qt,hs_set_code,sequence_num,Halal_status)
            elif type is 1:
                container_id = args[0].split("_")
                hs_set  = args[1]
                halal_stat = args[2]
                quotation_id_str = "{}_{}_{}_{}"
                return quotation_id_str.format(container_id[0],hs_set,container_id[2],halal_stat)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
       

    @staticmethod
    def GenerateTokenId():
        return uuid.uuid4().hex

    @staticmethod
    def GenerateCsv(query,output_file):
        try:
            # database_connection = connection.get_connection()
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            details_query = query
            cursor.execute(details_query)
            row = cursor.fetchall()
            with open(output_file, "wt") as write_csv:
                write_File = csv.writer(write_csv)
                write_File.writerow([i[0] for i in cursor.description]) 
                write_File.writerows(row)
                write_csv.close()           
        # except Exception as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, err.strerror)
        except IOError as e:
            print ("I/O error({0}): {1}".format(e.errno, e.strerror))
            raise falcon.HTTPError(falcon.HTTP_400, e.errno, e.strerror)
        except AttributeError as a:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(),a)
        finally:
            cursor.close()
            database_connection.close()

    
    @staticmethod
    def SignupUser(nameValue, mobileValue, countryValue, businessValue, industryValue, emailValue , userTypeValue, termsAndConditionValue, tokenValue, tempPassword, cursor, database_connection):
        try:
            cursor.execute("select config_value from config where config_key='validity-days'")
            row = cursor.fetchall()
            validity_days = row[0]['config_value']
           
            # If user is CUSTOMER
            if(userTypeValue is 2):
                cursor.execute("INSERT INTO logins(email, is_active, user_type, need_change_password, token_id, token_validity, verified_user)\
                            VALUES ('"+emailValue+"', 0, 2, 1, '"+tokenValue+"', DATE_ADD(current_timestamp, INTERVAL '"+validity_days+"' DAY),1)")
                database_connection.commit()
                row = cursor.lastrowid
                loginId = row
                cursor.execute("insert into carts(login_id) VALUES ("+str(loginId)+")")
                database_connection.commit()
                cart_id = cursor.lastrowid 
                cursor.execute("INSERT INTO customers (login_id, customer_name, mobile_no, country_code, business_id, industry_id, tc_id,cart_id)\
                            VALUES ("+str(loginId)+",'"+nameValue+"','"+str(mobileValue)+"','"+countryValue+"','"+businessValue+"','"+industryValue+"',"+str(termsAndConditionValue)+","+str(cart_id)+")")
                database_connection.commit()
                if(cursor.rowcount is 1):
                    return True
                else:
                    return False
            # If user is SUPPLIER
            if(userTypeValue is 1):
                cursor.execute("INSERT INTO  logins(email, is_active, user_type, need_change_password, token_id, token_validity )\
                            VALUES ('"+emailValue+"', 0, 1, 1, '"+tokenValue+"', DATE_ADD(current_timestamp, INTERVAL '"+validity_days+"' DAY))")
                database_connection.commit()
                row = cursor.lastrowid 
                loginId = row
                cursor.execute("INSERT INTO logistic_providers (login_id, supplier_name,mobile_no,country_code,business_id, industry_id, tc_id )\
                            VALUES ("+str(loginId)+",'"+nameValue+"','"+str(mobileValue)+"','"+countryValue+"','"+businessValue+"','"+industryValue+"',"+str(termsAndConditionValue)+")")
                database_connection.commit()
                if(cursor.rowcount is 1):
                    return True
                else:
                    return False
            # If user is CUSTOM AGENT
            if (userTypeValue is 3):
                cursor.execute("INSERT INTO  logins(email, is_active, user_type, need_change_password, token_id, token_validity )\
                                                VALUES ('" + emailValue + "', 0, 3, 1, '" + tokenValue + "', DATE_ADD(current_timestamp, INTERVAL '" + validity_days + "' DAY))")
                database_connection.commit()
                row = cursor.lastrowid
                loginId = row
                cursor.execute("INSERT INTO custom_agent (login_id, agent_name,mobile_no,country_code,business_id, industry_id, tc_id )\
                                                VALUES (" + str(
                    loginId) + ",'" + nameValue + "','"+str(mobileValue)+"','" + countryValue + "','" + businessValue + "','"+industryValue+"'," + str(
                    termsAndConditionValue) + ")")
                database_connection.commit()
                if (cursor.rowcount is 1):
                    return True
                else:
                    return False

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
    
    @staticmethod
    def GetQuotationFilePath():
        try:
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'quotation-upload-file-path'")
            row = cursor.fetchall()
            quotation_files = {}
            quotation_files['quotation_files'] = os.path.abspath(os.path.realpath(row[0]['config_value']))
            return quotation_files
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
    
    @staticmethod
    def GetProfileFilePath():
        try:
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'profile-upload-file-path'")
            row = cursor.fetchall()
            profile_files = {}
            profile_files['profile_files'] = os.path.abspath(os.path.realpath(row[0]['config_value']))
            return profile_files
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()

    @staticmethod
    def GetCustomFilePath():
        try:
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'custom-upload-file-path'")
            row = cursor.fetchall()
            custom_files = {}
            custom_files['custom_files'] = os.path.abspath(os.path.realpath(row[0]['config_value']))
            custom_files['custom_zip_files'] = os.path.join(custom_files['custom_files'],'temp')
            return custom_files
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
    
    @staticmethod
    def GetProfileDocumentFilePath():
        try:
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'profile_doc_file_path'")
            row = cursor.fetchall()
            profile_doc = {}
            print(row)
            profile_doc['profile_doc'] = os.path.abspath(os.path.realpath(row[0]['config_value']))
            profile_doc['profile_doc_zip'] = os.path.join(profile_doc['profile_doc'],'temp')
            print(profile_doc)
            return profile_doc
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
    
  
    @staticmethod
    def GetMerchantID(country_code, business_id, industry_id, business_size, loginID, cursor, database_connection):
        try:
            user_type = {1:"S",2:"C",3:"S"}
            # Checking if merchantID exist
            cursor.execute("select user_type, merchant_id from logins where login_id = '"+loginID+"'")
            row = cursor.fetchall()
            if row[0]['merchant_id'] is not None:
                merchant_list = list(row)
                # Reuse the merchantID
                userID_sequence_num = row[0]['merchant_id']
                user_types = user_type[row[0]['user_type']]
                # Concatenate the variables into one
                merchant_id_str = "{}{}{}{}{}{}"
                new_merchantID = (merchant_id_str.format(country_code,business_id,industry_id,business_size,userID_sequence_num[7:12],user_types))
                print(new_merchantID)
                # Update new merchantID to logins table based on usertype
                cursor.execute("update logins set merchant_id = '"+new_merchantID+"' where login_id = '"+loginID+"' ")
                database_connection.commit()
            else:
                # Auto generate merchant ID
                cursor.execute("insert into seq_merchants() values();")
                database_connection.commit()
                seq = cursor.lastrowid
                merchant_list = list(row)
                # Set padding sequence to 5
                userID_sequence_num = "%05d" %seq
                # Concatenate the variables into one
                merchant_id_str = "{}{}{}{}{}{}"
                new_merchantID = (merchant_id_str.format(country_code,business_id,industry_id,business_size,userID_sequence_num,user_type[row[0]['user_type']]))
                print(new_merchantID)
                # Update new merchantID to logins table based on usertype
                cursor.execute("update logins set merchant_id = '"+new_merchantID+"' where login_id =  '"+loginID+"'")
                database_connection.commit()
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
    
        
    @staticmethod
    def container_avail_status(cbm_req,weight_req,container_id,cursor):
        try:
            cursor.execute("select remaining_cbm,percentage_full,remaining_weight from ship_containers where container_id = '"+str(container_id)+"'")
            row = cursor.fetchone()
            if cbm_req <= row['remaining_cbm'] and weight_req <= row['remaining_weight']:
                return True
            else:
                return False
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
    
    @staticmethod
    def GetProfilePicturePath():
        try:
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'profile_picture_path'")
            row = cursor.fetchall()
            profile_picture = {}
            profile_picture['profile_picture'] = os.path.abspath(os.path.realpath(row[0]['config_value']))
            return profile_picture
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()