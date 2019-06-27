'''
Name   :   CustomAgentProfileInit
Usage  :   This API returns the details of ID , country code and name for businesses, industries and country.
Description : Country,Business,Industries list are displayed in dictionary format
'''

import falcon
import json
from Lookup import Lookup
import IntugloApp
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__


class CustomAgentProfileInitResource__v1__(object):
    # Authenticate login id and session availability.
    def on_get(self, req, resp, login_id, session):
        try:
            if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
                resp.status = falcon.HTTP_401
                Err = {"Reason": "Invalid Login Credentials or Session is Expired"}
                result_json = json.dumps(Err)
                resp.body = (result_json)
                return
        except Exception as ex:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', ex.message)

        try:
            # Get list of industry,business & country
            industry_list = IntugloApp.GlobalIndustryList
            business_list = IntugloApp.GlobalBusinessList
            country_list = IntugloApp.GlobalCountryList

            country_business_and_industry = {'businesses': business_list, 'industries': industry_list, 'countries':country_list}
            result_json = json.dumps(country_business_and_industry, sort_keys=True)
            resp.body = result_json
            resp.status = falcon.HTTP_200
        except Exception as ex:
            raise falcon.HTTPError(falcon.HTTP_400, 'Error', ex.message)
