'''
Name  :  ForgotPassword
Usage :  Post resource to handle forgot password
Description  :  This code is used to handle forgot password in Intuglo Logistics and interacts with the logins tables.
                It creates temporary password automatically
'''

# import falcon
# import json
# import string
# import random
# import mysql.connector
# from DatabaseConnection import dbconfig
# from Tools import Tools


# class ForgotPasswordResource__v1__(object):
#     def on_post(self, req, resp):
    	
#         try:
#             raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
#             result_dict_json = json.loads(raw_json, encoding='utf-8')
#             email_values = result_dict_json['email']
#             # Calling Temporary Password function from Tools
#             temporary_password = Tools.TemporaryPassword(8, string.ascii_uppercase + string.digits)
#             # call function sendEmail
#             send_password_to_email = Tools.SendEmail(email_values, "Temporary Password", temporary_password )
#             database_connection = mysql.connector.connect(host=dbconfig['host'], user=dbconfig['user'],
#                 password=dbconfig['password'], database=dbconfig['database'])
#             cursor = database_connection.cursor()
#             cursor.execute("update logins set need_change_password=1, password = '"+temporary_password+"'"
#                            " where email='"+email_values+"'")
#             database_connection.commit()
#             if (cursor.rowcount > 0):
#                 resp.status = falcon.HTTP_200
#                 message = {'Temporary password': temporary_password}
#                 result_json = json.dumps(message)
#                 resp.body = result_json
#             else:
#                 resp.status = falcon.HTTP_400
#                 message = {"Status": "Email does not exists"}
#                 result_json = json.dumps(message)
#                 resp.body = (result_json)
#         except ValueError as err:
#             raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
#         except mysql.connector.Error as err:
#             raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
#         except Exception as err:
#             raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
#         finally:
#             cursor.close()
#             database_connection.close()
            

    