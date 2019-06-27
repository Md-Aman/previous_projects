'''
Name  :  QuotationInit
Usage :  Get Resource for ports, incoterms and hs_code
Description  :  This code gets dictionary data from IntugloApp
and displays by converting dictionary to Json format
'''

import falcon
import json
import IntugloApp
import Lookup
from DatabaseConnection import *
import traceback
import sys

class QuotationInitResource__v1__(object):
    def on_get(self, req, resp):
        try:
            port_list = IntugloApp.GlobalPortList
            shipment_list = IntugloApp.GlobalShipmentTypes
            incoterms_list = IntugloApp.GlobalIncotermList
            container_type = Lookup.Lookup.getContainerTypeSize()
            unit = IntugloApp.GlobalMeasureList
            term = IntugloApp.GlobalTerms
            ports_and_hscode = {'ports': port_list, 'shipments': shipment_list,'incoterms': incoterms_list,
            'containery_type':container_type,'unit': unit,'term':term}
            result_json = json.dumps(ports_and_hscode, sort_keys=True,default=str)
            resp.body = result_json

            resp.status = falcon.HTTP_200
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
