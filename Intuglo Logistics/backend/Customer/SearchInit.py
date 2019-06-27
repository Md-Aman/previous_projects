'''
Name  :  SearchInit
Usage :  Get Resource for ports and hs_code
Description  :  This code gets dictionary data from IntugloApp
and displays by converting dictionary to Json format
'''

import falcon
import json
import IntugloApp


class SearchInitResource__v1__(object):
    def on_get(self, req, resp):
        try:
            port_list = IntugloApp.GlobalPortList
            hs_code_list = IntugloApp.GlobalHSCode
            container_type_list = IntugloApp.GlobalContainerTypes
            list_data = {'container_types': container_type_list, 'ports': port_list, 'hs_codes': hs_code_list}
            result_json = json.dumps(list_data, sort_keys=True)
            resp.body = (result_json)

            resp.status = falcon.HTTP_200
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
