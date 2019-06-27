'''
Name  :  CustomAgentListOfRoutes
Usage : A Get resource to display routes details by port from and port to routes selection. 

'''


import sys
import traceback
import falcon
import json
import pymysql
from DatabaseConnection import *
from memcacheResource import MemcacheFunctions
from Login import LoginResource__v1__


class CustomAgentListOfRoutesResource__v1__(object):
    def on_get(self, req, resp, login_id, session, country_code ):
        # Authenticate login id and session availability.
        # try:
        #     if (MemcacheFunctions.IsSessionValid(login_id, session) is False):
        #         resp.status = falcon.HTTP_401
        #         Error = {"Reason": "Invalid Login Credentials or Session is Expired"}
        #         result_json = json.dumps(Error)
        #         resp.body = result_json
        #         return
        # except ValueError as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        # except Exception as err:
        #     raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)

        try:
            # Connecting the database
            database_connection = get_db_connection()
            cursor = database_connection.cursor()
            # Query to display data from this tbl w given departure & arrival
            final_result = {}
            quotation_list = []
            cursor.execute("select custom_agent_id from custom_agent where login_id = "+login_id+" ")
            custom_agent_id = cursor.fetchone()
            route_list = ("select distinct DATE_FORMAT(v1.eta,'%d/%m/%Y') as ETA,DATE_FORMAT(v1.etd, '%d/%m/%Y') as ETD, \
                            p1.port_name as PortFrom, p2.port_name as PortTo, v1.vessel_name as VesselFlight, \
                            q1.quotation_id \
                            from ship_quotations as q1  \
                            inner join vessel as v1  on v1.vessel_id = q1.vessel_id \
                            inner join routes as r1  on r1.route_id = v1.route_id \
                            inner join ports as p1 on p1.port_id = q1.port_id_from \
                            inner join ports as p2 on p2.port_id = q1.port_id_to \
                            inner join ship_orders as o on o.quotation_id = q1.quotation_id\
                            inner join custom_agent ca1 on q1.custom_agent_id = ca1.custom_agent_id\
                            where r1.country_code = '"+country_code+"' and o.payment_status_code = 'CREDITBLOCKED' and q1.quotation_status = 'ACTIVE' or q1.quotation_status = 'CLOSED' and ca1.login_id = '"+str(login_id)+"' ")
            cursor.execute(route_list)
            row = cursor.fetchall()
            # print(row)

            if(cursor.rowcount > 0):
                for x in row:
                    # print(x)
                    sql = ("select s.order_id,s.custom_status_code,s.cargo_status_code,s.payment_status_code,s.supplier_name \
                            from ship_custom_agent_order_list_view s \
                            where s.quotation_id = %s and s.custom_agent_id = %s")
                    args = (x['quotation_id'],custom_agent_id['custom_agent_id'])
                    cursor.execute(sql,args)
                    row1 = cursor.fetchall()
                    if cursor.rowcount > 0:
                        for y in row1:
                            cursor.execute("select file_name from ship_custom_documents where order_id = '"+str(y['order_id'])+"'")
                            document_list = cursor.fetchall()
                            if document_list:
                                y['document_list'] = document_list
                            else:
                                y['document_list'] = None
                            x['order'] = row1
                    else:
                        # print("inside else")
                        x.clear()
                
                final_data_set = []
                
                for y in row:
                    if 'quotation_id' in y:
                        final_data_set.append(y)
                
                result_json = json.dumps(final_data_set,sort_keys=True,default=str)
                resp.status = falcon.HTTP_200
                resp.body = result_json
            else:
                resp.status = falcon.HTTP_204
                message = {"Message": "Routes is not found"}
                result_json = json.dumps(message)
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