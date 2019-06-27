'''
This file is to cater the email_template table in the DB. Its function is to insert the html into the email_body column of the table.
It goes by template_id.
'''
from DatabaseConnection import *



# # TemplateID = 2
# data1 = '<html>' \
#         '<body> <div align="center" style="height:400px;width:300px;background-color:snow;padding:7px;margin-top:10px;">' \
#         '<img src="cid:image2" align="middle">' \
#         '<p style="text-align:center;color:Black;padding-top:15px;"><b>Your account is activated. Please login to platform using UserEmail and Password.</b></p>' \
#         '<p align="left">UserEmail: ' "%s" ',</p>' \
#         '<p align="left">Password: ' "%s"  '</p>' \
#         '<img align="middle" src="cid:image1" alt="testing">' \
#         '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="%s/">Login</a></p>' \
#         '<p align="center">Please complete your profile and change password to use services.</p>' \
#         '</div></body>' \
#         '</html>'
# database_connection = get_db_connection()
# cursor = database_connection.cursor()
# sql = ("update email_template set email_body = %s where template_id = 2")
# cursor.execute(sql,data1)
# database_connection.commit()
# cursor.execute("SELECT email_body FROM intuglo.email_template where template_id = 2;")
# row = cursor.fetchone()
# print(row)



# TemplateID = 4
data1 = '<html>' \
        '<body> <div align="center" style="height:400px;width:300px;background-color:snow;padding:7px;margin-top:10px;">' \
        '<img src="cid:image2" align="middle">' \
        '<p align="left">We are happy that you have chosen us to be your trusted supply chain partner.</p>' \
        '<p align="left">Please find some information below to guide you through the entire process of ordering and shipping your products.</p>' \
        '<p align="left">'"{}"'</p>'
        '<p align="left">Please adhere to the dates above accordingly to ensure your order is processed on time.</p>'
        '<p align="left">Thank you,</p>'
        '<p align="left">Intuglo Sales Team</p>'
        '<img align="middle" src="cid:image1" alt="testing">' \
        '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="{}/">Login</a></p>' \
        '</div></body>' \
        '</html>'
database_connection = get_db_connection()
cursor = database_connection.cursor()
sql = ("update email_template set email_body = %s where template_id = 4")
cursor.execute(sql,data1)
database_connection.commit()
cursor.execute("SELECT email_body FROM intuglo.email_template where template_id = 4")
row = cursor.fetchone()
print(row)



# # TemplateID = 5
# data1 = '<html>' \
#         '<body> <div align="center" style="height:400px;width:300px;background-color:snow;padding:7px;margin-top:10px;">' \
#         '<img src="cid:image2" align="middle">' \
#         '<p align="left">You are all set to engage with your trusted customers on Intuglo! Please get ready to receive your orders.</p>'\
#         '<p align="left">The following is the quotation (s) to secure new consolidation.</p>' \
#         '<p align="left">Quotation ID: ' "{}" ',</p>' \
#         '<p align="left">Quotation Reference: ' "{}"  '</p>' \
#         '<p align="left">Containers For Sale: ' "{}"  '</p>' \
#         '<p align="left">ETD: ' "{}"  '</p>' \
#         '<p align="left">ETA: ' "{}"  '</p>' \
#         '<p align="left">Departure Port: ' "{}"  '</p>' \
#         '<p align="left">Arrival Port: ' "{}"  '</p>' \
#         '<img align="middle" src="cid:image1" alt="testing">' \
#         '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="{}/">Login</a></p>' \
#         '<p align="left"> Thank you.</p>' \
#         '<p align="left"> Intuglo Business Development Team</p>' \
#         '</div></body>' \
#         '</html>'
# database_connection = get_db_connection()
# cursor = database_connection.cursor()
# sql = ("update email_template set email_body = %s where template_id = 5")
# cursor.execute(sql,data1)
# database_connection.commit()
# cursor.execute("SELECT email_body FROM intuglo.email_template where template_id = 5")
# row = cursor.fetchone()
# print(row)
# # TESTING
# # quotation_id = "0618_MLAGPEC00002S_MY000001CH_FOB"
# # cursor.execute("select q.quote_ref_no,q.container_box_count,q.arrival_date,q.departure_date,p1.port_name as PF,p2.port_name as PT \
# # from ship_quotations q \
# # left join ports p1 on q.port_id_from = p1.port_id \
# # left join ports p2 on q.port_id_to = p2.port_id \
# # where quotation_id ='"+quotation_id+"'")
# # quotation_info = cursor.fetchone()

# # quotation_ref = quotation_info['quote_ref_no']
# # container_count = quotation_info['container_box_count']
# # etd = quotation_info['departure_date']
# # eta = quotation_info['arrival_date']
# # PortDep = quotation_info['PF']
# # PortArrival = quotation_info['PT']
# # href = "intuglo.com.my"
# # body = data1.format(quotation_id,quotation_ref,str(container_count),str(etd),str(eta),PortDep,PortArrival,href)
# # print(body)


# # TemplateID = 6
# data1 = '<html>' \
#         '<body> <div align="center" style="height:400px;width:300px;background-color:snow;padding:7px;margin-top:10px;">' \
#         '<img src="cid:image2" align="middle">' \
#         '<p align="left"> Hello. We noticed that you have not completed uploading the required documents for Custom Clearance for ' "{}" '. Please upload them immediately.</p>' \
#         '<p align="left"> The last day for you to complete the upload is ' "{}" '. Failure to do so within the stated timeline may lead to an incomplete processing of your order. This will delay or lead to a cancellation of your shipment.</p>' \
#         '<p align="left"> Please take note that you shall bear any charges that may arise from failure to complete this process.</p>'\
#         '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="{}/">Login</a></p>' \
#         '<p align="left"> Please ignore this email if you have completed the process.</p>'\
#         '<p align="left"> Thank you.</p>'\
#         '<p align="left"> Intuglo Operation Team</p>'\
#         '</div></body>' \
#         '</html>'
# database_connection = get_db_connection()
# cursor = database_connection.cursor()
# sql = ("update email_template set email_body = %s where template_id = 6")
# cursor.execute(sql,data1)
# database_connection.commit()
# cursor.execute("SELECT email_body FROM intuglo.email_template where template_id = 6")
# row = cursor.fetchone()
# print(row)


# # TemplateID = 7
# data1 = '<html>' \
#         '<body> <div align="center" style="height:400px;width:300px;background-color:snow;padding:7px;margin-top:10px;">' \
#         '<img src="cid:image2" align="middle">' \
#         '<p align="left"> Hello. We noticed that you did not click on ‘Cargo Sent’. Failure to do so may delay delivery of your cargo to the warehouse with the address stated on the Order Confirmation Note. You might also have forgotten to inform us of this. Please do so immediately to avoid any delay.</p>' \
#         '<p align="left"> It is important that you remember to click on ‘Cargo Sent’ as we need to be notified. This will allow us to ensure your order is processed.</p>' \
#         '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="{}/">Login</a></p>' \
#         '<p align="left"> Please ignore this email if you have completed the process.</p>'\
#         '<p align="left"> Thank you.</p>'\
#         '<p align="left"> Intuglo Operation Team</p>'\
#         '</div></body>' \
#         '</html>'
# database_connection = get_db_connection()
# cursor = database_connection.cursor()
# sql = ("update email_template set email_body = %s where template_id = 7")
# cursor.execute(sql,data1)
# database_connection.commit()
# cursor.execute("SELECT email_body FROM intuglo.email_template where template_id = 7")
# row = cursor.fetchone()
# print(row)


# # TemplateID = 8
# data1 = '<html>' \
#         '<body> <div align="center" style="height:400px;width:300px;background-color:snow;padding:7px;margin-top:10px;">' \
#         '<img src="cid:image2" align="middle">' \
#         '<p align="left"> Thank you for your order '"{}"' which is a shipment from '"{}"' to '"{}"'.</p>' \
#         '<p align="left"> We noticed that you did not authorise a credit block for us to process your order.</p>' \
#         '<p align="left"> Please click on the link: …. to complete the authorisation.</p>'\
#         '<p align="left"> The authorisation is required for us to confirm the allocation of space for your order on ‘Vessel Name’. Please note that the authorisation is only to block your credit and does not involve the transfer of money from your account to ours. The actual transfer of money will only occur at the end of the entire booking process. This is when the quotation is closed and all orders are successfully processed. This ensures all shared prices are leveraged for all successful orders.</p>'\
#         '<p align="left"> The unutilised credit will be released once the actual transfer of money occurs.</p>'\
#         '<p align="left"> For further information or clarification, please contact your bank or call our Customer Service at (PHONE NUMBER).</p>'\
#         '<img align="middle" src="cid:image1" alt="testing">' \
#         '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="{}/">Login</a></p>' \
#         '<p align="left"> Thank you.</p>'\
#         '<p align="left"> Intuglo Operation Team</p>'\
#         '</div></body>' \
#         '</html>'
# database_connection = get_db_connection()
# cursor = database_connection.cursor()
# sql = ("update email_template set email_body = %s where template_id = 8")
# cursor.execute(sql,data1)
# database_connection.commit()
# cursor.execute("SELECT email_body FROM intuglo.email_template where template_id = 8")
# row = cursor.fetchone()
# print(row)


# # TemplateID = 9 
# data1 = '<html>' \
#         '<body> <div align="center" style="height:400px;width:300px;background-color:snow;padding:7px;margin-top:10px;">' \
#         '<img src="cid:image2" align="middle">' \
#         '<p align="left"> Quotation '"{}"' closes in 5 days.</p>'\
#         '<p align="left"> If you have not conducted a search for on boarding for this shipment, please do so immediately.</p>' \
#         '<p align="left"> If you have done so, please ensure that you have completed the required processes for a safe delivery of your cargo.</p>' \
#         '<p align="left"> Please confirm that your cargo has arrived at the warehouse with the address stated on the Order Confirmation Note.</p>' \
#         '<p align="left"> If you have not completed the required shipping processes, please click on the link:...</p>' \
#         '<p align="left"> Welcome onboard Intuglo and we look forward to your next order!</p>' \
#         '<p align="left"> Thank you.</p>' \
#         '<p align="left"> Intuglo Operation Team</p>' \
#         '<img align="middle" src="cid:image1" alt="testing">' \
#         '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="{}">Login</a></p>' \
#         '</div></body>' \
#         '</html>'

# database_connection = get_db_connection()
# cursor = database_connection.cursor()
# sql = ("update email_template set email_body = %s where template_id = 9")
# cursor.execute(sql,data1)
# database_connection.commit()
# cursor.execute("SELECT email_body FROM intuglo.email_template where template_id = 9;")
# row = cursor.fetchone()
# print(row)


# # TemplateID = 10
# data1 = '<html>' \
#         '<body> <div align="center" style="height:400px;width:300px;background-color:snow;padding:7px;margin-top:10px;">' \
#         '<img src="cid:image2" align="middle">' \
#         '<p align="left"> Quotation '"{}"' is closed!</p>'\
#         '<p align="left"> All successful orders will be boarded on '"{}"' on '"{}"'.</p>' \
#         '<p align="left"> Please note that FINAL PAYMENT will be deducted from the earlier pre-authorised credit block.</p>' \
#         '<p align="left"> The unutilised credit will be released when the money is transferred.</p>' \
#         '<p align="left"> Thank you for using our service. We look forward to your next order!</p>' \
#         '<p align="left"> Thank you.</p>' \
#         '<p align="left"> Intuglo Operation Team</p>' \
#         '<img align="middle" src="cid:image1" alt="testing">' \
#         '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="{}">Login</a></p>' \
#         '</div></body>' \
#         '</html>'

# database_connection = get_db_connection()
# cursor = database_connection.cursor()
# sql = ("update email_template set email_body = %s where template_id = 10")
# cursor.execute(sql,data1)
# database_connection.commit()
# cursor.execute("SELECT email_body FROM intuglo.email_template where template_id = 10")
# row = cursor.fetchone()
# print(row)


# # TemplateID = 11
# data1 = '<html>' \
#         '<body> <div align="center" style="height:400px;width:300px;background-color:snow;padding:7px;margin-top:10px;">' \
#         '<img src="cid:image2" align="middle">' \
#         '<p align="left"> We are pleased to inform you that your booking '"{}"' is confirmed to be onboard '"{}"'.</p>'\
#         '<p align="left"> Please take note of the arrival date to ensure a smooth delivery of your cargo.</p>' \
#         '<p align="left"> Thank you.</p>' \
#         '<p align="left"> Intuglo Operation Team</p>' \
#         '<img align="middle" src="cid:image1" alt="testing">' \
#         '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="{}/">Login</a></p>' \
#         '</div></body>' \
#         '</html>'

# database_connection = get_db_connection()
# cursor = database_connection.cursor()
# sql = ("update email_template set email_body = %s where template_id = 11")
# cursor.execute(sql,data1)
# database_connection.commit()
# cursor.execute("SELECT email_body FROM intuglo.email_template where template_id = 11")
# row = cursor.fetchone()
# print(row)



# # TemplateID = 12
# data1 = '<html>' \
#         '<body> <div align="center" style="height:400px;width:300px;background-color:snow;padding:7px;margin-top:10px;">' \
#         '<img src="cid:image2" align="middle">' \
#         '<p align="left"> Congratulations! You are just one step away from completing your order.</p>'\
#         '<p align="left"> Please note that your cargo has cleared the local custom check. Please ensure that the necessary arrangement is made to deliver the cargo to the designated destination.</p>' \
#         '<p align="left"> Thank you for trusting Intuglo. We look forward to your next shipment.</p>'\
#         '<p align="left"> Thank you.</p>' \
#         '<p align="left"> Intuglo Operation Team</p>' \
#         '<img align="middle" src="cid:image1" alt="testing">' \
#         '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="{}/">Login</a></p>' \
#         '</div></body>' \
#         '</html>'

# database_connection = get_db_connection()
# cursor = database_connection.cursor()
# sql = ("update email_template set email_body = %s where template_id = 12")
# cursor.execute(sql,data1)
# database_connection.commit()
# cursor.execute("SELECT email_body FROM intuglo.email_template where template_id = 12")
# row = cursor.fetchone()
# print(row)




# # TemplateID = 14
# data1 = '<html>' \
#         '<body> <div align="center" style="height:400px;width:300px;background-color:snow;padding:7px;margin-top:10px;">' \
#         '<img src="cid:image2" align="middle">' \
#         '<p align="left">The list of payment for shipment '"{}"' is ready. Please check and confirm. Click on the link: … to access the list.</p>' \
#         '<p align="left">Please take note that we will only release payment upon confirmation of acceptance of the amount stated by your good self</p>'\
#         '<p align="left">Once confirmed, we will proceed to remit/bank-in the amount to your account as per the details stated on your profile.</p>'\
#         '<p align="left">We will NOT entertain any claims once you have confirmed your acceptance of the payment list.</p>'\
#         '<p align="left">Thank you.</p>' \
#         '<p align="left">Intuglo Finance Team</p>' \
#         '<img align="middle" src="cid:image1" alt="testing">' \
#         '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="{}/">Login</a></p>'\
#         '</div></body>' \
#         '</html>'
# database_connection = get_db_connection()
# cursor = database_connection.cursor()
# sql = ("update email_template set email_body = %s where template_id = 14")
# cursor.execute(sql,data1)
# database_connection.commit()
# cursor.execute("SELECT email_body FROM intuglo.email_template where template_id = 14")
# row = cursor.fetchone()
# print(row)