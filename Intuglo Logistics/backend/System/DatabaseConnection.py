'''
This file is the connection to Database(connection pooling) and other files can access to database by using Connection variable.
'''

# import mysql.connector
# import mysql.connector.pooling

# dbconfig = {
#     "user":'root',
#     "password":"root",
#     "host":"localhost",
#     "database":"intuglo"
# }
# connection = mysql.connector.pooling.MySQLConnectionPool(pool_name = "mypool",
#                               pool_size = 10,pool_reset_session=True,
#                               **dbconfig)
# return pymysql.connect(host="localhost",
    #                        user="root",
    #                        password="root",
    #                        db="intuglo",
    #                        cursorclass=pymysql.cursors.DictCursor)``

import pymysql
from DBUtils.PooledDB import PooledDB

def get_db_connection():
    POOL = PooledDB(creator=pymysql,host ="localhost",
    user="root",
    password= "root",
    database= "intuglo",
    cursorclass= pymysql.cursors.DictCursor,
    maxconnections = 20,
    mincached=8,  # When initialization, the idle link created at least in the linked pool is 0.
    maxcached=10,  # The most idle links in the linked pool, 0 and None do not restrict.
    blocking=True,  # If there is no available connection in the connection pool, do we block wait? True, wait; False, don't wait and make a mistake
    )
    return POOL.connection()
