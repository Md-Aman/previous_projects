## Please drop your current schema and recreate 'intuglo' schema. Then run the scripts below:
######################################################
#                       _                 _          #
#                      | |               | |         #
#    ___   ___   _ __  | |_   ___  _ __  | |_  ___   #
#   / __| / _ \ | '_ \ | __| / _ \| '_ \ | __|/ __|  #
#  | (__ | (_) || | | || |_ |  __/| | | || |_ \__ \  #
#   \___| \___/ |_| |_| \__| \___||_| |_| \__||___/  #
#                                                    #
######################################################

###	1. LIST OF TABLES ###
#-----------------------------------
# config
# countries
# hs_code
# ship_incoterms
# industries
# logins
# ship_order_status
# payment_types
# platforms
# ports
# ship_shipment_types
# terms_conditions
# user_platforms
# businesses
# customers
# ship_quotations
# logistic_providers
# ship_containers
# ship_orders
# ship_packing_list
# ship_quotation_handling_charges
# ship_quotation_status
# ship_unit_of_measures
# carts
# hs_code_set
# hs_set
# custom_agent
# routes
# vessel
# ship_custom_documents
# email_template
# ship_cargo_status
# ship_payment_status
# ship_custom_status
# ship_cargo_status_tracking
# profile_documents
# ship_container_types
# ship_container_types_size 
# ship_custom_agent_documents
# user_types




###	2. LIST OF VIEWS ###
#--------------------------------------
# ship_customer_orders
# ship_logistic_providersquotation_list_view
# ship_customer_booking_list_view
# ship_logistic_providers_order_list_view
# ship_logistic_providers_profile
# ship_quotations_for_booking
# ship_hs_code_view
# ship_admin_order_list_view
# ship_admin_quotation_list_view
# ship_route_vessel_view

###	3. LIST OF INDEXES ###
#--------------------------------------
# idx_terms_conditions
# idx_user_platforms
# idx_user_platforms_0
# idx_businesses
# fk_users_0
# idx_users
# idx_users_1
# idx_customers
# idx_ship_quotations
# idx_ship_quotations_0
# idx_ship_quotations_1
# idx_ship_quotations_2
# idx_ship_quotations_3
# idx_logistic_providers
# idx_logistic_providers_0
# idx_ship_containers
# idx_ship_orders
# idx_ship_orders_0
# idx_ship_orders_1
# idx_ship_orders_2
# idx_ship_orders_3
# idx_ship_orders_4
# idx_ship_packing_list
# idx_ship_quotation_handling_charges
# idx_ship_quotation_handling_charges_0
# idx_custom_agent
# idx_vessel
# idx_routes
# idx_container_type_1
# idx_container_size_1
# idx_user_type_5



###	4. LIST OF FOREIGN KEYS ###
#--------------------------------------
# fk_ship_quotations_4
# fk_businesses
# fk_ship_containers
# fk_users_1
# fk_users_0
# fk_users
# fk_customers
# fk_ship_orders_3
# fk_ship_orders_0
# fk_ship_orders_1
# fk_ship_orders
# fk_ship_orders_2
# fk_ship_orders_4
# fk_ship_packing_list
# fk_ship_quotation_handling_charges
# fk_ship_quotation_handling_charges_1
# fk_ship_quotation_handling_charges_2
# fk_ship_quotations_3
# fk_ship_quotations_0
# fk_ship_quotations_1
# fk_ship_quotations_2
# fk_ship_quotations
# fk_logistic_providers
# fk_logistic_providers_0
# fk_terms_conditions
# fk_user_platforms
# fk_user_platforms_0
# fk_ship_orders_5
# fk_ship_quotations_5
# fk_hs_code_set
# fk_custom_agent
# fk_routes_0
# fk_routes_1
# fk_vessel_0
# fk_ship_quotations_6
# fk_ship_quotations_7
# fk_container_type_1
# fk_logins

### 5. LIST OF SEQUENCES ###
#--------------------------------------
# ship_seq_orders
# ship_seq_quotations
# ship_seq_containers
# ship_seq_merchants


#------------------------------------------------
### STARTING SCRIPTS ###
#------------------------------------------------
# Table Config #
CREATE TABLE intuglo.config ( 
	config_id            int  NOT NULL  AUTO_INCREMENT,
	config_key           varchar(255)  NOT NULL	COMMENT 'the setting and configuration items is stored in this column'  ,
	config_value         varchar(255)  NOT NULL	COMMENT 'the value of each setting stored in this column'  ,
	updated_on           timestamp   DEFAULT CURRENT_TIMESTAMP	COMMENT 'stores the datetime that this record is updated' ,
	CONSTRAINT pk_config PRIMARY KEY ( config_id ),
	CONSTRAINT idx_config_key UNIQUE ( config_key ) 
 );

CREATE TABLE intuglo.payments (
  payment_id            int NOT NULL AUTO_INCREMENT,
  transaction_id        varchar(20) NOT NULL,
  order_id              varchar(30) DEFAULT NULL COMMENT 'Order_ID for approved credit blocks',
  payment_types         varchar(100) DEFAULT NULL COMMENT 'Payment types',      
  payment_gateway       varchar(20) DEFAULT NULL COMMENT 'Type of payment gateway',
  payment_tax_type      varchar(20) DEFAULT NULL COMMENT 'Type of tax',
  payment_tax_rate      decimal(10,2) DEFAULT 0.00 COMMENT 'Tax rate',
  payment_amount_wo_tax decimal(10,2) DEFAULT 0.00 COMMENT 'Total price without tax',
  payment_tax_amount    decimal(10,2) DEFAULT 0.00 COMMENT 'Tax amount',
  payment_amount_with_tax decimal(10,2) DEFAULT 0.00 COMMENT 'Total price with tax',
  payment_status        varchar(30) DEFAULT 'UNPAID' COMMENT 'Payment status from gateway',
  created_on            timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
  modified_on           timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
  payment_gateway_reciept JSON NULL DEFAULT NULL,
  CONSTRAINT pk_payments PRIMARY KEY (`payment_id`)
);

# Table Payment_Types #
CREATE TABLE intuglo.payment_types ( 
	payment_type         varchar(100)  COMMENT 'stores the payment type',
	is_active            boolean  NOT NULL DEFAULT 1 ,
	CONSTRAINT pk_payment_types PRIMARY KEY ( payment_type )
 );
 
# Table Ship_Container_Types #
CREATE TABLE intuglo.ship_container_types(
	container_id		int NOT NULL AUTO_INCREMENT,
	container_type		varchar(255),
	CONSTRAINT pk_ship_container_type PRIMARY KEY ( container_id),
	CONSTRAINT idx_container_type UNIQUE ( container_id)
);
# Table Ship_Container_Types_Size #
CREATE TABLE intuglo.ship_container_types_size (
	container_id		int NOT NULL AUTO_INCREMENT,
	container_type_id	int NOT NULL,
	description			varchar(255) NOT NULL COMMENT 'container type description',
	CONSTRAINT pk_ship_container_size PRIMARY KEY ( container_id),
	CONSTRAINT idx_container_size UNIQUE ( container_id)
);
	
 # Table Countries #
 CREATE TABLE intuglo.countries ( 
	country_code         char(2)  NOT NULL 	COMMENT 'ISO Alpha-2 Country Code' ,
	country_name         varchar(100)   COMMENT 'Country Name' ,
	CONSTRAINT pk_countries PRIMARY KEY ( country_code )
 );
 
 # Table HS_Code #
 CREATE TABLE intuglo.hs_code ( 
	hs_code_id           int  NOT NULL  AUTO_INCREMENT,
	hs_code_header              varchar(4)  NOT NULL COMMENT 'stores 4-digit hscode' ,
    hs_code_sub              varchar(2)  NOT NULL  COMMENT 'stores 2-digit hscode' ,
    hs_code_item              varchar(4)  NOT NULL  COMMENT 'stores the last 4-digit hscode',
    tax_export              varchar(10)  NOT NULL  COMMENT 'export tax rate' ,
    tax_import				varchar(10)  NOT NULL COMMENT 'import tax rate',
	is_active            boolean  NOT NULL DEFAULT 1 COMMENT 'determines if the HS Code is available in system or not.
1 = available
0 = unavailable' ,
	updated_on           timestamp   DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime that this record is updated' ,
	description          varchar(1000)   COMMENT 'stores the defined hs code description by custom' ,
	gst_percentage       varchar(11)  COMMENT 'stores the percentage of gst related to each hs code category'  ,
	CONSTRAINT pk_hs_code PRIMARY KEY ( hs_code_id ),
	CONSTRAINT idx_hs_code UNIQUE ( hs_code_id ) 
 );
 
 # Table Ship_Incoterms #
 CREATE TABLE intuglo.ship_incoterms ( 
	incoterm_code        char(3)  NOT NULL  COMMENT 'stores the 3-character code for each incoterm' ,
	description          varchar(255)    COMMENT 'incoterm description' ,
	is_active            boolean  NOT NULL DEFAULT 1  COMMENT 'specifies if this incoterm is available for user or not
	1- available
	0- not available' ,
	cargo_pickup		boolean COMMENT '
    0 - not pickup
    1 - pickup',
	updated_on           timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT 'last updated timestamp' ,
    custom_departure	boolean,
    custom_arrival		boolean,
	CONSTRAINT pk_incoterms PRIMARY KEY ( incoterm_code )
 );
 
 # Table Industries #
 CREATE TABLE intuglo.industries ( 
	industry_id          char(2)  NOT NULL 	COMMENT 'ISO Alpha-2 Industry Code',
    industry_no          char(3)  NOT NULL,
	industry_name        varchar(255)  NOT NULL  COMMENT 'stores the description of industry',
	CONSTRAINT pk_industries PRIMARY KEY ( industry_id )
 );
 
 # Table Logins #
 CREATE TABLE intuglo.logins ( 
	login_id             int  NOT NULL  AUTO_INCREMENT,
	email                varchar(255)  NOT NULL  COMMENT 'stores the email for login purpose',
	password             varbinary(255)   COMMENT 'stores the temp_password and updated password' ,
	is_active            boolean  NOT NULL DEFAULT 1 COMMENT 'specify whether users activate their account or not',
	created_on           timestamp   DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime the user created account',
	created_by           int  NOT NULL DEFAULT 0 ,
	user_type            int COMMENT '0 = admin
1 = supplier
2 = customer
3 = custom agent' ,
	need_change_password boolean  NOT NULL DEFAULT 0 COMMENT 
    '0 - user not need to change password
    1 - user need to change password',
	is_on_boarded        boolean  NOT NULL DEFAULT 0  COMMENT 'specifies if the required field of profile is completed' ,
    token_id 			 varchar(255) COMMENT 'stores the generated token id' ,
    token_validity 		 timestamp COMMENT 'stores the datetime of token validity for user',
    merchant_id			varchar(50) COMMENT 'stores the merchant id for each user',
    verified_user		boolean NOT NULL DEFAULT 0 COMMENT 'specify if user need account verification from admin
    0 - not verified
    1 - verified',
	CONSTRAINT pk_logins PRIMARY KEY ( login_id ),
	CONSTRAINT idx_logins_email UNIQUE ( email ) 
 );
 
 # Table Ship_Cargo_Status
  CREATE TABLE intuglo.ship_cargo_status ( 
	cargo_status_code    varchar(30)  NOT NULL  ,
	cargo_status_description varchar(255)  NOT NULL  COMMENT 'description of cargo status',
	CONSTRAINT pk_order_status PRIMARY KEY ( cargo_status_code )
 );
 
  # Table Ship_Custom_Status
  CREATE TABLE intuglo.ship_custom_status ( 
	custom_status_code    varchar(30)  NOT NULL  ,
	custom_status_description varchar(255)  NOT NULL  COMMENT 'description of custom status',
	CONSTRAINT pk_order_status PRIMARY KEY ( custom_status_code )
 );
 
  # Table Ship_Payment_Status
  CREATE TABLE intuglo.ship_payment_status ( 
	payment_status_code    varchar(30)  NOT NULL  ,
	payment_status_description varchar(255)  NOT NULL  COMMENT 'description of payment status',
	CONSTRAINT pk_order_status PRIMARY KEY ( payment_status_code )
 );


# Table Platforms #
CREATE TABLE intuglo.platforms ( 
	platform_id          int  NOT NULL  AUTO_INCREMENT,
	platform_name        varchar(100)  NOT NULL  COMMENT 'description of the platform name',
	is_active            boolean  NOT NULL DEFAULT 1 COMMENT 'stores the availability of platform to use
    0 - not available
    1 - available',
    orders				int COMMENT 'stores the order of platform',
	CONSTRAINT pk_platforms PRIMARY KEY ( platform_id )
 );

# Table Ports #
CREATE TABLE intuglo.ports ( 
	port_id              int  NOT NULL  AUTO_INCREMENT,
	port_name            varchar(255)  NOT NULL COMMENT 'port display name' ,
	country_code         char(2)  NOT NULL COMMENT 'code of country which the port belongs to' ,
	is_active            boolean  NOT NULL DEFAULT 1 COMMENT 'specifies if this port is available for user or not
1- available
0- not available' ,
	CONSTRAINT pk_ports PRIMARY KEY ( port_id )
 );
 
 # Table Ship_Shipment_Types #
 CREATE TABLE intuglo.ship_shipment_types ( 
	shipment_type_id     int  NOT NULL  AUTO_INCREMENT,
	shipment_type        varchar(50)  NOT NULL COMMENT 'stores the shipment type description' ,
	is_active            boolean  NOT NULL DEFAULT 1 COMMENT 'stores the availability of shipment to use in the system
    0 - not available
    1 - available',
	CONSTRAINT pk_shipment_types PRIMARY KEY ( shipment_type_id )
 );

# Table Terms_Conditions #
CREATE TABLE intuglo.terms_conditions ( 
	tc_id                int  NOT NULL  AUTO_INCREMENT COMMENT 'auto increment id',
	tc_type              tinyint    COMMENT '1 - customer registration
2 - supplier registration,
3 - quotation info',
	terms_conditions_text text NOT NULL  COMMENT 'the content of terms and condition'  ,
	created_by           int    ,
	created_on           timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
	CONSTRAINT pk_terms_conditions PRIMARY KEY ( tc_id )
 )  COMMENT 'to store terms and conditions data' engine=InnoDB;
 
 # Table User_Platforms #
 CREATE TABLE intuglo.user_platforms ( 
	user_platform_id     int  NOT NULL  AUTO_INCREMENT,
	login_id             int  NOT NULL  ,
	platform_id          int  NOT NULL  ,
	CONSTRAINT pk_user_platforms PRIMARY KEY ( user_platform_id )
 );
 
 # Table Businesses #
 CREATE TABLE intuglo.businesses ( 
	business_id             char(2)  NOT NULL 	COMMENT 'ISO Alpha-2 Business Code',
    business_no             char(3) NOT NULL, 
	business_name           varchar(255)  NOT NULL COMMENT 'stores the business description' ,
    business_type			varchar(255),
	industry_id             char(2)  NOT NULL  ,
	CONSTRAINT pk_businesses PRIMARY KEY ( business_id )
 );
 
 # Table Customers #
 CREATE TABLE intuglo.customers ( 
	customer_id          int  NOT NULL  AUTO_INCREMENT,
	login_id             int  NOT NULL  ,
	customer_name        varchar(255)  NOT NULL  COMMENT 'stores the customer name',
	mobile_no            varchar(50)    COMMENT 'stores the customer phone number',
	country_code         char(2)  NOT NULL  ,
	business_id          char(2)   COMMENT 'stores the business id that enter in profile' ,
	address_line_one     varchar(255)   COMMENT 'users company address',
    address_line_two     varchar(255)   COMMENT 'users company address',
	company_name         varchar(255)  COMMENT 'users company'  ,
	company_registration_no varchar(100)  COMMENT 'stores company registration number'  ,
	official_email              varchar(100)   COMMENT 'the company official email' ,
	website              varchar(100)   COMMENT 'the company website' ,
	office_phone         varchar(100)    COMMENT 'users office no',
	office_fax           varchar(100)    COMMENT 'users office fax no',
	association_club          varchar(255)    COMMENT 'users association/club/agent',
	nature_of_business   varchar(100)  COMMENT 'company nature of business'  ,
    timezone 			varchar(100) COMMENT 'stores users current timezone',
    import_export_license varchar(255) COMMENT 'stores the import export license file name',
    business_license varchar(255) COMMENT 'users company business license file/no',
    business_category 		varchar(100) ,
	tc_id                int  COMMENT 'terms and conditions id which the customer agreed while signed up'  ,
    city				varchar(50) COMMENT 'located city',
    state				varchar(100) COMMENT 'located state',
    postal_code			int COMMENT 'postal code for located city',
    industry_id 		char(2),
    business_size		char(1) COMMENT 'company business size
    M - Micro
    S - SME
    C - Corporations',
    logo			varchar(50) DEFAULT 'default.jpg',
    cart_id         int DEFAULT NULL COMMENT 'cart_id',
	CONSTRAINT pk_customers PRIMARY KEY ( customer_id )
 );
 
 # Table Ship_Quotations #
 CREATE TABLE intuglo.ship_quotations ( 
	quotation_id         		varchar(40)  NOT NULL COMMENT 'stores the generated quotation_id' ,
	shipment_type_id     		int    ,
	cargo_transit_duration 		int  COMMENT 'counted in days'  ,
	departure_date       		date   COMMENT 'is estimated departure date (ETD)'  ,
	number_of_transit_ports 	int    ,
	container_box_size   		decimal(10,2) DEFAULT 0.00  COMMENT 'how many footers'  ,
	port_id_from         		int   COMMENT 'port of departure'  ,
	port_id_to           		int  COMMENT 'port of arrival' ,
	incoterm_code        		char(3)    ,
	shipper_type         		char(1)   COMMENT 'shipper type can be importer or exporter
I: Importer
E: Exporter' ,
	supplier_login_id    		int  NOT NULL COMMENT 'the supplier who the quotation belongs to' ,
	arrival_date         		date   COMMENT 'is estimated arrival date (ETA)' ,
	vessel               		varchar(100) COMMENT 'vessel or flight name'   ,
	container_box_count  		int  COMMENT 'number of boxes for sale'  ,
	air_space_size       		decimal(10,2) DEFAULT 0.00   COMMENT 'Air space size (in Tons)'  ,
	air_space_count      		int  COMMENT 'quantity of air spaces for sale'  ,
    part_a 						decimal(10,2) DEFAULT 0.00 COMMENT 'part a - sea freight charges',
    part_b 						decimal(10,2) DEFAULT 0.00 COMMENT 'part b - total handling charges for D and A port',
    container_types   			int(10) COMMENT 'container types from container_type_size table',
	halal_consolidation 		varchar(500) COMMENT 'stores halal consolidation warehouse at departure', 
	halal_unstuffing			varchar(500) COMMENT 'stores halal unstuffing warehouse at arrival', 
	unstuffing  				varchar(500) COMMENT 'stores un-stuffing warehouse at arrival', 
	consolidation    			varchar(500) COMMENT 'stores consolidation warehouse at departure',
    quotation_status 			varchar(100),
    payment_status              VARCHAR(100) NULL DEFAULT NULL COMMENT 'stores_payment_status',
    quote_ref_no 				varchar(255) COMMENT 'stores the supplier reference number',
    hs_code_id 					int,
    file_name					varchar(255) COMMENT 'stores uploaded quotation file, naming based on quotation_id',
	vessel_id			 		int(11),
    custom_agent_id				int,
    created_by           int    ,
	created_on           timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
    modified_by			int,
    modified_on			timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
    shipment_completed		boolean  NOT NULL DEFAULT 0 COMMENT 'stores the completion of shipment of all orders
    0 - not complete
    1 - complete',
    total_people_per_shipment 	int DEFAULT 0,
	total_req_cbm_per_shipment 	int DEFAULT 0,
	CONSTRAINT pk_quotations PRIMARY KEY ( quotation_id )
 );
 
 # Table Logistic_Providers #
 CREATE TABLE intuglo.logistic_providers ( 
	supplier_id          int  NOT NULL  AUTO_INCREMENT,
	login_id             int  NOT NULL  ,
	supplier_name        varchar(255)   COMMENT 'stores the customer name' ,
	tc_id                int   COMMENT 'terms and conditions id which the providers agreed while signed up'  ,
	mobile_no            varchar(50)    COMMENT 'stores the providers phone number',
	country_code         char(2)  NOT NULL  ,
	business_id          char(2)   COMMENT 'stores the business id that enter in profile' ,
	address_line_one     varchar(255)   COMMENT 'users company address',
    address_line_two     varchar(255)   COMMENT 'users company address',
	company_name         varchar(255)  COMMENT 'users company'  ,
	company_registration_no varchar(100)  COMMENT 'stores company registration number'  ,
	official_email              varchar(100)   COMMENT 'the company official email' ,
	website              varchar(100)   COMMENT 'the company website' ,
	office_phone         varchar(100)    COMMENT 'users office no',
	office_fax           varchar(100)    COMMENT 'users office fax no',
	association_club          varchar(255)    COMMENT 'users association/club/agent',
	nature_of_business   varchar(100)  COMMENT 'company nature of business'  ,
    timezone 			varchar(100) COMMENT 'stores users current timezone',
    import_export_license varchar(255) COMMENT 'stores the import export license file name',
    business_license varchar(255) COMMENT 'users company business license file/no',
    business_category 		varchar(100) ,
    city				varchar(50) COMMENT 'located city',
    state				varchar(100) COMMENT 'located state',
    postal_code			int COMMENT 'postal code for located city',
    industry_id 		char(2),
    business_size		char(1) COMMENT 'company business size
    M - Micro
    S - SME
    C - Corporations',
    logo			varchar(50) DEFAULT 'default.jpg',
    bank_acc_no    varchar(50) COMMENT 'Bank Account Number',
    bank_name    varchar(50) COMMENT 'Bank name for the registered account',
    iban_no     varchar(50) COMMENT 'International' ,
    swift_code  varchar(50) COMMENT 'Swift Code',
    tax_rate    decimal(10,2) DEFAULT 0.00   COMMENT 'Tax Rate No',
    tax_type    varchar(50) COMMENT 'Tax Type',
    tax_number  varchar(50) COMMENT 'Tax Number',
	CONSTRAINT pk_suppliers PRIMARY KEY ( supplier_id )
 );
 
 # Table Ship_Containers #
 CREATE TABLE intuglo.ship_containers ( 
	container_id         varchar(40) NOT NULL,
	container_no         int NOT NULL  COMMENT 'stores the generated container_id'  ,
	quotation_id         varchar(50)  NOT NULL  ,
	total_cbm            int   DEFAULT 0 COMMENT 'stores total cbm of container',
    remaining_cbm			int DEFAULT 0 COMMENT 'stores the remaining cbm for user to book',
	halal_status          char(1)   COMMENT 'halal status
    H - halal
    N - non halal
    U - undefined',
	number_people_sharing int   DEFAULT 0 COMMENT 'stores the number of people sharing per container',
	percentage_full      decimal(5,2)   DEFAULT 0.00  COMMENT 'stores the percentage of container used',
    hs_set_id			   char(5) DEFAULT 'HSX',
    total_weight           int DEFAULT 0 COMMENT 'stores total weight of container',
    remaining_weight        int DEFAULT 0 COMMENT 'stores remaining wieght of container',
	CONSTRAINT pk_containers PRIMARY KEY ( container_id )
 );

 # Table Ship_Orders #
CREATE TABLE intuglo.ship_orders (
  `order_id` varchar(30) NOT NULL,
  `booking_payment_id` int NOT NULL COMMENT 'payment_id for booking payments',
  `creditblock_payment_id` int DEFAULT NULL COMMENT 'payment_id for credit block',
  `booking_date` date DEFAULT NULL COMMENT 'the date which the order is placed',
  `confirmation_date` date NOT NULL COMMENT 'the date which the booking is confirmed',
  `weight` int(11) DEFAULT '0' COMMENT 'the estimated weight of cargo in KG',
  `cbm` int(11) DEFAULT '0' COMMENT 'the estimated size of cargo in cubic meter',
  `booking_price_a` decimal(10,2) DEFAULT '0.00',
  `booking_price_ba` decimal(10,2) DEFAULT '0.00',
  `booking_price_bd` decimal(10,2) DEFAULT '0.00',
  `booking_price_tax` decimal(10,2) DEFAULT '0.00',
  `booking_price_tax_type` VARCHAR(10) NULL DEFAULT NULL,
  `booking_price_tax_amount` DECIMAL(10,2) NULL DEFAULT '0.00',
  `booking_price_total` decimal(10,2) DEFAULT '0.00',
  `booking_price_total_wo_tax` DECIMAL(10,2) DEFAULT '0.00',
  `closing_price_a` decimal(10,2) DEFAULT '0.00',
  `closing_price_ba` decimal(10,2) DEFAULT '0.00',
  `closing_price_bd` decimal(10,2) DEFAULT '0.00',
  `closing_price_tax` decimal(10,2) DEFAULT '0.00',
  `closing_price_tax_amount` DECIMAL(10,2) NULL DEFAULT '0.00',
  `closing_price_total` decimal(10,2) DEFAULT '0.00',
  `closing_price_tax_type` VARCHAR(10) NULL DEFAULT NULL,
  `closing_price_total_wo_tax` DECIMAL(10,2) DEFAULT '0.00',
  `cargo_status_code` varchar(30) NOT NULL,
  `payment_status_code` varchar(30) DEFAULT NULL,
  `custom_status_code` varchar(30) DEFAULT NULL,
  `booking_fee_payment_status` varchar(25) DEFAULT NULL COMMENT 'UNPAID, PAID, DELETE',
  `transaction_fee` int(11) DEFAULT NULL,
  `transaction_description` varchar(255) DEFAULT NULL,
  `booking_fee_tax_rate` int(10) DEFAULT NULL,
  `booking_fee_tax_type` varchar(10) DEFAULT NULL,
  `hs_code_id` varchar(11) DEFAULT NULL COMMENT 'the hs_code of order',
  `login_id` int(11) NOT NULL COMMENT 'the login_id of the customer who the order belongs to',
  `tc_id` int(11) DEFAULT NULL COMMENT 'terms and conditions id which the customer agreed while create order',
  `quotation_id` varchar(100) DEFAULT NULL COMMENT 'the quotation_id of shippment which will handle this order',
  `consignor_company_name` varchar(255) DEFAULT NULL COMMENT 'customer''s company name',
  `consignor_contact_person` varchar(255) DEFAULT NULL COMMENT 'name of contact person',
  `consignor_contact_number` varchar(50) DEFAULT NULL COMMENT 'customer''s contact number',
  `consignor_email` varchar(50) DEFAULT NULL COMMENT 'customer''s email',
  `consignor_delivery_address` varchar(255) DEFAULT NULL COMMENT 'the address of place which the cargo is ship to',
  `consignee_company_name` varchar(255) DEFAULT NULL COMMENT 'customer''s company name',
  `consignee_contact_person` varchar(255) DEFAULT NULL COMMENT 'name of contact person',
  `consignee_contact_number` varchar(50) DEFAULT NULL COMMENT 'customer''s contact number',
  `consignee_email` varchar(50) DEFAULT NULL COMMENT 'customer''s email',
  `consignee_delivery_address` varchar(255) DEFAULT NULL COMMENT 'the address of place which the cargo is ship to',
  `four_digit_hs_code` varchar(4) DEFAULT NULL COMMENT 'the second section of hs code which has four digits',
  `cargo_description` varchar(255) DEFAULT NULL COMMENT 'description about cargo',
  `consignor_merchandise_value` int(11) DEFAULT NULL COMMENT 'value of shipped goods',
  `consignee_merchandise_value` int(11) DEFAULT NULL COMMENT 'value of shipped goods',
  `quantity` int(11) DEFAULT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `consignor_commercial_value` int(11) DEFAULT NULL,
  `consignee_commercial_value` int(11) DEFAULT NULL,
  `consignor_billing_address` varchar(250) DEFAULT NULL,
  `consignee_billing_address` varchar(250) DEFAULT NULL,
  `logistic_provider` varchar(100) DEFAULT NULL,
  `bill_of_loading` varchar(250) DEFAULT NULL,
  `packing_details` varchar(250) DEFAULT NULL,
  `consignor_shipper` varchar(100) DEFAULT NULL,
  `consignee_shipper` varchar(100) DEFAULT NULL,
  `custom_agent_id` int(11) DEFAULT NULL,
  `button_code` int(11) DEFAULT NULL,
  `order_pdf_url` varchar(255) DEFAULT NULL COMMENT 'stores the location of generated receipt',
  `container_id` varchar(40) DEFAULT NULL COMMENT 'stores the container id which the order is placed in',
  `halal_status` char(1) DEFAULT NULL COMMENT 'specifies wether the order contains halal or non-halal:\nH: halal\nN: non-halal',
  `duties_and_tax` decimal(10,2) DEFAULT '0.00',
  `credit_block` decimal(10,2) DEFAULT '0.00',
  `container_by_depot` varchar(50) DEFAULT NULL,
  `booking_price_blocked` varchar(50) DEFAULT NULL,
  `final_price_payment` varchar(50) DEFAULT NULL,
  `balance_released` varchar(50) DEFAULT NULL,
  `booking_received_notification` varchar(50) DEFAULT NULL,
  `cargo_movement_changes` varchar(50) DEFAULT NULL,
  `notify_block_credit` varchar(50) DEFAULT NULL,
  `inform_final_payment` varchar(50) DEFAULT NULL,
  `notify_cargo_clearing` varchar(50) DEFAULT NULL,
  `notify_pay_up` varchar(50) DEFAULT NULL,
  `notify_order_completed` varchar(50) DEFAULT NULL,
  `buyer_documentation` varchar(50) DEFAULT NULL,
  `custom_declaration_form` varchar(50) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
  `modified_by` int(11) DEFAULT NULL,
  `modified_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
  CONSTRAINT pk_orders PRIMARY KEY ( order_id )
 );

 # Table Ship_Packing_Types #
 CREATE TABLE intuglo.ship_packing_types (
     packing_type_id            int NOT NULL AUTO_INCREMENT,
     packing_type_description   varchar(255) COMMENT 'description of the packing type',
     CONSTRAINT pk_packing_types PRIMARY KEY (packing_type_id)
 );
 
 # Table Ship_Packing_List #
 CREATE TABLE intuglo.ship_packing_list ( 
	packing_list_id      int  NOT NULL  AUTO_INCREMENT,
	order_id             varchar(30)  NOT NULL  ,
	packing_description  varchar(255)   COMMENT 'description of goods' ,
    material_number		decimal(10,2) DEFAULT 0.00 COMMENT 'number of material',
    quantity			decimal(10,2) DEFAULT 0.00 COMMENT 'quantity PKGs',
    gross_weight		decimal(10,2) DEFAULT 0.00 COMMENT 'weight KGs',
    net_weight			decimal(10,2) DEFAULT 0.00 COMMENT 'net weight KGs',
	measurement			decimal(10,2) DEFAULT 0.00 COMMENT 'measurement M3',
    sum_quantity		decimal(10,2) DEFAULT 0.00 COMMENT 'sum from quantity',
    sum_gross_weight	decimal(10,2) DEFAULT 0.00 COMMENT 'sum from gross-weight',
    sum_net_weight		decimal(10,2) DEFAULT 0.00,
    sum_measurement		decimal(10,2) DEFAULT 0.00,
    created_by           int    ,
	created_on           timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
    modified_by			int,
    modified_on			timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
	CONSTRAINT pk_packing_list PRIMARY KEY ( packing_list_id )
 );
 
 # Table Ship_Quotation_Handling_Charges #
 CREATE TABLE intuglo.ship_quotation_handling_charges ( 
	handling_charges_id          	int  NOT NULL  AUTO_INCREMENT,
	quotation_id         			varchar(100)  NOT NULL  ,
    charges_description				varchar(100)  NOT NULL,
	amount               			int  NOT NULL DEFAULT 0.00 COMMENT 'amount of charges' ,
	charges_location           		char(1)  NOT NULL COMMENT 'determines if handling charge is for arrival port of departure port:
A- arrival
D- departure' ,
	unit_of_measure_id				int NOT NULL ,
	CONSTRAINT pk_quotation_handling_charges PRIMARY KEY ( handling_charges_id )
 );

# Table Ship_Quotation_Status #
CREATE TABLE intuglo.ship_quotation_status ( 
    quotation_status_id         varchar(100)  NOT NULL  ,
    quotation_status_description varchar(100)  COMMENT 'quotation status description'  ,
    CONSTRAINT pk_quotation_status PRIMARY KEY ( quotation_status_id  )
);

# Table Ship_Unit_of_Measure #
CREATE TABLE intuglo.ship_unit_of_measure ( 
    unit_of_measure_id         int NOT NULL AUTO_INCREMENT ,
    unit_of_measure_description 	varchar(50) NOT NULL,
    CONSTRAINT pk_unit_of_measure_id PRIMARY KEY ( unit_of_measure_id  )
)COMMENT 'used in creating new quotation';

 
 # Table Hs_Code_Set #
 CREATE TABLE intuglo.hs_code_set (
	hs_code_set           char(5)  NOT NULL  ,
	hs_code_set_description    varchar(255)    ,
	CONSTRAINT pk_hs_code_set PRIMARY KEY ( hs_code_set )
 );
 
 # Table Hs_Set #
 CREATE TABLE intuglo.hs_set ( 
	hs_code_set_list_id         int  NOT NULL  AUTO_INCREMENT,
	hs_code_set           		char(5),
	hs_chapter    					decimal(6,2)    ,
	container_type   			int,
	CONSTRAINT pk_hs_set PRIMARY KEY ( hs_code_set_list_id )
 );
 
 # Table ship_custom_documents
  CREATE TABLE intuglo.ship_custom_documents ( 
	custom_documents_id          int  NOT NULL  AUTO_INCREMENT,
	order_id           varchar(30)  NOT NULL  ,
	file_name			varchar(255)    ,
    file_title			varchar(80) ,
    created_by           int    ,
	created_on           timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
    modify_by			int,
    modified_on			timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
	CONSTRAINT pk_custom_doc PRIMARY KEY ( custom_documents_id )
 );
 
 
 # Table ship_custom_agent_documents
  CREATE TABLE intuglo.ship_custom_agent_documents ( 
	custom_agent_documents_id          int  NOT NULL  AUTO_INCREMENT,
	order_id           varchar(30)  NOT NULL  ,
	file_name			varchar(255)    ,
    file_title			varchar(80) ,
    created_by           int    ,
	created_on           timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
    modify_by			int,
    modified_on			timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
	CONSTRAINT pk_custom_agent_documents PRIMARY KEY ( custom_agent_documents_id )
 );
 
 # Table Custom Agent #
 CREATE TABLE intuglo.custom_agent ( 
	custom_agent_id          int  NOT NULL  AUTO_INCREMENT,
	login_id             int  NOT NULL  ,
	agent_name        varchar(255)  NOT NULL  COMMENT 'stores the customer name',
	tc_id                int   COMMENT 'terms and conditions id which the agent agreed while signed up'  ,
	mobile_no            varchar(50)    COMMENT 'stores the custom agent phone number',
	country_code         char(2)  NOT NULL  ,
	business_id          char(2)   COMMENT 'stores the business id that enter in profile' ,
	address_line_one     varchar(255)   COMMENT 'users company address',
    address_line_two     varchar(255)   COMMENT 'users company address',
	company_name         varchar(255)  COMMENT 'users company'  ,
	company_registration_no varchar(100)  COMMENT 'stores company registration number'  ,
	official_email              varchar(100)   COMMENT 'the company official email' ,
	website              varchar(100)   COMMENT 'the company website' ,
	office_phone         varchar(100)    COMMENT 'users office no',
	office_fax           varchar(100)    COMMENT 'users office fax no',
	association_club          varchar(255)    COMMENT 'users association/club/agent',
	nature_of_business   varchar(100)  COMMENT 'company nature of business'  ,
    timezone 			varchar(100) COMMENT 'stores users current timezone',
    import_export_license varchar(255) COMMENT 'stores the import export license file name',
    business_license varchar(255) COMMENT 'users company business license file/no',
    business_category 		varchar(100) ,
    city				varchar(50) COMMENT 'located city',
    state				varchar(100) COMMENT 'located state',
    postal_code			VARCHAR(20) NULL DEFAULT NULL COMMENT 'postal code for located city' ,
    industry_id 		char(2),
    business_size		char(1) COMMENT 'company business size
    M - Micro
    S - SME
    C - Corporations',
    logo			varchar(50) DEFAULT 'default.jpg',
	CONSTRAINT pk_custom_agent PRIMARY KEY ( custom_agent_id )
 );
 
 # Table Routes #
 CREATE TABLE intuglo.routes ( 
	port_id_from            int NOT NULL COMMENT 'port departure',
	port_id_to				int NOT NULL COMMENT 'port arival',
	route_id           	    int  NOT NULL AUTO_INCREMENT,
    `country_code`          varchar(5) DEFAULT NULL,		
    `country_from`          varchar(100) DEFAULT NULL COMMENT 'Country From',		
	`country_to`            varchar(100) DEFAULT NULL COMMENT 'Country To',
	CONSTRAINT pk_route PRIMARY KEY ( route_id )
 );
 
# Table Vessel #
 CREATE TABLE intuglo.vessel ( 
	vessel_id           int NOT NULL AUTO_INCREMENT,
	vessel_no			varchar(255),
	route_id           	int  NOT NULL,
	etd					date   COMMENT 'is estimated arrival date (ETA)' ,
	eta					date   COMMENT 'is estimated arrival date (ETD)' ,
	vessel_name			varchar(255) COMMENT 'vessel names',
	CONSTRAINT pk_vessel PRIMARY KEY ( vessel_id )
 );
 
 # Table Email_Template
 CREATE TABLE intuglo.email_template (
	template_id		int,
    template_name	varchar(100),
    status			varchar(50),
    recipient		varchar(50),
    email_subject	varchar(2500),
    email_body		varchar(2500),
    CONSTRAINT pk_email_template PRIMARY KEY (template_id)
 );
 
 # Table Ship_Cargo_Status_Tracking
 CREATE TABLE intuglo.ship_cargo_status_tracking (
	tracking_id			int,
    updated_by          int    ,
	updated_on          timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
    order_id 			varchar(30),
    custom_status_code 	varchar(30),
    payment_status_code varchar(20),
    cargo_status_code 	varchar(20),
    CONSTRAINT pk_tracking_id PRIMARY KEY (tracking_id)
 );
 
 # Table Profile_Documents
 CREATE TABLE intuglo.profile_documents (
	profile_documents_id			int NOT NULL  AUTO_INCREMENT,
    updated_by          int    ,
	updated_on          timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
    login_id 			int,
    file_name	        varchar(255),
    CONSTRAINT pk_tracking_id PRIMARY KEY (profile_documents_id)
 );
 
 
  # Table Ship_Quotation_Sea_Freight_Charges #
 CREATE TABLE intuglo.ship_quotation_sea_freight_charges ( 
	sea_freight_charges_id          	int  NOT NULL  AUTO_INCREMENT,
	quotation_id         			varchar(100)  NOT NULL  ,
    charges_description				varchar(100)  NOT NULL,
	amount               			int  NOT NULL DEFAULT 0.00 COMMENT 'amount of charges' ,
	CONSTRAINT pk_quotation_handling_charges PRIMARY KEY ( sea_freight_charges_id )
 );

 # Table User Types #
CREATE TABLE intuglo.user_types ( 
	user_type_id             int  NOT NULL  AUTO_INCREMENT,
	user_type                tinyint,
	user_type_name			 varchar(50),
	CONSTRAINT pk_user_types PRIMARY KEY (user_type_id)
 );

#Table Carts #
CREATE TABLE intuglo.carts ( 
	cart_id               int  NOT NULL  AUTO_INCREMENT,
	login_id              int  NOT NULL  ,
    amount                decimal(10,2) NOT NULL DEFAULT 0 COMMENT 'stores amount without tax',
    tax_type              varchar(10) DEFAULT NULL COMMENT 'stores tax type',
    tax_rate              decimal(10,2) NOT NULL DEFAULT 0 COMMENT 'stores tax rate',
    tax_amount            DECIMAL(10,2) NULL DEFAULT '0.00' COMMENT 'stores tax amount',
    total_amount          decimal(10,2) NOT NULL DEFAULT 0 COMMENT 'stores amount with tax',
    cart_status           varchar(10) NOT NULL DEFAULT 'UNPAID' COMMENT 'cart_status',
	created_on            timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
    modified_on           timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
	CONSTRAINT pk_carts PRIMARY KEY ( cart_id )
 );

#Table Carts_Items#
 CREATE TABLE intuglo.carts_item (
  `cart_item_id` int(100) NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `transaction_description`  varchar(255),
  `transaction_fee`   decimal(10,2) NOT NULL DEFAULT '0.00',
  `platform_id`	int NOT NULL COMMENT 'PLATFORM NAME',
  `status` 		varchar(25) COMMENT 'UNPAID, PAID, DELETE',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
  `modified_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
  CONSTRAINT pk_carts_items  PRIMARY KEY (`cart_item_id`)
);

#Table temp_orders #

CREATE TABLE intuglo.ship_temp_orders ( 
  `temp_order_id` varchar(30) NOT NULL,
  `cart_id` int NOT NULL,
  `booking_date` date DEFAULT NULL COMMENT 'the date which the order is placed',
  `confirmation_date` date NOT NULL COMMENT 'the date which the booking is confirmed',
  `weight` int(11) DEFAULT '0' COMMENT 'the estimated weight of cargo in KG',
  `cbm` int(11) DEFAULT '0' COMMENT 'the estimated size of cargo in cubic meter',
  `booking_price_a` decimal(10,2) DEFAULT '0.00',
  `booking_price_ba` decimal(10,2) DEFAULT '0.00',
  `booking_price_bd` decimal(10,2) DEFAULT '0.00',
  `booking_price_tax` decimal(10,2) DEFAULT '0.00',
  `booking_price_tax_type` VARCHAR(10) NULL DEFAULT NULL,
  `booking_price_tax_amount` DECIMAL(10,2) NULL DEFAULT '0.00',
  `booking_price_total` decimal(10,2) DEFAULT '0.00',
  `booking_price_total_wo_tax` DECIMAL(10,2) DEFAULT '0.00',
  `closing_price_a` decimal(10,2) DEFAULT '0.00',
  `closing_price_ba` decimal(10,2) DEFAULT '0.00',
  `closing_price_bd` decimal(10,2) DEFAULT '0.00',
  `closing_price_tax` decimal(10,2) DEFAULT '0.00',
  `closing_price_total` decimal(10,2) DEFAULT '0.00',
  `closing_price_tax_amount` DECIMAL(10,2) NULL DEFAULT '0.00',
  `closing_price_tax_type` VARCHAR(10) NULL DEFAULT NULL,
  `closing_price_total_wo_tax` DECIMAL(10,2) DEFAULT '0.00',
  `cargo_status_code` varchar(30) NOT NULL,
  `payment_status_code` varchar(30) DEFAULT NULL,
  `custom_status_code` varchar(30) DEFAULT NULL,
  `booking_fee_payment_status` varchar(25) DEFAULT NULL COMMENT 'UNPAID, PAID, DELETE',
  `transaction_fee` int(11) DEFAULT NULL,
  `transaction_description` varchar(255) DEFAULT NULL,
  `booking_fee_tax_rate` int(10) DEFAULT NULL,
  `booking_fee_tax_type` varchar(10) DEFAULT NULL,
  `hs_code_id` varchar(11) DEFAULT NULL COMMENT 'the hs_code of order',
  `login_id` int(11) NOT NULL COMMENT 'the login_id of the customer who the order belongs to',
  `tc_id` int(11) DEFAULT NULL COMMENT 'terms and conditions id which the customer agreed while create order',
  `quotation_id` varchar(100) DEFAULT NULL COMMENT 'the quotation_id of shippment which will handle this order',
  `consignor_company_name` varchar(255) DEFAULT NULL COMMENT 'customer''s company name',
  `consignor_contact_person` varchar(255) DEFAULT NULL COMMENT 'name of contact person',
  `consignor_contact_number` varchar(50) DEFAULT NULL COMMENT 'customer''s contact number',
  `consignor_email` varchar(50) DEFAULT NULL COMMENT 'customer''s email',
  `consignor_delivery_address` varchar(255) DEFAULT NULL COMMENT 'the address of place which the cargo is ship to',
  `consignee_company_name` varchar(255) DEFAULT NULL COMMENT 'customer''s company name',
  `consignee_contact_person` varchar(255) DEFAULT NULL COMMENT 'name of contact person',
  `consignee_contact_number` varchar(50) DEFAULT NULL COMMENT 'customer''s contact number',
  `consignee_email` varchar(50) DEFAULT NULL COMMENT 'customer''s email',
  `consignee_delivery_address` varchar(255) DEFAULT NULL COMMENT 'the address of place which the cargo is ship to',
  `four_digit_hs_code` varchar(4) DEFAULT NULL COMMENT 'the second section of hs code which has four digits',
  `cargo_description` varchar(255) DEFAULT NULL COMMENT 'description about cargo',
  `consignor_merchandise_value` int(11) DEFAULT NULL COMMENT 'value of shipped goods',
  `consignee_merchandise_value` int(11) DEFAULT NULL COMMENT 'value of shipped goods',
  `quantity` int(11) DEFAULT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `consignor_commercial_value` int(11) DEFAULT NULL,
  `consignee_commercial_value` int(11) DEFAULT NULL,
  `consignor_billing_address` varchar(250) DEFAULT NULL,
  `consignee_billing_address` varchar(250) DEFAULT NULL,
  `logistic_provider` varchar(100) DEFAULT NULL,
  `bill_of_loading` varchar(250) DEFAULT NULL,
  `packing_details` varchar(250) DEFAULT NULL,
  `consignor_shipper` varchar(100) DEFAULT NULL,
  `consignee_shipper` varchar(100) DEFAULT NULL,
  `custom_agent_id` int(11) DEFAULT NULL,
  `button_code` int(11) DEFAULT NULL,
  `order_pdf_url` varchar(255) DEFAULT NULL COMMENT 'stores the location of generated receipt',
  `container_id` varchar(40) DEFAULT NULL COMMENT 'stores the container id which the order is placed in',
  `halal_status` char(1) DEFAULT NULL COMMENT 'specifies wether the order contains halal or non-halal:\nH: halal\nN: non-halal',
  `duties_and_tax` decimal(10,2) DEFAULT '0.00',
  `credit_block` decimal(10,2) DEFAULT '0.00',
  `container_by_depot` varchar(50) DEFAULT NULL,
  `booking_price_blocked` varchar(50) DEFAULT NULL,
  `final_price_payment` varchar(50) DEFAULT NULL,
  `balance_released` varchar(50) DEFAULT NULL,
  `booking_received_notification` varchar(50) DEFAULT NULL,
  `cargo_movement_changes` varchar(50) DEFAULT NULL,
  `notify_block_credit` varchar(50) DEFAULT NULL,
  `inform_final_payment` varchar(50) DEFAULT NULL,
  `notify_cargo_clearing` varchar(50) DEFAULT NULL,
  `notify_pay_up` varchar(50) DEFAULT NULL,
  `notify_order_completed` varchar(50) DEFAULT NULL,
  `buyer_documentation` varchar(50) DEFAULT NULL,
  `custom_declaration_form` varchar(50) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `cart_item_id` int(11) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
  `modified_by` int(11) DEFAULT NULL,
  `modified_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'stores the datetime when data is created',
  CONSTRAINT pk_temp_orders PRIMARY KEY ( temp_order_id )
 );


# Table Admin Profile 
CREATE TABLE intuglo.admin_profile ( 
	admin_id          int NOT NULL AUTO_INCREMENT,
	login_id          int  NOT NULL  ,
	admin_name        varchar(255)  NOT NULL  COMMENT 'stores the admin name',
    logo              varchar(30) DEFAULT 'admindefault.jpg',
	CONSTRAINT pk_admin_profile PRIMARY KEY ( admin_id )
 );
 
#-----------------------FOREIGN KEYS----------------------------#

ALTER TABLE intuglo.ship_container_types_size ADD CONSTRAINT fk_container_type_1 FOREIGN KEY ( container_type_id ) REFERENCES intuglo.ship_container_types( container_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_containers ADD CONSTRAINT fk_containers FOREIGN KEY ( quotation_id ) REFERENCES intuglo.ship_quotations( quotation_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_containers ADD CONSTRAINT fk_containers_0 FOREIGN KEY ( hs_set_id ) REFERENCES intuglo.hs_code_set( hs_code_set ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.customers ADD CONSTRAINT fk_users_1 FOREIGN KEY ( business_id ) REFERENCES intuglo.businesses( business_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.customers ADD CONSTRAINT fk_users_0 FOREIGN KEY ( country_code ) REFERENCES intuglo.countries( country_code ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.customers ADD CONSTRAINT fk_users FOREIGN KEY ( login_id ) REFERENCES intuglo.logins( login_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.customers ADD CONSTRAINT fk_customers FOREIGN KEY ( tc_id ) REFERENCES intuglo.terms_conditions( tc_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.customers ADD CONSTRAINT fk_customers_1 FOREIGN KEY ( cart_id ) REFERENCES intuglo.carts( cart_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_orders ADD CONSTRAINT fk_orders_3 FOREIGN KEY ( container_id ) REFERENCES intuglo.ship_containers( container_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

#ALTER TABLE intuglo.ship_orders ADD CONSTRAINT fk_orders_0 FOREIGN KEY ( hs_code_id ) REFERENCES intuglo.hs_code( hs_code_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;#

ALTER TABLE intuglo.ship_orders ADD CONSTRAINT fk_orders_1 FOREIGN KEY ( login_id ) REFERENCES intuglo.logins( login_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_orders ADD CONSTRAINT fk_orders FOREIGN KEY ( cargo_status_code ) REFERENCES intuglo.ship_cargo_status( cargo_status_code ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_orders ADD CONSTRAINT fk_orders_2 FOREIGN KEY ( quotation_id ) REFERENCES intuglo.ship_quotations( quotation_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_orders ADD CONSTRAINT fk_orders_4 FOREIGN KEY ( tc_id ) REFERENCES intuglo.terms_conditions( tc_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- #ALTER TABLE intuglo.ship_orders ADD CONSTRAINT fk_orders_5 FOREIGN KEY ( container_id ) REFERENCES intuglo.ship_containers( container_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;#

ALTER TABLE intuglo.ship_packing_list ADD CONSTRAINT fk_packing_list FOREIGN KEY ( order_id ) REFERENCES intuglo.ship_orders( order_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_quotation_handling_charges ADD CONSTRAINT fk_quotation_handling_charges FOREIGN KEY ( quotation_id ) REFERENCES intuglo.ship_quotations( quotation_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_quotation_handling_charges ADD CONSTRAINT fk_quotation_handling_charges_1 FOREIGN KEY ( unit_of_measure_id ) REFERENCES intuglo.ship_unit_of_measure( unit_of_measure_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

#ALTER TABLE intuglo.ship_quotations ADD CONSTRAINT fk_quotations_5 FOREIGN KEY ( hs_code_id ) REFERENCES intuglo.hs_code( hs_code_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_quotations ADD CONSTRAINT fk_quotations_4 FOREIGN KEY ( quotation_status ) REFERENCES intuglo.ship_quotation_status( quotation_status_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_quotations ADD CONSTRAINT fk_quotations_3 FOREIGN KEY ( incoterm_code ) REFERENCES intuglo.ship_incoterms( incoterm_code ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_quotations ADD CONSTRAINT fk_quotations_0 FOREIGN KEY ( supplier_login_id ) REFERENCES intuglo.logins( login_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_quotations ADD CONSTRAINT fk_quotations_1 FOREIGN KEY ( port_id_from ) REFERENCES intuglo.ports( port_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_quotations ADD CONSTRAINT fk_quotations_2 FOREIGN KEY ( port_id_to ) REFERENCES intuglo.ports( port_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_quotations ADD CONSTRAINT fk_quotations FOREIGN KEY ( shipment_type_id ) REFERENCES intuglo.ship_shipment_types( shipment_type_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_quotations ADD CONSTRAINT fk_quotations_8 FOREIGN KEY ( container_types ) REFERENCES intuglo.ship_container_types_size( container_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.logistic_providers ADD CONSTRAINT fk_suppliers FOREIGN KEY ( login_id ) REFERENCES intuglo.logins( login_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.logistic_providers ADD CONSTRAINT fk_suppliers_0 FOREIGN KEY ( tc_id ) REFERENCES intuglo.terms_conditions( tc_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.logistic_providers ADD CONSTRAINT fk_suppliers_1 FOREIGN KEY ( business_id ) REFERENCES intuglo.businesses( business_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.logistic_providers ADD CONSTRAINT fk_suppliers_2 FOREIGN KEY ( country_code ) REFERENCES intuglo.countries( country_code ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.terms_conditions ADD CONSTRAINT fk_terms_conditions FOREIGN KEY ( created_by ) REFERENCES intuglo.logins( login_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.user_platforms ADD CONSTRAINT fk_user_platforms FOREIGN KEY ( login_id ) REFERENCES intuglo.logins( login_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.user_platforms ADD CONSTRAINT fk_user_platforms_0 FOREIGN KEY ( platform_id ) REFERENCES intuglo.platforms( platform_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.carts ADD CONSTRAINT fk_carts FOREIGN KEY ( login_id ) REFERENCES intuglo.logins( login_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.hs_set ADD CONSTRAINT fk_hs_code_set FOREIGN KEY ( hs_code_set ) REFERENCES intuglo.hs_code_set( hs_code_set ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_custom_documents ADD CONSTRAINT fk_custom_documents FOREIGN KEY ( order_id ) REFERENCES intuglo.ship_orders( order_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_custom_agent_documents ADD CONSTRAINT fk_custom_agent_documents FOREIGN KEY ( order_id ) REFERENCES intuglo.ship_orders( order_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.custom_agent ADD CONSTRAINT fk_custom_agent FOREIGN KEY ( login_id ) REFERENCES intuglo.logins( login_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.routes ADD CONSTRAINT fk_routes_0 FOREIGN KEY ( port_id_from ) REFERENCES intuglo.ports( port_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.routes ADD CONSTRAINT fk_routes_1 FOREIGN KEY ( port_id_to ) REFERENCES intuglo.ports( port_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.vessel ADD CONSTRAINT fk_vessel_0 FOREIGN KEY ( route_id ) REFERENCES intuglo.routes( route_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_quotations ADD CONSTRAINT fk_quotations_6 FOREIGN KEY ( vessel_id ) REFERENCES intuglo.vessel( vessel_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_quotations ADD CONSTRAINT fk_quotations_7 FOREIGN KEY ( custom_agent_id ) REFERENCES intuglo.custom_agent( custom_agent_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_cargo_status_tracking ADD CONSTRAINT fk_cargo_status FOREIGN KEY ( order_id ) REFERENCES intuglo.ship_orders( order_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_cargo_status_tracking ADD CONSTRAINT fk_cargo_status_0 FOREIGN KEY ( payment_status_code ) REFERENCES intuglo.ship_payment_status( payment_status_code ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_cargo_status_tracking ADD CONSTRAINT fk_cargo_status_1 FOREIGN KEY ( cargo_status_code ) REFERENCES intuglo.ship_cargo_status( cargo_status_code ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_cargo_status_tracking ADD CONSTRAINT fk_cargo_status_2 FOREIGN KEY ( custom_status_code ) REFERENCES intuglo.ship_custom_status( custom_status_code ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.profile_documents ADD CONSTRAINT fk_profile_documents FOREIGN KEY ( login_id ) REFERENCES intuglo.logins( login_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_orders ADD CONSTRAINT fk_orders_6 FOREIGN KEY ( custom_agent_id ) REFERENCES intuglo.custom_agent( custom_agent_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_quotation_sea_freight_charges ADD CONSTRAINT fk_quotation_sea_freight_charges FOREIGN KEY ( quotation_id ) REFERENCES intuglo.ship_quotations( quotation_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_orders ADD CONSTRAINT fk_orders_7 FOREIGN KEY ( booking_payment_id ) REFERENCES intuglo.payments( payment_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_orders ADD CONSTRAINT fk_orders_8 FOREIGN KEY ( creditblock_payment_id ) REFERENCES intuglo.payments( payment_id ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.carts_item ADD CONSTRAINT `fk_carts_item2` FOREIGN KEY (`platform_id`) REFERENCES intuglo.`platforms` (`platform_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.carts_item ADD CONSTRAINT `fk_carts_item3` FOREIGN KEY (`cart_id`) REFERENCES intuglo.`carts` (`cart_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_temp_orders ADD CONSTRAINT `fk_ship_item1` FOREIGN KEY (`cargo_status_code`) REFERENCES intuglo.`ship_cargo_status` (`cargo_status_code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_temp_orders ADD CONSTRAINT `fk_ship_item5` FOREIGN KEY (`login_id`) REFERENCES intuglo.`logins` (`login_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_temp_orders ADD CONSTRAINT `fk_ship_item6` FOREIGN KEY (`quotation_id`) REFERENCES intuglo.`ship_quotations` (`quotation_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_temp_orders ADD CONSTRAINT `fk_ship_item7` FOREIGN KEY (`container_id`) REFERENCES intuglo.`ship_containers` (`container_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_temp_orders ADD CONSTRAINT `fk_ship_item8` FOREIGN KEY (`tc_id`) REFERENCES intuglo.`terms_conditions` (`tc_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_temp_orders ADD CONSTRAINT `fk_ship_item4` FOREIGN KEY (`cart_id`) REFERENCES intuglo.`carts` (`cart_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_temp_orders ADD CONSTRAINT `fk_ship_item2` FOREIGN KEY (`custom_agent_id`) REFERENCES intuglo.`custom_agent` (`custom_agent_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_temp_orders ADD  CONSTRAINT `fk_ship_item3` FOREIGN KEY (`cart_item_id`) REFERENCES `carts_item` (`cart_item_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.admin_profile ADD CONSTRAINT `fk_admin_p1` FOREIGN KEY ( `login_id` ) REFERENCES intuglo.`logins`( `login_id` ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.ship_orders ADD CONSTRAINT fk_orders_10 FOREIGN KEY ( payment_status_code ) REFERENCES intuglo.ship_payment_status( payment_status_code ) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE intuglo.payments ADD CONSTRAINT fk_payments_p1 FOREIGN KEY (payment_types) REFERENCES intuglo.payment_types(payment_type) ON DELETE NO ACTION ON UPDATE NO ACTION;


#-----------------------INDEXES-----------------------------#
CREATE INDEX idx_container_size_1 ON intuglo.ship_container_types_size (container_id);

CREATE INDEX idx_terms_conditions ON intuglo.terms_conditions ( created_by );

CREATE INDEX idx_container_types ON intuglo.ship_container_types (container_id);

CREATE INDEX idx_user_platforms ON intuglo.user_platforms ( login_id );

CREATE INDEX idx_user_platforms_0 ON intuglo.user_platforms ( platform_id );

CREATE INDEX idx_businesses ON intuglo.businesses ( industry_id );

CREATE INDEX idx_users_0 ON intuglo.customers ( country_code );

CREATE INDEX idx_users ON intuglo.customers ( login_id );

CREATE INDEX idx_users_1 ON intuglo.customers ( business_id );

CREATE INDEX idx_customers ON intuglo.customers ( tc_id );

CREATE INDEX idx_customers_1 ON intuglo.customers ( cart_id );

CREATE INDEX idx_ship_quotations ON intuglo.ship_quotations ( shipment_type_id );

CREATE INDEX idx_ship_quotations_0 ON intuglo.ship_quotations ( supplier_login_id );

CREATE INDEX idx_ship_quotations_1 ON intuglo.ship_quotations ( port_id_from );

CREATE INDEX idx_ship_quotations_2 ON intuglo.ship_quotations ( port_id_to );

CREATE INDEX idx_ship_quotations_3 ON intuglo.ship_quotations ( incoterm_code );

CREATE INDEX idx_logistic_providers ON intuglo.logistic_providers ( login_id );

CREATE INDEX idx_logistic_providers_0 ON intuglo.logistic_providers ( tc_id );

CREATE INDEX idx_ship_containers ON intuglo.ship_containers ( quotation_id );

CREATE INDEX idx_ship_orders ON intuglo.ship_orders ( order_id );

#CREATE INDEX idx_ship_orders_0 ON intuglo.ship_orders ( hs_code_id );

CREATE INDEX idx_ship_orders_1 ON intuglo.ship_orders ( login_id );

CREATE INDEX idx_ship_orders_2 ON intuglo.ship_orders ( quotation_id );

CREATE INDEX idx_ship_orders_3 ON intuglo.ship_orders ( container_id );

CREATE INDEX idx_ship_orders_4 ON intuglo.ship_orders ( tc_id );

CREATE INDEX idx_ship_packing_list ON intuglo.ship_packing_list ( order_id );

CREATE INDEX idx_ship_quotation_handling_charges ON intuglo.ship_quotation_handling_charges ( quotation_id );

CREATE INDEX idx_custom_agent ON intuglo.custom_agent ( custom_agent_id );

CREATE INDEX idx_routes ON intuglo.routes ( route_id );

CREATE INDEX idx_vessel ON intuglo.vessel ( vessel_id );

CREATE INDEX idx_payments_id_1 ON intuglo.payments (payment_id);

#CREATE INDEX idx_user_type_5 ON intuglo.user_types(user_type_id);#

CREATE INDEX `idx_carts_item1` ON intuglo.carts_item (`cart_item_id`);

CREATE INDEX `idx_ship_item1` ON intuglo.ship_temp_orders (`cargo_status_code`);

CREATE INDEX `idx_ship_item2` ON intuglo.ship_temp_orders (`custom_agent_id`);

-- CREATE INDEX `idx_ship_item3` ON intuglo.ship_temp_orders (`cart_id`);

CREATE INDEX `idx_ship_item5` ON intuglo.ship_temp_orders (`login_id`);

CREATE INDEX `idx_ship_item6` ON intuglo.ship_temp_orders (`quotation_id`);

CREATE INDEX `idx_ship_item7` ON intuglo.ship_temp_orders (`container_id`);

CREATE INDEX `idx_ship_item8` ON intuglo.ship_temp_orders (`tc_id`);

CREATE INDEX `idx_admin_profile` ON intuglo.admin_profile ( `login_id` );

CREATE INDEX `idx_admin_profile_1` ON intuglo.admin_profile ( `admin_id` );

CREATE INDEX idx_ports_1 ON intuglo.ports ( port_id );

CREATE INDEX idx_carts_1 ON intuglo.carts (cart_id);

CREATE INDEX idx_login_1 ON intuglo.logins (login_id);

-- CREATE INDEX idx_login_2 ON intuglo.logins (cart_id);

#-----------------------------VIEWS----------------------------------#
use intuglo;

CREATE VIEW intuglo.ship_customers_orders AS 
select `intuglo`.`logins`.`login_id` AS `login_id`,
`intuglo`.`ship_orders`.`order_id` AS `order_id`,
`intuglo`.`ship_quotations`.`quotation_id` AS `quotation_id`,`dep`.`country_code` AS `departure_country`,
`arv`.`country_code` AS `arrival_country` 
from ((((`intuglo`.`logins` 
join `intuglo`.`ship_orders` on((`intuglo`.`logins`.`login_id` = `intuglo`.`ship_orders`.`login_id`))) 
join `intuglo`.`ship_quotations` on((`intuglo`.`ship_orders`.`quotation_id` = `intuglo`.`ship_quotations`.`quotation_id`))) 
join `intuglo`.`ports` `dep` on((`intuglo`.`ship_quotations`.`port_id_from` = `dep`.`port_id`))) 
join `intuglo`.`ports` `arv` on((`intuglo`.`ship_quotations`.`port_id_to` = `arv`.`port_id`)));

-- CREATE VIEW ship_logistic_providers_quotation_list_view AS
-- select q.supplier_login_id, q.quotation_id, q.quote_ref_no as quotationRef, q.part_a, 
-- q.part_b, i.incoterm_code, qs.quotation_status_description as quotationStatus, concat(f.port_name, ' - ',
-- t.port_name) as portName, q.shipper_type, q.shipment_type_id as freight, q.departure_date, v.vessel_no, v.vessel_id,
-- CONCAT(f.country_code, '-', t.country_code) as country
-- from ship_quotations q join ship_incoterms i on q.incoterm_code = i.incoterm_code
-- left join ports f on q.port_id_from = f.port_id
-- left join ports t on q.port_id_to = t.port_id
-- left join ship_quotation_status qs on q.quotation_status = qs.quotation_status_id
-- left join vessel v on q.vessel_id = v.vessel_id
-- left join logistic_providers s on q.supplier_login_id = s.login_id;

CREATE VIEW `ship_logistic_providers_quotation_list_view` AS
   SELECT
       `q`.`supplier_login_id` AS `supplier_login_id`,
       `q`.`quotation_id` AS `quotation_id`,
       `q`.`quote_ref_no` AS `quotationRef`,
       `q`.`part_a` AS `part_a`,
       `q`.`part_b` AS `part_b`,
       `i`.`incoterm_code` AS `incoterm_code`,
       `qs`.`quotation_status_description` AS `quotationStatus`,
       CONCAT(`f`.`port_name`, ' - ', `t`.`port_name`) AS `portName`,
       `q`.`shipper_type` AS `shipper_type`,
       `q`.`shipment_type_id` AS `freight`,
       `q`.`departure_date` AS `departure_date`,
       `v`.`vessel_no` AS `vessel_no`,
       `v`.`vessel_id` AS `vessel_id`,
       `v`.`route_id` AS `route_id`,
       `v`.`vessel_name` AS `vessel_name`,
       CONCAT(`f`.`country_code`,
               '-',
               `t`.`country_code`) AS `country`,
       `c1`.`country_name` AS `country_name_departure`,
       `c2`.`country_name` AS `country_name_arrival`
   FROM
       `ship_quotations` `q`
       JOIN `ship_incoterms` `i` ON `q`.`incoterm_code` = `i`.`incoterm_code`
       JOIN `ports` `f` ON `q`.`port_id_from` = `f`.`port_id`
       JOIN `ports` `t` ON `q`.`port_id_to` = `t`.`port_id`
       JOIN `ship_quotation_status` `qs` ON `q`.`quotation_status` = `qs`.`quotation_status_id`
       JOIN `vessel` `v` ON `q`.`vessel_id` = `v`.`vessel_id`
       JOIN `logistic_providers` `s` ON `q`.`supplier_login_id` = `s`.`login_id`
       JOIN `countries` `c1` ON `c1`.`country_code` = `f`.`country_code`
       JOIN `countries` `c2` ON `c2`.`country_code` = `t`.`country_code`;

CREATE VIEW `route_vessel_view` AS
SELECT 
        `vessel`.`vessel_id` AS `vessel_id`,
        `vessel`.`vessel_no` AS `vessel_no`,
        `vessel`.`eta` AS `eta`,
        `vessel`.`etd` AS `etd`,
        `vessel`.`vessel_name` AS `vessel_name`,
        `routes`.`route_id` AS `route_id`,
        `routes`.`port_id_to` AS `port_id_arrival`,
        `routes`.`port_id_from` AS `port_id_departure`,
        `dep`.`port_name` AS `port_name_departure`,
        `arv`.`port_name` AS `port_name_arrival`,
        `dep`.`country_code` AS `country_code_departure`,
        `arv`.`country_code` AS `country_code_arrival`,
        `ctd`.`country_name` AS `country_code_dep_name`,
        `cta`.`country_name` AS `country_code_arvl_name`
    FROM`vessel`
        LEFT JOIN `routes` ON `routes`.`route_id` = `vessel`.`route_id`
        LEFT JOIN `ports` `dep` ON `routes`.`port_id_from` = `dep`.`port_id`
        LEFT JOIN `ports` `arv` ON `routes`.`port_id_to` = `arv`.`port_id`
        LEFT JOIN `countries` `ctd` ON `ctd`.`country_code` = `dep`.`country_code`
        LEFT JOIN `countries` `cta` ON `cta`.`country_code` = `arv`.`country_code`;

CREATE VIEW `ship_customer_booking_list_view` AS
    SELECT 
        `o`.`login_id` AS `login_id`,
        `o`.`order_id` AS `order_id`,
        `o`.`quotation_id` AS `quotation_id`,
        `o`.`booking_price_total` AS `booking_price_total`,
        `o`.`closing_price_total` AS `closing_price_total`,
        `c`.`container_no` AS `container_no`,
        `o`.`tracking_number` AS `tracking_number`,
        `o`.`consignor_shipper` AS `consignor_shipper`,
        CONCAT(`rv`.`country_code_departure`,
                '-',
                `rv`.`country_code_arrival`) AS `country`,
        `q`.`vessel` AS `vessel`,
        `rv`.`port_name_departure` AS `portFrom`,
        `rv`.`port_name_arrival` AS `portTo`,
        `cs`.`cargo_status_description` AS `cargo_status_description`,
        `rv`.`eta` AS `eta`,
        `rv`.`etd` AS `etd`,
        `o`.`button_code` AS `button_code`,
        `cs`.`cargo_status_code` AS `cargo_status_code`,
        `q`.`incoterm_code` AS `incoterm_code`,
        `lo`.`company_name` AS `company_name`
    FROM
        `ship_orders` `o`
        LEFT JOIN `ship_quotations` `q` ON `o`.`quotation_id` = `q`.`quotation_id`
        LEFT JOIN `ship_containers` `c` ON `o`.`container_id` = `c`.`container_id`
        LEFT JOIN `route_vessel_view` `rv` ON `rv`.`vessel_id` = `q`.`vessel_id`
        LEFT JOIN `ship_cargo_status` `cs` ON `o`.`cargo_status_code` = `cs`.`cargo_status_code`
        LEFT JOIN `customers` ON `o`.`login_id` = `customers`.`login_id`
        LEFT JOIN `logistic_providers` `lo` ON `q`.`supplier_login_id` = `lo`.`login_id`;

CREATE VIEW `ship_logistic_providers_order_list_view` AS
    SELECT 
        `o`.`consignor_company_name` AS `consignor_company_name`,
        `o`.`consignor_email` AS `consignor_email`,
        `o`.`booking_date` AS `booking_date`,
        `o`.`confirmation_date` AS `confirmation_date`,
        `o`.`order_id` AS `order_id`,
        `c`.`container_no` AS `container_no`,
        `f`.`port_name` AS `portFrom`,
        `t`.`port_name` AS `portTo`,
        `o`.`hs_code_id` AS `hs_code`,
        `q`.`supplier_login_id` AS `supplier_login_id`,
        `q`.`arrival_date` AS `eta`,
        `q`.`departure_date` AS `etd`,
        CONCAT(`f`.`country_code`,
                '-',
                `t`.`country_code`) AS `country`,
        `q`.`quotation_id` AS `quotation_id`,
        `q`.`vessel` AS `vessel`,
        `o`.`tracking_number` AS `tracking_number`,
        `o`.`weight` AS `weight`,
        `o`.`cbm` AS `cbm`,
        `o`.`consignor_merchandise_value` AS `merchant_value`,
        `o`.`consignor_commercial_value` AS `commercial_value`,
        `cs`.`cargo_status_description` AS `cargo_status_description`,
        `ps`.`payment_status_description` AS `payment_status_description`,
        `csa`.`custom_status_description` AS `custom_status_description`,
        `o`.`button_code` AS `button_code`,
        `c`.`container_id` AS `container_id`,
        `o`.`cargo_status_code` AS `cargo_status_code`,
        `o`.`payment_status_code` AS `payment_status_code`,
        `o`.`custom_status_code` AS `custom_status_code`,
        `v`.`vessel_no` AS `vessel_no`,
        `v`.`vessel_id` AS `vessel_id`,
        `c1`.`country_name` AS `country_name_departure`,
        `c2`.`country_name` AS `country_name_arrival`
    FROM
        `ship_orders` `o`
        LEFT JOIN `ship_quotations` `q` ON `o`.`quotation_id` = `q`.`quotation_id`
        LEFT JOIN `ports` `f` ON `q`.`port_id_from` = `f`.`port_id`
        LEFT JOIN `ports` `t` ON `q`.`port_id_to` = `t`.`port_id`
        LEFT JOIN `ship_containers` `c` ON `o`.`container_id` = `c`.`container_id`
        LEFT JOIN `vessel` `v` ON `q`.`vessel_id` = `v`.`vessel_id`
        LEFT JOIN `ship_cargo_status` `cs` ON `o`.`cargo_status_code` = `cs`.`cargo_status_code`
        LEFT JOIN `ship_payment_status` `ps` ON `o`.`payment_status_code` = `ps`.`payment_status_code`
        LEFT JOIN `ship_custom_status` `csa` ON `o`.`custom_status_code` = `csa`.`custom_status_code`
        LEFT JOIN `logistic_providers` `s` ON `q`.`supplier_login_id` = `s`.`login_id`
        LEFT JOIN `countries` `c1` ON `c1`.`country_code` = `f`.`country_code`
        LEFT JOIN `countries` `c2` ON `c2`.`country_code` = `t`.`country_code`
    WHERE
        (`o`.`cargo_status_code` <> 'ORDERBOOKED');

CREATE VIEW ship_logistic_providers_profile AS
select logistic_providers.login_id, logistic_providers.supplier_name,logistic_providers.company_name,logistic_providers.company_registration_no,logistic_providers.mobile_no,
logistic_providers.address_line_one,logistic_providers.address_line_two,logistic_providers.official_email,logistic_providers.website,logistic_providers.office_phone,logistic_providers.office_fax,
logistic_providers.association_club,logistic_providers.nature_of_business,logistic_providers.import_export_license,logistic_providers.business_license,businesses.business_name,
industries.industry_name,
logistic_providers.business_category,logistic_providers.timezone
from logistic_providers 
left join businesses on logistic_providers.business_id = businesses.business_id
left join industries on businesses.industry_id = industries.industry_id;

CREATE VIEW ship_logistic_providers_quotations_for_booking AS
select quotation_id,departure_date,arrival_date,rv.port_name_departure as portFrom, rv.port_name_arrival as portTo,
halal_consolidation, halal_unstuffing, unstuffing, consolidation,rv.vessel_no,rv.vessel_name,custom_agent.custom_agent_id, custom_agent.agent_name as custom_broker,CONCAT(hs_code_header,'.',hs_code_sub) as hs_code,
logistic_providers.company_name
from ship_quotations
left join route_vessel_view rv on rv.vessel_id = ship_quotations.vessel_id
left join hs_code on ship_quotations.hs_code_id = hs_code.hs_code_id
left join custom_agent on ship_quotations.custom_agent_id = custom_agent.custom_agent_id
left join logistic_providers on ship_quotations.supplier_login_id = logistic_providers.login_id;

CREATE VIEW hs_code_view AS
select hs_code_id, concat(hs_code_header,'.',hs_code_sub) as hs_code
from hs_code;

CREATE VIEW ship_admin_order_list_view AS
select o.order_id, o.booking_date, o.confirmation_date, o.button_code, c.container_id, s.company_name, s.official_email,
q.departure_date, q.arrival_date, f.port_name as portFrom, t.port_name as portTo, CONCAT(h.hs_code_header,'.',h.hs_code_sub) as hs_code, 
o.halal_status, o.packing_details, q.supplier_login_id, CONCAT(f.country_code, '-', t.country_code) as country,
o.weight, o.cbm, o.tracking_number, o.consignor_merchandise_value, o.consignor_commercial_value, o.booking_price_a,
o.booking_price_ba,o.booking_price_bd, o.booking_price_tax, o.booking_price_total, o.closing_price_a, o.closing_price_ba,o.closing_price_bd, o.closing_price_tax,
o.closing_price_total, cs.cargo_status_description, o.duties_and_tax, q.vessel, o.consignor_shipper, o.cargo_status_code,
c.container_no, o.booking_price_blocked, o.final_price_payment, o.balance_released, o.booking_received_notification,
o.cargo_movement_changes, o.notify_block_credit, o.inform_final_payment, o.notify_cargo_clearing, o.notify_pay_up,
o.notify_order_completed, o.buyer_documentation, o.custom_declaration_form, s.supplier_name, q.quotation_id
from ship_orders o
left join ship_quotations q on o.quotation_id = q.quotation_id
left join logistic_providers s on q.supplier_login_id = s.login_id
left join ports f on q.port_id_from = f.port_id
left join ports t on q.port_id_to = t.port_id
left join ship_cargo_status cs on o.cargo_status_code = cs.cargo_status_code
left join ship_containers c on o.container_id = c.container_id
left join hs_code h on o.hs_code_id = h.hs_code_id;


CREATE VIEW `ship_admin_quotation_list_view` AS
    SELECT 
        `q`.`supplier_login_id` AS `supplier_login_id`, `s`.`company_name` AS `supplier_name`,
        `q`.`quotation_id` AS `quotation_id`, `q`.`quote_ref_no` AS `quotationRef`,
        `q`.`part_a` AS `part_a`, `q`.`part_b` AS `part_b`,
        `i`.`incoterm_code` AS `incoterm_code`, `qs`.`quotation_status_description` AS `quotationStatus`,
        CONCAT(`rv`.`port_name_departure`, ' - ', `rv`.`port_name_arrival`) AS `portName`,
        `q`.`shipper_type` AS `shipper_type`, `q`.`shipment_type_id` AS `freight`,
        `q`.`departure_date` AS `departure_date`, `q`.`vessel` AS `vessel`,
        CONCAT(`rv`.`country_code_departure`,'-',`rv`.`country_code_arrival`) AS `country`,
        `q`.`arrival_date` AS `arrival_date`, `c`.`container_no` AS `container_no`,
        `qs`.`quotation_status_id` AS `quotation_status_id`, `rv`.`vessel_id` AS `vessel_id`,
        `rv`.`port_id_departure` AS `port_id_from`, `rv`.`port_id_arrival` AS `port_id_to`,
        `rv`.`eta` AS `eta`, `rv`.`etd` AS `etd`, `rv`.`vessel_no` AS `vessel_no`,
        `rv`.`vessel_name` AS `vessel_name`, `rv`.`route_id` AS `route_id`,
        `rv`.`port_name_departure` AS `port_name_departure`, `rv`.`port_name_arrival` AS 	`port_name_arrival`,
        `rv`.`country_code_departure` AS `country_code_departure`, `rv`.`country_code_arrival` AS `country_code_arrival`,
        `rv`.`country_code_dep_name` AS `country_code_dep_name`, `rv`.`country_code_arvl_name` AS `country_code_arvl_name`,
        q.container_box_count as total_cbm, q.total_people_per_shipment, c.halal_status,
        q.container_box_size as total_weight
    FROM
        `ship_quotations` `q`
        LEFT JOIN `ship_incoterms` `i` ON `q`.`incoterm_code` = `i`.`incoterm_code`
        LEFT JOIN `ship_quotation_status` `qs` ON `q`.`quotation_status` = `qs`.`quotation_status_id`
        LEFT JOIN `ship_containers` `c` ON `q`.`quotation_id` = `c`.`container_id`
        LEFT JOIN `logistic_providers` `s` ON `q`.`supplier_login_id` = `s`.`login_id`
        LEFT JOIN `route_vessel_view` `rv` ON `rv`.`vessel_id` = `q`.`vessel_id`
    WHERE qs.quotation_status_id= 'ACTIVE' or qs.quotation_status_id = 'PENDINGAPPROVAL' or qs.quotation_status_id = 'APPROVED';
	

CREATE VIEW ship_custom_agent_booking_list_view as
select o.login_id, o.order_id, o.custom_agent_id,cus.login_id AS custom_login_id, o.quotation_id, o.booking_price_total, o.closing_price_total,
c.container_no, o.tracking_number, o.consignor_shipper, CONCAT(rv.country_code_departure, '-', rv.country_code_arrival) as country,
q.vessel, rv.port_name_departure as portFrom, rv.port_name_arrival as portTo, cs.custom_status_description, rv.eta as eta,
rv.etd as etd, button_code, cs.custom_status_code
from ship_orders o
left join ship_quotations q on o.quotation_id = q.quotation_id
left join ship_containers c on o.container_id = c.container_id
left join route_vessel_view rv on rv.vessel_id = q.vessel_id
left join ship_custom_status cs on o.custom_status_code = cs.custom_status_code
left join custom_agent cus on o.custom_agent_id = cus.custom_agent_id;


-- CREATE VIEW ship_custom_agent_order_list_view AS
-- select o.order_id, o.booking_date, o.confirmation_date, o.button_code, c.container_id, s.company_name, s.official_email,
-- q.departure_date, q.arrival_date, f.port_name as portFrom, t.port_name as portTo, CONCAT(h.hs_code_header,'.',h.hs_code_sub) as hs_code, 
-- o.halal_status, o.packing_details, q.supplier_login_id, CONCAT(f.country_code, '-', t.country_code) as country,
-- o.weight, o.cbm, o.tracking_number, o.consignor_merchandise_value, o.consignor_commercial_value, o.booking_price_a,
-- o.booking_price_ba,o.booking_price_bd, o.booking_price_gst, o.booking_price_total, o.closing_price_a, o.closing_price_ba,o.closing_price_bd, o.closing_price_gst,
-- o.closing_price_total, cs.custom_status_description, o.duties_and_tax, q.vessel, o.consignor_shipper, o.custom_status_code,
-- c.container_no, o.booking_price_blocked, o.final_price_payment, o.balance_released, o.booking_received_notification,
-- o.cargo_movement_changes, o.notify_block_credit, o.inform_final_payment, o.notify_cargo_clearing, o.notify_pay_up,
-- o.notify_order_completed, o.buyer_documentation, o.custom_declaration_form, s.supplier_name, q.quotation_id
-- from ship_orders o
-- left join ship_quotations q on o.quotation_id = q.quotation_id
-- left join logistic_providers s on q.supplier_login_id = s.login_id
-- left join ports f on q.port_id_from = f.port_id
-- left join ports t on q.port_id_to = t.port_id
-- left join ship_custom_status cs on o.custom_status_code = cs.custom_status_code
-- left join ship_containers c on o.container_id = c.container_id
-- left join hs_code h on o.hs_code_id = h.hs_code_id;

CREATE VIEW `ship_custom_agent_order_list_view` AS
    SELECT 
        `o`.`order_id` AS `order_id`,
        `o`.`booking_date` AS `booking_date`,
        `o`.`confirmation_date` AS `confirmation_date`,
        `o`.`button_code` AS `button_code`,
        `c`.`container_id` AS `container_id`,
        `s`.`company_name` AS `company_name`,
        `s`.`official_email` AS `official_email`,
        `q`.`departure_date` AS `departure_date`,
        `q`.`arrival_date` AS `arrival_date`,
        `f`.`port_name` AS `portFrom`,
        `t`.`port_name` AS `portTo`,
        CONCAT(`h`.`hs_code_header`,
                '.',
                `h`.`hs_code_sub`) AS `hs_code`,
        `o`.`halal_status` AS `halal_status`,
        `o`.`packing_details` AS `packing_details`,
        `q`.`supplier_login_id` AS `supplier_login_id`,
        CONCAT(`f`.`country_code`,
                '-',
                `t`.`country_code`) AS `country`,
        `o`.`weight` AS `weight`,
        `o`.`cbm` AS `cbm`,
        `o`.`tracking_number` AS `tracking_number`,
        `o`.`consignor_merchandise_value` AS `consignor_merchandise_value`,
        `o`.`consignor_commercial_value` AS `consignor_commercial_value`,
        `o`.`booking_price_a` AS `booking_price_a`,
        `o`.`booking_price_ba` AS `booking_price_ba`,
        `o`.`booking_price_bd` AS `booking_price_bd`,
        `o`.`booking_price_tax` AS `booking_price_gst`,
        `o`.`booking_price_total` AS `booking_price_total`,
        `o`.`closing_price_a` AS `closing_price_a`,
        `o`.`closing_price_ba` AS `closing_price_ba`,
        `o`.`closing_price_bd` AS `closing_price_bd`,
        `o`.`closing_price_tax` AS `closing_price_gst`,
        `o`.`closing_price_total` AS `closing_price_total`,
        `cs`.`custom_status_description` AS `custom_status_description`,
        `o`.`duties_and_tax` AS `duties_and_tax`,
        `q`.`vessel` AS `vessel`,
        `o`.`consignor_shipper` AS `consignor_shipper`,
        `o`.`custom_status_code` AS `custom_status_code`,
        `c`.`container_no` AS `container_no`,
        `o`.`booking_price_blocked` AS `booking_price_blocked`,
        `o`.`final_price_payment` AS `final_price_payment`,
        `o`.`balance_released` AS `balance_released`,
        `o`.`booking_received_notification` AS `booking_received_notification`,
        `o`.`cargo_movement_changes` AS `cargo_movement_changes`,
        `o`.`notify_block_credit` AS `notify_block_credit`,
        `o`.`inform_final_payment` AS `inform_final_payment`,
        `o`.`notify_cargo_clearing` AS `notify_cargo_clearing`,
        `o`.`notify_pay_up` AS `notify_pay_up`,
        `o`.`notify_order_completed` AS `notify_order_completed`,
        `o`.`buyer_documentation` AS `buyer_documentation`,
        `o`.`custom_declaration_form` AS `custom_declaration_form`,
        `s`.`supplier_name` AS `supplier_name`,
        `q`.`quotation_id` AS `quotation_id`,
        `o`.`cargo_status_code` AS `cargo_status_code`,
        `o`.`custom_agent_id` AS `custom_agent_id`,
        `o`.`payment_status_code` AS `payment_status_code`
    FROM
        `ship_orders` `o`
        LEFT JOIN `ship_quotations` `q` ON `o`.`quotation_id` = `q`.`quotation_id`
        LEFT JOIN `logistic_providers` `s` ON `q`.`supplier_login_id` = `s`.`login_id`
        LEFT JOIN `ports` `f` ON `q`.`port_id_from` = `f`.`port_id`
        LEFT JOIN `ports` `t` ON `q`.`port_id_to` = `t`.`port_id`
        LEFT JOIN `ship_custom_status` `cs` ON `o`.`custom_status_code` = `cs`.`custom_status_code`
        LEFT JOIN `ship_containers` `c` ON `o`.`container_id` = `c`.`container_id`
        LEFT JOIN `hs_code` `h` ON `o`.`hs_code_id` = `h`.`hs_code_id`;

create view ship_custom_agent_quotation_booking_view as
select o.order_id,o.quotation_id,o.booking_price_a,o.cargo_status_code,o.payment_status_code,
o.login_id,o.custom_agent_id,c.login_id as custom_agent_login_id,q.port_id_from,q.port_id_to,q.vessel,p.country_code_departure,
p.country_code_arrival,p.port_name_departure,p.port_name_arrival, ca.country_name as country_departure , cz.country_name as country_arrival
from ship_orders o
left join ship_quotations q on o.quotation_id = q.quotation_id
left join route_vessel_view p on q.vessel_id = p.vessel_id
left join countries ca on p.country_code_departure = ca.country_code
left join countries cz on p.country_code_arrival = cz.country_code
left join custom_agent c on c.custom_agent_id = o.custom_agent_id;

#------------------------------SEQUENCES-------------------------------------------#

CREATE TABLE `ship_seq_orders` (
  `id_seq_orders` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto increment value order id',
  PRIMARY KEY (`id_seq_orders`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `ship_seq_quotations` (
  `id_seq_quotations` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto increment value quotation id',
  PRIMARY KEY (`id_seq_quotations`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `ship_seq_containers` (
  `id_seq_containers` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto increment value container id',
  PRIMARY KEY (`id_seq_containers`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `seq_merchants` (
  `id_seq_merchants` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto increment value merchant id',
  PRIMARY KEY (`id_seq_merchants`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;