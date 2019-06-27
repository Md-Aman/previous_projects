'''
Name   :  memcacheResource
Description  :  used for storing the data in memory and to reset the timeout
'''

import platform
from importlib.machinery import SourceFileLoader

os_name = platform.system()

if (os_name=="Windows"):
    memcache_path = "c:\Python34\Lib\site-packages\memcache.py"
elif (os_name=="Linux"):
    memcache_path = "/usr/local/lib/python3.4/dist-packages/memcache.py"
else:
    memcache_path = "/Users/naumansheh/test/lib/python3.4/site-packages/memcache.py"
memcache = SourceFileLoader("memcache", memcache_path).load_module()


class MemcacheFunctions():
    mc = memcache.Client(['127.0.0.1:11211'])

    @staticmethod
    def IsSessionValid(login_id,session):
        timeout = 1800
        memcache_session = MemcacheFunctions.mc.get(login_id)
        if memcache_session == session:
            MemcacheFunctions.mc.set(login_id, session, timeout)
            return True
        else:
            return False

