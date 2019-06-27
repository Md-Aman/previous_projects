'''
Name  :  SignUpInit
Usage :  Get Resource for Country,Business and Industries
Description  :  This code gets dictionary data from IntugloApp and 
displays by converting dictionary to Json format
'''
import traceback
import sys
import falcon
import json
import IntugloApp
from Lookup import Lookup
import pymysql
from collections import OrderedDict
from DatabaseConnection import *

class SignupInitResource__v1__(object):
    def on_get(self,req,resp,user_type):
        try:
            country_list = IntugloApp.GlobalCountryList
            business_list = IntugloApp.GlobalBusinessList
            industry_list = IntugloApp.GlobalIndustryList
            # terms_conditions = IntugloApp.GlobalTermsConditionsList
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            cursor.execute("select tc_id,terms_conditions_text from terms_conditions where tc_type = '"+user_type+"' \
            and created_on = (select max(created_on) from terms_conditions where tc_type = '"+user_type+"') ")
            termsconditions_dictionary = cursor.fetchall()

            country_business_and_industry_termsconditions={'countries':country_list,
                                            'businesses':business_list,
                                            'industries':industry_list,
                                            'termsconditions':termsconditions_dictionary}
                                            # 'termsconditions_style':termsconditions_dictionary['terms_style'].decode('latin-1').encode("utf-8")}
            result_json = json.dumps(country_business_and_industry_termsconditions, sort_keys=True,default=str)
            resp.body= result_json
            resp.status=falcon.HTTP_200
            
        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        finally:
            cursor.close()
            database_connection.close()

