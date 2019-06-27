import json
class Tools(object):
    @staticmethod
    def getClientURL():
        # # Reading server url from JSON file 
        with open('c:\\Users\\HP EliteBook\\Documents\\IntugloLogistics\\src\\assets\\custom-config.json') as f:
            serverConfig = json.load(f)
            #  get environment name and set url 
            if (serverConfig["environment"]["name"]=="PRODUCTION"):
                client_url = serverConfig["production"]["application"]
            elif(serverConfig["environment"]["name"]=="STAGING"):
                client_url = serverConfig["staging"]["application"]
            else:
                client_url = serverConfig["development"]["application"]
            print(client_url)
            return client_url