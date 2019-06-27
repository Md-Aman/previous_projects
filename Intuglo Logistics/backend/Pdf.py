'''
Name  :  Pdf
Description  :  Display customer order details in pdf
'''

import falcon
import json
from fpdf import FPDF
from DatabaseConnection import connection
# from memcacheResource import MemcacheFunctions
# from collections import OrderedDict
# from decimal import Decimal
from Tools import Tools

try:
	database_connection = connection.get_connection()
	cursor = database_connection.cursor()
	cursor.execute("select o.login_id, o.quotation_id, o.hs_code_id, o.order_status_code, o.container_id, o.company_name, o.contact_person,"
            "o.contact_number, o.email, o.delivery_address, o.four_digit_hs_code, o.halal_status, o.cargo_description, o.merchandise_value,"
            "o.weight, o.cbm, DATE_FORMAT(o.booking_date, '%d/%m/%Y') AS booking_date, DATE_FORMAT(o.confirmation_date, '%d/%m/%Y') AS confirmation_date, o.booking_price_a, o.booking_price_b, o.booking_price_gst,"
            "o.booking_price_total, o.closing_price_a, o.closing_price_b, o.closing_price_gst, o.closing_price_total, o.order_pdf_url,"
            "c.company_name,c.customer_name,c.mobile_no,c.address,c.email,DATE_FORMAT(q.departure_date, '%d/%m/%Y') AS departure_date,"
            "DATE_FORMAT(q.arrival_date, '%d/%m/%Y') AS arrival_date,q.port_id_from,q.port_id_to,"
            "q.warehouse_departure_address,q.vessel,q.custom_broker from ship_orders o join customers c "
            "on o.login_id = c.login_id join ship_quotations q on o.quotation_id = q.quotation_id where o.order_id=5")
	row = cursor.fetchone()
	row_string = [str(i) for i in row]
	print(row)
	if (cursor.rowcount > 0):
		booking_details = list(row_string)
		print(booking_details)
except ValueError as err:
	raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
except mysql.connector.Error as err:
	raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
except Exception as err:
	raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
finally:
	cursor.close()
	database_connection.close()
	print("Connection Closed")

    # columns = ['LoginID','QuotationID','HSCodeID','Order_Status_Code','ContainerID','Company_name','ContactPerson','ContactNumber',
    #            'Email','DeliveryAddress','FourDigitHSCode','HalalStatus','CargoDescription','MerchandiseValue','Weight','cbm','BookingDate',
    #            'ConfirmationDate','BookingPrice_A','BookingPrice_B','BookingPrice_gst','BookingPrice_total','ClosingPrice_A','ClosingPrice_B',
    #            'ClosingPrice_gst','ClosingPrice_total','Order_pdf_url','Company_name','CustomerName','MobileNo','Address','Email',
    #            'DepartureDate','ArrivalDate','PortFrom','PortTo','WarehouseDepartureAddress','Vessel','CustomBroker']
    # booking_detail_dictionary = dict(zip(columns, booking_details))
    # print("data",booking_detail_dictionary)
    # # resp.status = falcon.HTTP_200
    # result_json = json.dumps(booking_detail_dictionary)
    # resp.body = (result_json)
pdf = FPDF()
pdf.add_page()
pdf.set_font('Times', 'B', 12)
pdf.cell(40, 10, 'SHIPPER''S DETAILS')
pdf.set_font('Times', '', 10)
pdf.ln(8);pdf.cell(30, 10, 'Company');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[5])
pdf.ln(5);pdf.cell(30, 10, 'Contact Person');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[6])
pdf.ln(5);pdf.cell(30, 10, 'Contact Number');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[7])
pdf.ln(5);pdf.cell(30, 10, 'Delivery Address');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[9])
pdf.ln(5);pdf.cell(30, 10, 'Shipper Type');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[5])
pdf.ln(5);pdf.cell(30, 10, 'Email Address');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[8])
pdf.ln(5);pdf.cell(30, 10, 'Merchandize Value');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[13])
pdf.set_font('Times', 'B', 12)
pdf.ln(8)
pdf.cell(40, 10, 'SHIPMENT DETAILS')
pdf.set_font('Times', '', 10)
pdf.ln(8);pdf.cell(30, 10, 'Quotation ID');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[1])
pdf.ln(5);pdf.cell(30, 10, 'Departure Date');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[32])
pdf.ln(5);pdf.cell(30, 10, 'Arrival Date');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[33])
pdf.ln(5);pdf.cell(30, 10, 'Port From');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[34])
pdf.ln(5);pdf.cell(30, 10, 'Port to');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[35])
pdf.ln(5);pdf.cell(30, 10, 'Logstic Provider');pdf.cell(20, 10, ':');pdf.cell(10, 10, 'Test')
pdf.ln(5);pdf.cell(30, 10, 'Vessel');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[37])
pdf.ln(5);pdf.cell(30, 10, 'Custom Broker');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[38])
pdf.ln(5);pdf.cell(30, 10, 'Warehouse Departure');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[36])
pdf.ln(5);pdf.cell(30, 10, 'Bill of Lading');pdf.cell(20, 10, ':');pdf.cell(10, 10, 'Test')
pdf.set_font('Times', 'B', 12)
pdf.ln(8)
pdf.cell(40, 10, 'CARGO DETAILS')
pdf.set_font('Times', '', 10)
pdf.ln(8);pdf.cell(30, 10, '6 Digit HSCode');pdf.cell(20, 10, ':');pdf.cell(10, 10, 'Test')
pdf.ln(5);pdf.cell(30, 10, '4 Digit HSCode');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[10])
pdf.ln(5);pdf.cell(30, 10, 'Cargo Description');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[12])
pdf.ln(5);pdf.cell(30, 10, 'Estimated CBM');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[15])
pdf.ln(5);pdf.cell(30, 10, 'Estimated Weight');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[14])
pdf.ln(5);pdf.cell(30, 10, 'Packing Details');pdf.cell(20, 10, ':');pdf.cell(10, 10, 'Test')
pdf.ln(5);pdf.cell(30, 10, 'Quantity');pdf.cell(20, 10, ':');pdf.cell(10, 10, 'Test')
pdf.ln(5);pdf.cell(30, 10, 'Halal Status');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[11])
pdf.ln(5);pdf.cell(30, 10, 'Warehouse Departure');pdf.cell(20, 10, ':');pdf.cell(10, 10, booking_details[36])
pdf.ln(5);pdf.cell(30, 10, 'Merchandise value');pdf.cell(20, 10, ':');pdf.cell(10, 10, 'Test')
pdf.set_font('Times', 'B', 12)
pdf.ln(8)
pdf.cell(40, 10, 'ORDER DETAILS')
pdf.set_font('Times', '', 10)
pdf.ln(10);pdf.cell(90, 5, 'Description',1,0,'C');pdf.cell(30, 5, 'Unit',1,0,'C');
pdf.cell(30, 5, 'Price Per Unit',1,0,'C');pdf.cell(30, 5, 'Total',1,1,'C');
pdf.cell(90, 5, 'Document Charges at Departure Port/Terminal(SHA,CN)',1,0,'C');pdf.cell(30, 5, booking_details[13],1,0,'C');
pdf.cell(30, 5, booking_details[13],1,0,'C');pdf.cell(30, 5, booking_details[13],1,1,'C');
pdf.cell(90, 5, 'Document Charges at Arrival Port/Terminal(SIN,SG)',1,0,'C');pdf.cell(30, 5, booking_details[13],1,0,'C');
pdf.cell(30, 5, booking_details[13],1,0,'C');pdf.cell(30, 5, booking_details[13],1,1,'C');
pdf.cell(90, 5, '',0,0,'C');pdf.cell(30, 5, 'GST',1,0,'C');
pdf.cell(30, 5, booking_details[13],1,0,'C');pdf.cell(30, 5, booking_details[13],1,1,'C');
pdf.cell(90, 5, '',0,0,'C');pdf.cell(60, 5, 'Freight Logistic',1,0,'C');
pdf.cell(30, 5, booking_details[13],1,1,'C');
pdf.output('tuto5.pdf', 'F')