from DatabaseConnection import *
from datetime import datetime, timedelta
from EmailBody import EmailBody
from EmailTools import EmailTools


# DB connection
# database_connection = get_db_connection()

# cursor = database_connection.cursor()
# cursor.execute("SELECT l.email \
# FROM logins l \
# INNER JOIN ship_orders o ON l.login_id = o.login_id \
# WHERE DATE(o.created_on) = DATE_SUB(DATE(NOW()),INTERVAL 3 DAY);")
# row = cursor.fetchall()
# print(row)
# reciepent_list = list()
# for x in row:
#     reciepent_list.append(x['email'])

# print(reciepent_list)

EmailTools.AuthorizePaymentBlockEmailNotify("C00002S_MY_00000001_1018",['misshanyn@gmail.com','naumansheh@gmail.com'])















# Get current datetime from DB
# cursor.execute("SELECT NOW()")
# row = cursor.fetchone()
# current_date = row['NOW()']
# print(current_date)
# before_3days = current_date - timedelta(days=3)
# print(before_3days)

# # Query to display this data frm tbl
# cursor.execute("SELECT created_on FROM ship_orders ")
# row = cursor.fetchall()
# for x in row:
#     # Check if date before 3 days exist in DB
#     if(before_3days.strftime("%Y-%m-%d") == x['created_on'].strftime("%Y-%m-%d")):
#         days3 = before_3days.strftime("%Y-%m-%d")
#         # db_date = ("Select DATE(created_on) from ship_orders")
#         # row_date = cursor.fetchall()
#         # print(row_date)
#         cursor.execute("SELECT l.email\
#                         FROM logins l\
#                         INNER JOIN ship_orders o ON l.login_id = o.login_id\
#                         WHERE DATE(created_on) = '"+str(days3)+"'")
#         row = cursor.fetchall()
#         print(row)
    

