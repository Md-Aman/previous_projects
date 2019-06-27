'''
Name  : Upload File
Usage : Post file and upload it to the server.
Description  : This code is used to upload file intended from user local's to the server.
                It will be store in a folder named Uploads and accepting all formats of documents.
                Accepted format: <in testing>
Pre-required : Need to create a folder named "uploads", unless the upload files would not work.
'''
import falcon
import json
import sys
import traceback
import os
from memcacheResource import MemcacheFunctions
from collections import OrderedDict

class SupplierProfileUploadFile__v1__(object):

    def on_post(self, req, resp):
        
        try:
            importExport = req.get_param('login_id')
            business = req.get_param('login_no')
            upload_count = 0
            list_of_uploads = 0
            for item in req.params:
                if item=='importExportLicenseUploader':
                    list_of_uploads += 1
                    fileitem = req.get_param(item)
                    if(fileitem.file):
                        fn = os.path.basename(fileitem.filename)
                        file_name_without_ext = os.path.splitext(fn)[0]
                        extension = os.path.splitext(fn)[1]
                        new_file_name = importExport
                        append_to_new_file_name = new_file_name+extension
                        open('uploads/import_export_license/' + append_to_new_file_name, 'wb').write(fileitem.file.read())
                        upload_count += 1

            for item in req.params:
                if item=='businessLicenseUploader':
                    list_of_uploads += 1
                    fileitem = req.get_param(item)
                    if(fileitem.file):
                        fn = os.path.basename(fileitem.filename)
                        file_name_without_ext = os.path.splitext(fn)[0]
                        extension = os.path.splitext(fn)[1]
                        new_file_name = business
                        append_to_new_file_name = new_file_name+extension
                        open('uploads/business_license/' + append_to_new_file_name, 'wb').write(fileitem.file.read())
                        upload_count += 1
                
            if (upload_count == list_of_uploads):
                resp.status = falcon.HTTP_200
                message = {'UploadCount': str(upload_count), 'Status': 'All files uploaded successfully'}
                result_json = json.dumps(message)
                resp.body = (result_json)
            else:
                resp.status = falcon.HTTP_400
                message = {'UploadCount': str(upload_count), 'Status': 'Failed to upload all files'}
                result_json = json.dumps(message)
                resp.body = (result_json)

        except ValueError as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)
        except Exception as err:
            raise falcon.HTTPError(falcon.HTTP_400, traceback.print_exc(file=sys.stdout) , err.args)