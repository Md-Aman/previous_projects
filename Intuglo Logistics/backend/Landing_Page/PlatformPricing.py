'''
Name  :  LandingPagePricing
Description  :  Gets details for landing page.
'''

import traceback
import sys
import falcon
import json
import pymysql
from DatabaseConnection import *

class Platform_Pricing__v1__(object):
    def on_get(self, req, resp):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            final_value = {}
            cursor.execute("select config_value from config where config_key = 'logistic-booking-fee'")
            row = cursor.fetchone()
            final_value['logistics_booking_fee'] = row['config_value']
            cursor.execute("select config_value from config where config_key = 'warehouse-booking-fee'")
            row = cursor.fetchone()
            final_value['warehouse_booking_fee'] = row['config_value']
            resp.status = falcon.HTTP_200
            result_json = json.dumps(final_value, sort_keys=True)
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