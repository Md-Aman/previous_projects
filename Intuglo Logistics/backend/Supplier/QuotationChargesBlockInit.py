'''
Name  :  QuotationChargesBlockInit
Usage : Get resource to get details of particular quotationID
'''

import falcon
import json
import sys
import traceback
import os
import pymysql
from DatabaseConnection import *
from collections import OrderedDict
from Tools import Tools
import IntugloApp




class QuotationChargesBlockInitResource__v1__(object):
    def on_get(self, req, resp):
        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            unit = IntugloApp.GlobalMeasureList
            unit = {'unit': unit}
            result_json = json.dumps(unit, sort_keys=True)
            resp.body = (result_json)

            resp.status = falcon.HTTP_200
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
