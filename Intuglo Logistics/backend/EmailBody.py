
from Tools import *
from DatabaseConnection import *
import IntugloApp

class EmailBody(object):
        @staticmethod
        def customer_verification(to_email,temporaryPassword):
                customer_verification = '<html>' \
                                        '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                        '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                        '<p align="left">Congratulations!</p>' \
                                        '<p align="left">You have successfully subscribed to '+to_email+' Your temporary password is '+temporaryPassword+'. We would advise you to change to a new password of your own choosing immediately or at the earliest opportunity. This is to ensure that your access is kept secured at all times. Please click the button below to activate your account. You are now ready to go global with Intuglo!</p>'\
                                        '<p align="left">Thank you,</p>'\
                                        '<p align="left">Intuglo Sales Team</p>'\
                                        '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="'+IntugloApp.GlobalClientServerURLFrontend+'/">Login</a></p>' \
                                        '</div></body>' \
                                        '</html>'
                return customer_verification

        @staticmethod
        def forgotten_password(tokenID):
                forgotten_password = '<html>' \
                                '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                '<p align="left">Can’t remember your password? No worries! Please check your email for instructions on how to reset your password. Click the link below to proceed.</p>'\
                                '<p align= "left">Link to reset password: <a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="'+IntugloApp.GlobalClientServerURLFrontend+'?token='+tokenID+'">Click Here</a></p>' \
                                '<p align="left">If you did not receive the email after 10 minutes, please check your spam folder or call our friendly Customer Service at +603-78322188. You can also click on the link to reset the password and try again.Please complete your profile and change password to use services.</p>'\
                                '</div></body>' \
                                '</html>'
                return forgotten_password

        @staticmethod
        def change_password(temporaryPassword):
                change_password = '<html>' \
                                '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                '<p align="left">Great job! You have successfully changed your password. Should you have any difficulty to login to your account, please email to customerservice@intuglo.com or call us at +603-78322188. </p>'\
                                '<p align="left">Password: ' + temporaryPassword + '</p>' \
                                '<p align="left">Thank you,</p>' \
                                '<p align="left">Intuglo Sales Team</p>'\
                                '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="'+IntugloApp.GlobalClientServerURLFrontend+'/">Login</a></p>' \
                                '</div></body>' \
                                '</html>'
                return change_password

        @staticmethod
        def change_password_notify():
                change_password = '<html>' \
                                '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                '<p align="left">Great job! You have successfully changed your password. Should you have any difficulty to login to your account, please email to customerservice@intuglo.com or call us at +603-78322188. </p>'\
                                '<p align="left">Thank you,</p>' \
                                '<p align="left">Intuglo Sales Team</p>'\
                                '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="'+IntugloApp.GlobalClientServerURLFrontend+'/">Login</a></p>' \
                                '</div></body>' \
                                '</html>'
                return change_password


        @staticmethod
        def upon_order(payment_id):
                database_connection = get_db_connection()
                cursor = database_connection.cursor()
                cursor.execute("select p.transaction_id\
                                from ship_orders o\
                                left join payments p on o.payment_id = p.payment_id\
                                where p.payment_id ='"+str(payment_id)+"'")
                quotation_info = cursor.fetchone()
                transaction_ref = quotation_info['transaction_id']

                upon_order = '<html>' \
                        '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                        '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                        '<p align="left">We are happy that you have chosen us to be your trusted supply chain partner. Please find some information below to guide you through the entire process of ordering and shipping your products.</p>' \
                        '<p align="left">'+transaction_ref+'</p>'\
                        '<p align="left">Please adhere to the dates above accordingly to ensure your order is processed on time.</p>'\
                        '<p align="left">Thank you,</p>'\
                        '<p align="left">Intuglo Sales Team</p>'\
                        '</div></body>' \
                        '</html>'
                return upon_order

        @staticmethod
        def upon_setup_qt(quotation_id):
                database_connection = get_db_connection()
                cursor = database_connection.cursor()
                cursor.execute("select q.quote_ref_no,q.container_box_count,q.arrival_date,q.departure_date,p1.port_name as PF,p2.port_name as PT\
                                from ship_quotations q\
                                left join ports p1 on q.port_id_from = p1.port_id\
                                left join ports p2 on q.port_id_to = p2.port_id\
                                where q.quotation_id ='"+quotation_id+"'")
                quotation_info = cursor.fetchone()
                quotation_ref = quotation_info['quote_ref_no']
                container_count = quotation_info['container_box_count']
                etd = quotation_info['departure_date']
                eta = quotation_info['arrival_date']
                PortDep = quotation_info['PF']
                PortArrival = quotation_info['PT']

                upon_setup_qt = '<html>' \
                                '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                '<p align="left">You are all set to engage with your trusted customers on Intuglo! Please get ready to receive your orders. The following is the quotation (s) to secure new consolidation.</p>'\
                                '<p align="left">Quotation ID: "'+str(quotation_id)+'",</p>' \
                                '<p align="left">Quotation Reference: '+str(quotation_ref)+ '</p>' \
                                '<p align="left">Containers For Sale: '+str(container_count)+ '</p>' \
                                '<p align="left">ETD: '+str(etd)+'</p>' \
                                '<p align="left">ETA: '+str(eta)+'</p>' \
                                '<p align="left">Departure Port: '+str(PortDep)+'</p>' \
                                '<p align="left">Arrival Port: '+str(PortArrival)+'</p>' \
                                '<p align="left"> Thank you.</p>' \
                                '<p align="left"> Intuglo Business Development Team</p>' \
                                '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="'+IntugloApp.GlobalClientServerURLFrontend+'/">Click Here</a></p>' \
                                '</div></body>' \
                                '</html>'
                return upon_setup_qt    
        
        @staticmethod
        def custom_doc_download(quotation_id):
                database_connection = get_db_connection()
                cursor = database_connection.cursor()
                cursor.execute("select o.order_id,DATE_FORMAT(q.departure_date, '%d/%M/%Y')\
                            from ship_orders o\
                            left join ship_quotations q on o.quotation_id = q.quotation_id\
                            where o.quotation_id ='"+quotation_id+"'")
                quotation_info = cursor.fetchone()
                orderID = quotation_info['order_id']
                departure = quotation_info['departure_date']
                days_left_to_upload_doc = departure - timedelta(days=5) # date - days

                custom_doc_download = '<html>' \
                                '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                '<p align="left"> Hello. We noticed that you have not completed uploading the required documents for Custom Clearance for '+orderID+'. Please upload them immediately. The last day for you to complete the upload is '+days_left_to_upload_doc+'.</p>' \
                                '<p align="left"> Failure to do so within the stated timeline may lead to an incomplete processing of your order. This will delay or lead to a cancellation of your shipment.  Please take note that you shall bear any charges that may arise from failure to complete this process.</p>' \
                                '<p align="left"> Please ignore this email if you have completed the process.</p>'\
                                '<p align="left"> Thank you.</p>'\
                                '<p align="left"> Intuglo Operation Team</p>'\
                                '</div></body>' \
                                '</html>'
                return custom_doc_download

        @staticmethod
        def cargo_sending():
                cargo_sending = '<html>' \
                                '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                '<p align="left"> Hello. We noticed that you did not click on ‘Cargo Sent’. Failure to do so may delay delivery of your cargo to the warehouse with the address stated on the Order Confirmation Note. You might also have forgotten to inform us of this. Please do so immediately to avoid any delay. It is important that you remember to click on ‘Cargo Sent’ as we need to be notified. This will allow us to ensure your order is processed.</p>' \
                                '<p align="left"> Thank you.</p>'\
                                '<p align="left"> Intuglo Operation Team</p>'\
                                '</div></body>' \
                                '</html>'
                return cargo_sending
        
        @staticmethod
        def authorize_payment_block(order_id):
                database_connection = get_db_connection()
                cursor = database_connection.cursor()
                cursor.execute("select o.order_id,v1.country_code_departure,v2.country_code_arrival, q.vessel\
                            from ship_orders o\
                            left join ship_quotations q on o.quotation_id = q.quotation_id\
                            left join route_vessel_view v1 on q.port_id_from = v1.port_name_arrival\
                            left join route_vessel_view v2 on q.port_id_to = v2.port_name_arrival\
                            where o.order_id ='"+order_id+"'")
                quotation_info = cursor.fetchone()
                orderID = quotation_info['order_id']
                country_from = quotation_info['country_code_departure']
                country_to = quotation_info['country_code_arrival']
                vesselName = quotation_info['vessel']

                authorize_payment_block = '<html>' \
                                        '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                        '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                        '<p align="left"> Thank you for your order '+orderID+' which is a shipment from '+country_from+' to '+country_to+'. We noticed that you did not authorise a credit block for us to process your order.</p>' \
                                        '<p align="left"> Please click on the link to complete the authorisation. The authorisation is required for us to confirm the allocation of space for your order on '+vesselName+'. Please note that the authorisation is only to block your credit and does not involve the transfer of money from your account to ours. The actual transfer of money will only occur at the end of the entire booking process. This is when the quotation is closed and all orders are successfully processed. This ensures all shared prices are leveraged for all successful orders.</p>'\
                                        '<p align="left"> The unutilised credit will be released once the actual transfer of money occurs. For further information or clarification, please contact your bank or call our Customer Service at +603-78322188.</p>'\
                                        '<p align="left"> Thank you.</p>'\
                                        '<p align="left"> Intuglo Operation Team</p>'\
                                        '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="'+IntugloApp.GlobalClientServerURLFrontend+'/">Click Here</a></p>' \
                                        '</div></body>' \
                                        '</html>'
                return authorize_payment_block

        @staticmethod
        def qt_closing_soon(quotation_id):
                qt_closing_soon = '<html>' \
                                '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                '<p align="left"> Quotation '+quotation_id+' closes in 5 days. If you have not conducted a search for on boarding for this shipment, please do so immediately.</p>'\
                                '<p align="left"> If you have done so, please ensure that you have completed the required processes for a safe delivery of your cargo.</p>' \
                                '<p align="left"> Please confirm that your cargo has arrived at the warehouse with the address stated on the Order Confirmation Note.</p>' \
                                '<p align="left"> If you have not completed the required shipping processes, please click on the link:...</p>' \
                                '<p align="left"> Welcome onboard Intuglo and we look forward to your next order!</p>' \
                                '<p align="left"> Thank you.</p>' \
                                '<p align="left"> Intuglo Operation Team</p>' \
                                '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="'+IntugloApp.GlobalClientServerURLFrontend+'/">Login</a></p>' \
                                '</div></body>' \
                                '</html>'
                return qt_closing_soon

        @staticmethod
        def qt_closed(quotation_id):
                database_connection = get_db_connection()
                cursor = database_connection.cursor()
                cursor.execute("select o.order_id,q.vessel, DATE_FORMAT(q.departure_date, '%d/%m/%Y') as ETD\
                                from ship_orders o\
                                left join ship_quotations q on o.quotation_id = q.quotation_id\
                                where o.quotation_id ='"+str(quotation_id)+"'")
                quotation_info = cursor.fetchone()
                vesselName = str(quotation_info['vessel'])
                etd = str(quotation_info['ETD'])

                qt_closed = '<html>' \
                        '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                        '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                        '<p align="left"> Quotation "'+str(quotation_id)+'" is closed! All successful orders will be boarded on '+vesselName+' on '+etd+'.  Please note that FINAL PAYMENT will be deducted from the earlier pre-authorised credit block.</p>'\
                        '<p align="left"> The unutilised credit will be released when the money is transferred. Thank you for using our service. We look forward to your next order!</p>'\
                        '<p align="left"> Thank you.</p>' \
                        '<p align="left"> Intuglo Operation Team</p>' \
                        '</div></body>' \
                        '</html>'
                return qt_closed

        @staticmethod
        def final_shipment_confirm(order_id):
                database_connection = get_db_connection()
                cursor = database_connection.cursor()
                cursor.execute("select q.vessel\
                            from ship_orders o\
                            left join ship_quotations q on o.quotation_id = q.quotation_id\
                            where o.order_id ='"+order_id+"'")
                quotation_info = cursor.fetchone()
                vessel = quotation_info['vessel']

                final_shipment_confirm = '<html>' \
                                        '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                        '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                        '<p align="left"> We are pleased to inform you that your booking "'+str(order_id)+'" is confirmed to be onboard "'+str(vessel)+'". Please take note of the arrival date to ensure a smooth delivery of your cargo.</p>'\
                                        '<p align="left"> Thank you.</p>' \
                                        '<p align="left"> Intuglo Operation Team</p>' \
                                        '</div></body>' \
                                        '</html>'
                return final_shipment_confirm

        @staticmethod
        def successfull_custom_clearance():
                successfull_custom_clearance = '<html>' \
                                                '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                                '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                                '<p align="left"> Congratulations! You are just one step away from completing your order. Please note that your cargo has cleared the local custom check. Please ensure that the necessary arrangement is made to deliver the cargo to the designated destination.</p>'\
                                                '<p align="left"> Thank you for trusting Intuglo. We look forward to your next shipment.</p>'\
                                                '<p align="left"> Intuglo Operation Team</p>' \
                                                '</div></body>' \
                                                '</html>'
                return successfull_custom_clearance

        @staticmethod
        def final_payment_successful_deducted():
                final_payment_successful_deducted = '<html>' \
                                                '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">'\
                                                '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">'\
                                                '<p align="left">Hello. The final payment of RMxxxx has been successfully deducted and the balance reverted to your account. Thank you for shipping with Intuglo. We look forward to your next shipment.</p>'\
                                                '<p align="left">Thank you.</p>'\
                                                '<p align="left">Intuglo Operation Team</p>'\
                                                '</div></body>'\
                                                '</html>'
                return final_payment_successful_deducted

        @staticmethod
        def payment_list_ready(quotation_id):
                database_connection = get_db_connection()
                cursor = database_connection.cursor()
                cursor.execute("select quotation_id\
                            from ship_quotations\
                            where o.quotation_id ='"+quotation_id+"'")
                quotation_info = cursor.fetchone()
                qt_id = quotation_info['quotation_id']

                payment_list_ready = '<html>' \
                                '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                '<p align="left">The list of payment for shipment '+qt_id+' is ready. Please check and confirm. Click on the link: … to access the list.</p>' \
                                '<p align="left">Please take note that we will only release payment upon confirmation of acceptance of the amount stated by your good self</p>'\
                                '<p align="left">Once confirmed, we will proceed to remit/bank-in the amount to your account as per the details stated on your profile.</p>'\
                                '<p align="left">We will NOT entertain any claims once you have confirmed your acceptance of the payment list.</p>'\
                                '<p align="left">Thank you.</p>' \
                                '<p align="left">Intuglo Finance Team</p>' \
                                '</div></body>' \
                                '</html>'
                return payment_list_ready

        @staticmethod
        def payment_50():
                payment_50 = '<html>' \
                        '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                        '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                        '<p align="left">Thank you for another successful shipment! Please note payment of 50% of the stated amount has been remitted/banked-in to your account as per the details on your profile. Please check your account.</p>' \
                        '<p align="left">For your information, the bank takes 3 working days to clear the payment. In the event you did not receive the payment after 3 days, please call +603-78322188. Our account payable team shall provide the necessary clarification.</p>'\
                        '<p align="left">Thank you.</p>' \
                        '<p align="left">Intuglo Finance Team</p>' \
                        '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="{}/">Login</a></p>'\
                        '</div></body>' \
                        '</html>'
                return payment_50
        
        @staticmethod
        def payment_40():
                payment_40 = '<html>' \
                        '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                        '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                        '<p align="left">Thank you for another successful shipment! Please note payment of 40% of the stated amount has been remitted/banked-in to your account as per the details on your profile. Please check your account.</p>' \
                        '<p align="left">For your information, the bank takes 3 working days to clear the payment. In the event you did not receive the payment after 3 days, please call +603-78322188. Our account payable team shall provide the necessary clarification.</p>'\
                        '<p align="left">Thank you.</p>' \
                        '<p align="left">Intuglo Finance Team</p>' \
                        '<p><a style="color: #fff;background-color: #FF7E2A;border-color: #FF7E2A;padding: 7px;font-size: 15px;width: 100%;text-decoration: none;" href="{}/">Login</a></p>'\
                        '</div></body>' \
                        '</html>'
                return payment_40

        @staticmethod
        def approve_credit_blocked():
                approve_credit_blocked = '<html>' \
                                        '<body> <div align="center" style="height:400px;width:600px;padding:7px;margin:auto;">' \
                                        '<img src="https://s3-ap-southeast-1.amazonaws.com/intuglo-general/logo.JPG" alt="Intuglo" align="center" style="width:220px">' \
                                        '<p align="left"> The creditblocked has just been approved.</p>'\
                                        '<p align="left"> Thanks.</p>'\
                                        '<p align="left"> Intuglo Operation Team</p>' \
                                        '</div></body>' \
                                        '</html>'
                return approve_credit_blocked