'''
Name  :  SearchQuotationInit
Usage :  Get Resource for ports and hs_code
Description  :  This code gets dictionary data from IntugloApp
and displays by converting dictionary to Json format
'''

import falcon
import json
import IntugloApp


class SearchQuotationInitResource__v1__(object):
    def on_get(self, req, resp):
        try:
            port_list = IntugloApp.GlobalPortList
            hs_code_list = IntugloApp.GlobalHSCode
            shipment_list = IntugloApp.GlobalShipmentTypes
            incoterms_list = IntugloApp.GlobalIncotermList
            ports_and_hscode = {'ports': port_list, 'hs_codes': hs_code_list, 'shipments': shipment_list, 'incoterms': incoterms_list}
            result_json = json.dumps(ports_and_hscode, sort_keys=True)
            resp.body = (result_json)

            resp.status = falcon.HTTP_200
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
