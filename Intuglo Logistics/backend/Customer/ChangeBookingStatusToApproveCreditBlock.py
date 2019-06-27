
import traceback
import sys
import falcon
import json
from memcacheResource import MemcacheFunctions
from collections import OrderedDict
from Tools import Tools


class ChangeBookingStatusToApproveCreditBlock__v1__(object):
    def on_patch(self, req, resp, login_id, session):
        # Authenticate login id and session availability.
        try:
            if (MemcacheFunctions.IsSessionValid(login_id,session) == False):
                resp.status = falcon.HTTP_401
                message = {"status": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(message)
                resp.body = (result_json)
                return
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            raw_json = req.stream.read(req.content_length or 0).decode('utf-8')
            result_dictionary_json = json.loads(raw_json, object_pairs_hook=OrderedDict, encoding='utf-8')
            order_id = [v for v in result_dictionary_json.values()]
            row = Tools.getOrderStatusAndButtonCode(order_id[0])
 
            if row:
                order_status=list(row)
                if((order_status[0] == "CARGOSENT") or (order_status[0] == "CARGOPICKUP")):
                    order_status_code = "ORDERCONFIRMED"
                    actual_button_code = order_status[1]
                    # Here 8 deducted because cargo sent button code is 8, which is the fourth position of the binary number
                    # thats why the value will be 2 to power of 3 which is 8
                    current_button_code = actual_button_code - 8
                    Tools.ChangeBookingStatus(order_id[0],order_status_code,current_button_code)
                    resp.status = falcon.HTTP_200
                    message = {"status": "Credit block of this order has been approved"}
                    result_json = json.dumps(message)
                    resp.body = result_json
                else:
                    resp.status = falcon.HTTP_202
                    message = {"status": "You need to confirm your order first to block your credit for approval"}
                    result_json = json.dumps(message)
                    resp.body = result_json
            else:
                resp.status = falcon.HTTP_202
                message = {"status": "Something happend wrong. Please login and try again"}
                result_json = json.dumps(message)
                resp.body = (result_json)
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
