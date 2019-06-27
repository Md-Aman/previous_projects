'''
This file includes generic EMAIL functions to be imported in other resources
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
from Tools import *
from EmailBody import EmailBody
import IntugloApp


class EmailTools(object):
    """Contains generic functions to be used in other resources"""

    @staticmethod
    def TemporaryPasswordEmail(to_email, template_id ,temporaryPassword):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            email_structure = MIMEMultipart()
            cursor.execute("select email_subject,email_body from email_template where template_id = "+str(template_id)+"")
            email_template_data = cursor.fetchone()
            email_structure['Subject'] = email_template_data['email_subject']
            email_structure['From'] = from_address
            
            if template_id is 3:
                body_data = EmailBody.change_password(temporaryPassword)
            elif template_id is 1:
                body_data = EmailBody.customer_verification(to_email,temporaryPassword)
            email_structure.attach(MIMEText(body_data, 'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            email_data = email_structure.as_string()
            server.sendmail(from_address, to_email, email_data)
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()


    @staticmethod
    def ResetPasswordEmail(to_email,template_id,tokenID):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            email_structure = MIMEMultipart()
            cursor.execute("select email_subject,email_body from email_template where template_id = "+str(template_id)+"")
            email_template_data = cursor.fetchone()
            email_structure['Subject'] = email_template_data['email_subject']
            email_structure['From'] = from_address


            body_of_email = EmailBody.forgotten_password(tokenID)
            email_structure.attach(MIMEText(body_of_email, 'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            email_data = email_structure.as_string()
            server.sendmail(from_address, to_email, email_data)
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()

  
    @staticmethod
    def UponOrderEmailNotify(recipient,payment_id):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            row = cursor.fetchall()
            email_structure = MIMEMultipart()
            cursor.execute("select * from email_template where template_id = 4")
            email_info = cursor.fetchone()
            email_structure['Subject'] = email_info['email_subject']
            email_structure['From'] = from_address
            

            body_data = EmailBody.upon_order(payment_id)
            email_structure.attach(MIMEText(body_data, 'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            email_data = email_structure.as_string()
            server.sendmail(from_address, recipient, email_data)
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()
    
    

    # @staticmethod
    # def ActivationEmail(to_email, userName, tokenID, template_id):
    #     try:
    #         # Connecting the database
    #         database_connection = get_db_connection()
    #         cursor = database_connection.cursor()
    #         cursor.execute("select config_value from config where config_key = 'mail-server-address'")
    #         row = cursor.fetchone()
    #         server_address = row['config_value']
    #         cursor.execute("select config_value from config where config_key = 'mail-server-port'")
    #         row = cursor.fetchone()
    #         server_port = row['config_value']
    #         cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
    #         row = cursor.fetchone()
    #         from_address = row['config_value']
    #         cursor.execute("select config_value from config where config_key = 'mail-server-password'")
    #         row = cursor.fetchone()
    #         from_address_password = row['config_value']
    #         email_structure = MIMEMultipart()
    #         cursor.execute("select email_subject,email_body from email_template where template_id = "+str(template_id)+"")
    #         email_template_data = cursor.fetchone()
    #         email_structure['Subject'] = email_template_data['email_subject']

    #         fp = open('ship.JPG', 'rb')
    #         msgImage = MIMEImage(fp.read())
    #         fp.close()
    #         fp = open('logo.JPG', 'rb')
    #         logo = MIMEImage(fp.read())
    #         fp.close()

    #         msgImage.add_header('Content-ID', '<image1>')
    #         email_structure.attach(msgImage)
    #         logo.add_header('Content-ID', '<image2>')
    #         email_structure.attach(logo)
    #         client_url = Tools.getClientURL()
    #         body_of_email = EmailBody.customer_verification(to_email,temporaryPassword)
    #         email_structure.attach(MIMEText(body_of_email, 'html'))
    #         server = smtplib.SMTP(server_address, server_port)
    #         server.starttls()
    #         server.login(from_address, from_address_password)
    #         email_data = email_structure.as_string()
    #         server.sendmail(from_address, to_email, email_data)
    #         server.quit()
    #     except pymysql.IntegrityError as err:
    #         raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
    #     except Exception as err:
    #         raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
    #     finally:
    #         cursor.close()
    #         database_connection.close()

    @staticmethod
    def ActivationEmail(to_email, email_subject, userName, tokenID):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            email_structure = MIMEMultipart()
            email_structure['Subject'] = email_subject
            email_structure['From'] = from_address
            email_structure['To'] = to_email
            # client_url = Tools.getClientURL()
            body_of_email ='<html>' \
                           '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                           '<img src = "https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt = "Intuglo" style="width:220px">'\
                           '<p style="text-align:center;color:Black"><b>Thank you for your subscription</b></p>' \
                           '<p align="left";padding-top:"2000px">Hi '+userName+',</p>' \
                           '<p align="left">You have subscribe for Intuglo Logistics.You are almost ready to experience going global with intuglo.com. Please click on the button below to activate your account.</p>'\
                           '<a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="'+IntugloApp.GlobalClientServerURLFrontend+'/customer/activate?token='+tokenID+'">Activate your Account</a>'\
                           '</div></body>' \
                           '</html>'
            email_structure.attach(MIMEText(body_of_email, 'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            server.sendmail(from_address, to_email, email_structure.as_string())
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()
   

    @staticmethod
    def UponSetUpEmailNotify(recipient,quotation_id):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            row = cursor.fetchall()
            email_structure = MIMEMultipart()
            cursor.execute("select email_subject from email_template where template_id = 5")
            email_info = cursor.fetchone()
            email_structure['Subject'] = email_info['email_subject']
            email_structure['From'] = from_address


            body_data = EmailBody.upon_setup_qt(quotation_id)
            email_structure.attach(MIMEText(body_data,'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            email_data = email_structure.as_string()
            server.sendmail(from_address, recipient, email_data)
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()


    @staticmethod
    def QTClosedEmailNotify(recipient,quotation_id,template_id):
        # TemplateID 9 & 10
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            email_structure = MIMEMultipart()
            cursor.execute("select email_subject from email_template where template_id ='"+str(template_id)+"'")
            email_info = cursor.fetchone()
            email_structure['Subject'] = email_info['email_subject']
            email_structure['From'] = from_address
                   

            body_of_email = EmailBody.qt_closed(quotation_id)
            email_structure.attach(MIMEText(body_of_email,'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            email_data = email_structure.as_string()
            server.sendmail(from_address, recipient, email_data)
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()


    @staticmethod
    def FinalShipmentConfirmationEmailNotify(order_id,recipient):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            row = cursor.fetchall()
            email_structure = MIMEMultipart()
            cursor.execute("select email_subject from email_template where template_id = 5")
            email_info = cursor.fetchone()
            email_structure['Subject'] = email_info['email_subject']
            email_structure['From'] = from_address
                  

            body_of_email = EmailBody.final_shipment_confirm(order_id)
            email_structure.attach(MIMEText(body_of_email,'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            email_data = email_structure.as_string()
            server.sendmail(from_address, recipient, email_data)
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()


    @staticmethod
    def CustomDocumentEmailNotify(recipient,quotation_id):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            email_structure = MIMEMultipart()
            cursor.execute("select email_subject from email_template where template_id = 6")
            email_info = cursor.fetchone()
            email_structure['Subject'] = email_info['email_subject']
            email_structure['From'] = from_address


            body_of_email = EmailBody.custom_doc_download(quotation_id)
            email_structure.attach(MIMEText(body_of_email, 'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            email_data = email_structure.as_string()
            server.sendmail(from_address, to_email, email_data)
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()


    @staticmethod
    def CargoSendingAndCustomClearEmailNotify(recipient,template_id):
        # TemplateID 7 / 8
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            email_structure = MIMEMultipart()
            cursor.execute("select email_subject,email_body from email_template where template_id ='"+str(template_id)+"'")
            email_template_data = cursor.fetchone()
            email_structure['Subject'] = email_template_data['email_subject']
            email_structure['From'] = from_address

            if template_id is 7 :
                body_data = EmailBody.cargo_sending()
                email_structure.attach(MIMEText(body_data, 'html'))
                server = smtplib.SMTP(server_address, server_port)
                server.starttls()
                server.login(from_address, from_address_password)
                email_data = email_structure.as_string()
                server.sendmail(from_address, recipient, email_data)
                server.quit()

            elif template_id is 12 :
                body_data = EmailBody.successfull_custom_clearance()
                email_structure.attach(MIMEText(body_data, 'html'))
                server = smtplib.SMTP(server_address, server_port)
                server.starttls()
                server.login(from_address, from_address_password)
                email_data = email_structure.as_string()
                server.sendmail(from_address, recipient, email_data)
                server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()

  
    @staticmethod
    def AuthorizePaymentBlockEmailNotify(order_id,recipient):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            row = cursor.fetchall()
            email_structure = MIMEMultipart()
            cursor.execute("select email_subject from email_template where template_id = 5")
            email_info = cursor.fetchone()
            email_structure['Subject'] = email_info['email_subject']
            email_structure['From'] = from_address
                  
        
            body_of_email = EmailBody.authorize_payment_block(order_id)
            email_structure.attach(MIMEText(body_of_email,'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            email_data = email_structure.as_string()
            server.sendmail(from_address, recipient, email_data)
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()


    @staticmethod
    def PaymentListReadyEmailNotify(recipient,quotation_id):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            row = cursor.fetchall()
            email_structure = MIMEMultipart()
            cursor.execute("select email_subject from email_template where template_id = 14")
            email_info = cursor.fetchone()
            email_structure['Subject'] = email_info['email_subject']
            email_structure['From'] = from_address
        

            body_of_email = EmailBody.payment_list_ready(quotation_id)
            email_structure.attach(MIMEText(body_of_email,'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            email_data = email_structure.as_string()
            server.sendmail(from_address, recipient, email_data)
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()


    @staticmethod
    def changePasswordNotification(recipient):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            row = cursor.fetchall()
            email_structure = MIMEMultipart()
            cursor.execute("select * from email_template where template_id = 3")
            email_info = cursor.fetchone()
            email_structure['Subject'] = email_info['email_subject']
            email_structure['From'] = from_address
            
    
            body_data = EmailBody.change_password_notify()
            email_structure.attach(MIMEText(body_data, 'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            email_data = email_structure.as_string()
            server.sendmail(from_address, recipient, email_data)
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()


    @staticmethod
    def paymentDeductedNotification(recipient):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            row = cursor.fetchall()
            email_structure = MIMEMultipart()
            cursor.execute("select * from email_template where template_id = 13")
            email_info = cursor.fetchone()
            email_structure['Subject'] = email_info['email_subject']
            email_structure['From'] = from_address
            
    
            body_data = EmailBody.final_payment_successful_deducted()
            email_structure.attach(MIMEText(body_data, 'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            email_data = email_structure.as_string()
            server.sendmail(from_address, recipient, email_data)
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()


    @staticmethod
    def approveCreditBlockedNotification(recipient):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select config_value from config where config_key = 'mail-server-address'")
            row = cursor.fetchone()
            server_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-port'")
            row = cursor.fetchone()
            server_port = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-Username'")
            row = cursor.fetchone()
            from_address = row['config_value']
            cursor.execute("select config_value from config where config_key = 'mail-server-password'")
            row = cursor.fetchone()
            from_address_password = row['config_value']
            row = cursor.fetchall()
            email_structure = MIMEMultipart()
            cursor.execute("select * from email_template where template_id = 17")
            email_info = cursor.fetchone()
            email_structure['Subject'] = email_info['email_subject']
            email_structure['From'] = from_address
            
    
            body_data = EmailBody.approve_credit_blocked()
            email_structure.attach(MIMEText(body_data, 'html'))
            server = smtplib.SMTP(server_address, server_port)
            server.starttls()
            server.login(from_address, from_address_password)
            email_data = email_structure.as_string()
            server.sendmail(from_address, recipient, email_data)
            server.quit()
        except pymysql.IntegrityError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout), err.args)
        finally:
            cursor.close()
            database_connection.close()



