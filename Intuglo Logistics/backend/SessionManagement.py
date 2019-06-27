'''
To maintain all the user sessions
'''

import uuid

ssid_dictionary = {}

def createSession(user):
    """Creates a session"""
    ssid = str(uuid.uuid4().hex[0:16])
    ssid_dictionary[ssid] = user
    return ssid