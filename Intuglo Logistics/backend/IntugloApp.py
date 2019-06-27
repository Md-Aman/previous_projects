'''
Name  :  IntugloApp
Description  :  This is the main application to access all the resources
'''
import platform
import sys

# In the case of failure to identify module please enable the below code.
"""
os_name = platform.system()
if (os_name=="Windows"): # Adjust your path for windows accordingly
	sys.path.append('Admin')
	sys.path.append('Customer')
	sys.path.append('Supplier')
	sys.path.append('Custom_Agent')
elif (os_name=="Linux"): # Adjust your path for linux accordingly
	sys.path.append('Admin')
	sys.path.append('Customer')
	sys.path.append('Supplier')
	sys.path.append('Custom_Agent')
"""
# If the if else block above is enabled kidnly comment out the 4 lines below
sys.path.append('Admin')
sys.path.append('Customer')
sys.path.append('Supplier')
sys.path.append('Custom_Agent')
sys.path.append('Landing_Page')

import falcon
from Tools import *
from falcon_multipart.middleware import MultipartMiddleware
from memcacheResource import MemcacheFunctions
from UploadFile import UploadFile__v1__
from Login import LoginResource__v1__
from SignUp import SignupResource__v1__
from Lookup import Lookup
from SearchInit import SearchInitResource__v1__
from SignUpInit import SignupInitResource__v1__
# from News import NewsResource__v1__
# from Announcements import AnnouncementsResource__v1__
# from NewsList import NewsListResource__v1__
# from AnnouncementsList import AnnouncementsListResource__v1__
# from ForgotPassword import ForgotPasswordResource__v1__
from HsWiki import HsWikiResource__v1__
from Quotation import QuotationResource__v1__
from QuotationInit import QuotationInitResource__v1__
from CustomerProfileInit import CustomerProfileInitResource__v1__
from CustomerProfile import CustomerProfileResource__v1__
from CustomerDashboardInit import CustomerDashboardInitResource__v1__
from UpdateOrderStatus import UpdateOrderStatusResource__v1__
from CustomerBookingList import CustomerBookingListResource__v1__
from BookingInit import BookingInitResource__v1__
from Booking import BookingResource__v1__
from CustomerRoutes import CustomerRoutesResource__v1__
from PasswordChange import PasswordChange__v1__
from ActivateAccount import ActivateAccount__v1__
from QuotationList import QuotationListResource__v1__
from SupplierOrderList import SupplierOrderListResource__v1__
# from ChangeBookingStatusToCargoSent import ChangeBookingStatusToCargoSent__v1__
from CustomerCountryList import CustomerCountryListResource__v1__
from SearchQuotationInit import SearchQuotationInitResource__v1__
from ChangeBookingStatusToCancel import ChangeBookingStatusToCancel__v1__
# from ChangeBookingStatusToCargoReadyforPickup import ChangeBookingStatusToCargoReadyforPickup__v1__
from ChangeBookingStatusToApproveCreditBlock import ChangeBookingStatusToApproveCreditBlock__v1__
from QuotationCountryList import QuotationCountryListResource__v1__
from SupplierCountryList import SupplierCountryListResource__v1__
from SupplierProfile import SupplierProfileResource__v1__
from SupplierProfileInit import SupplierProfileInitResource__v1__
from SupplierFilterList import SupplierFilterListResource__v1__
from QuotationFilterList import QuotationFilterListResource__v1__
# from ChangeBookingStatusToCargoPickedUp import ChangeBookingStatusToCargoPickedUp__v1__
# from ChangeBookingStatusToCargoReceived import ChangeBookingStatusToCargoReceived__v1__
from CustomerInvoiceInit import CustomerInvoiceInit__v1__
from CheckDuplicateEmail import CheckDuplicateEmail__v1__
from CartList import CartList__v1__
from CustomerProfileUploadFile import CustomerProfileUploadFile__v1__
from SupplierProfileUploadFile import SupplierProfileUploadFile__v1__
from PendingApproval import PendingApprovalQuotationResource__v1__
from DeleteQuotation import DeleteQuotationResource__v1__
from ApprovedQuotation import ApprovedQuotationResource__v1__
from DuplicateQuotation import DuplicateQuotation__v1__
from CheckUserSession import CheckUserSession__v1__
from ActivateQuotation import ActivateQuotation__v1__
from UpdateCartStatus import UpdateCartStatusResource__v1__
from ChangeStatusCart import ChangeStatusCartResource__v1__
from SearchFiltering import SearchFiltering__v1__
from SupplierAssignContainer import SupplierAssignContainer__v1__
from OrderCsv import OrderCsvResource__v1__
from QuotationChargesBlock import QuotationChargesResource__v1__
from UploadOrderCsv import UpdateOrderCsvResource__v1__
from ChangeBookingStatus import ChangeBookingStatus__v1__
from AdminCountryList import AdminCountryListResource__v1__
from AdminFilterList import AdminFilterListResource__v1__
from AdminOrderList import AdminOrderListResource__v1__
from AdminQuotationCountryList import AdminQuotationCountryListResource__v1__
from AdminQuotationFilterList import AdminQuotationFilterListResource__v1__
from AdminQuotationList import AdminQuotationListResource__v1__
from DeleteFile import DeleteFile__V1__
from SupplierContainerList import SupplierContainerListResource__v1__
from CustomerCustomeFile import CustomerCustomeFile__v1__
from CustomerUploadCustomFile import CustomerUploadCustomFile__v1__
from AdminChangeQuotationStatus import AdminChangeQuotationStatus__v1__
from CustomerCustomDocumentDownload import CustomerCustomDocumentDownload__v1__
from FakeSignUp import FakeSignupResource__v1__
from AdminOrderDroppedChangeStatus import AdminOrderDroppedChangeStatus__v1__
from RequestConfirmation import RequestForConfirmationResource__v1__
from DownloadSupplierQuotation import DownloadSupplierQuotation__v1__
from AdminCountryByQT import AdminCountryByQT__v1__
from AdminRoutesByCountry import AdminRoutesByCountry__v1__
from AdminVesselByPortAndDeparture import AdminVesselByPortAndDeparture__v1__
from AdminSupplierListByVessel import AdminSupplierListByVessel__v1__
from AdminQTByVesselAndSupplier import AdminQTByVesselAndSupplier__v1__
from AdminOrderListByQuotations import AdminOrderListByQuotations__v1__
from AdminQTByVessel import AdminQTByVessel__v1__
from SupplierVesselList import SupplierVesselList__v1__
from CustomAgentList import CustomAgentList__v1__
from CustomAgentProfile import CustomAgentProfileResource__v1__
from SupplierVessel import SupplierVessel__v1__
from AdminViewListOfUser import AdminViewListOfUserResource__v1__
# from AdminDownloadUserProfileDocuments import AdminDownloadUserProfileDocumentsResource__v1__
from CustomerPackingList import CustomerPackingListResource__v1__
from UsersViewHsWiki import UsersViewHsWikiResource__v1__
from CustomerProfileCompanyLogo import CustomerProfileCompanyLogo__v1__
from SupplierProfileCompanyLogo import SupplierProfileCompanyLogo__v1__
from QuotationChargesBlockInit import QuotationChargesBlockInitResource__v1__
from UserUpdateContainer import UserUpdateContainerResource__v1__
from SeaFreightCharges import SeaFreightChargesResource__v1__
from UserManageHsCode import UserManageHsCodeResource__v1__
from ChangeCustomStatus import ChangeCustomStatusResource__v1__
from ChangePaymentStatus import ChangePaymentStatusResource__v1__
from CheckEmailValidity import CheckEmailValidity__v1__
from ResetPassword import ResetPassword__V1__
from UserSignupAndSelectCheckboxes import UserSignupAndSelectCheckBoxesResource__v1__
from SupplierCustomDashboardAction import SupplierCustomDashboardActionResource__v1__
from CustomAgentBookingList import CustomAgentBookingListResource__v1__
from CustomAgentCountryList import CustomAgentCountryListResource__v1__
from CustomAgentRoutes import CustomAgentRoutesResource__v1__
from CustomAgentListOfRoutes import CustomAgentListOfRoutesResource__v1__
# from AdminActivateSupplierAndCustomStatus import AdminActivateSupplierAndCustomStatusResource__v1__
from CartPaymentCheckout import CartPaymentCheckout__v1__
from AdminUsertypeList import AdminUsertypeListResource__v1__
from UserProfileDocumentUploader import UserProfileUploaderResource__v1__
from QuotationChargesPartA import QuotationChargesPartA__v1__
from CalendarVesselList import CalendarVesselList__v1__
from UploadProfilePicture import UploadProfilePictureResource__v1__
from DisplayProfilePicture import DisplayProfilePictureResource__v1__
from AdminVerifiedUser import AdminVerifiedUserResource__v1__
from PriceLeveraging import *
from UserProfileDocumentDownloader import UserProfileDocumentDownloader__v1__
from PackingTypesList import PackingTypesListResource__v1__
from AdminPaymentFiltration import AdminPaymentFiltrationResource__v1__
from PlatformPricing import Platform_Pricing__v1__
from SupplierPaymentFiltration import SupplierPaymentFiltrationResource__v1__
from AdminPaymentList import AdminPaymentListResource__v1__
from SupplierPaymentList import SupplierPaymentListResource__v1__
from EnterPaymentGateway import EnterPaymentGateway__v1__
from SupplierConfirmPayments import SupplierConfirmPaymentsResource__v1__
from SupplierPaymentRoutes import SupplierPaymentRoutesResource__v1__
from SupplierPaymentVessels import SupplierPaymentVesselsResource__v1__
# from ApproveCreditBlock import ApproveCreditBlock__v1__
from OrderCSV import OrderCSV__v1__
from AdminEmployeeList import AdminEmployeeListResource__v1__
from ChangeQTStatus import ChangeQTStatusResource__v1__
from AdminCountryListReport import AdminCountryListReportResource__v1__


print("spawning again")
''' Enabling CORS '''
class CORSMiddleware:
    def process_request(self, req, resp):
        resp.set_header('Access-Control-Allow-Origin', '*')
        resp.set_header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS')

'''IntugloLogistics is the Application name'''
IntugloLogistics = falcon.API(middleware=[CORSMiddleware(), MultipartMiddleware()])

quotation_files = Tools.GetQuotationFilePath()
profile_files = Tools.GetProfileFilePath()
custom_zip_files = Tools.GetCustomFilePath()
profilepicture_files = Tools.GetProfilePicturePath()
profileDocuments = Tools.GetProfileDocumentFilePath()

'''These are Dictionary variables gets dictionary data from Lookup Resource'''
GlobalCountryList = Lookup.getCountryList()
GlobalTermsConditionsList = Lookup.getTermsAndCondition()
GlobalPortList = Lookup.getPortList()
GlobalHSCode = Lookup.getHSCode()
GlobalContainerTypes = Lookup.getContainerTypes()
GlobalIndustryList = Lookup.getIndustryList()
GlobalBusinessList = Lookup.getBusinessList()
GlobalIncotermList = Lookup.getIncotermList()
GlobalShipmentTypes = Lookup.getShipmentList()
# GlobalChargesList = Lookup.getQuotationChargesList()
GlobalMeasureList = Lookup.getUnitMeasureList()
GlobalTerms = Lookup.getTermsAndCondition()
GlobalClientServerURLBackend = Lookup.getClientServerURLBackend()
GlobalClientServerURLFrontend = Lookup.getClientServerURLFrontend()


'''Creating Instances of all Resources'''
Login = LoginResource__v1__()
SignUp = SignupResource__v1__()
SearchInit = SearchInitResource__v1__()
SignUpInit = SignupInitResource__v1__()
# News = NewsResource__v1__()
# Announcements = AnnouncementsResource__v1__()
# NewsList = NewsListResource__v1__()
# AnnouncementsList = AnnouncementsListResource__v1__()
# ForgotPassword = ForgotPasswordResource__v1__()
HsWiki = HsWikiResource__v1__()
Quotation = QuotationResource__v1__()
QuotationInit = QuotationInitResource__v1__()
CustomerProfileInit = CustomerProfileInitResource__v1__()
CustomerProfile = CustomerProfileResource__v1__()
CustomerDashboardInit = CustomerDashboardInitResource__v1__()
UpdateOrderStatus = UpdateOrderStatusResource__v1__()
CustomerBookingList = CustomerBookingListResource__v1__()
BookingInit = BookingInitResource__v1__()
Booking = BookingResource__v1__()
CustomerRoutes = CustomerRoutesResource__v1__()
PasswordChange = PasswordChange__v1__()
ActivateAccount = ActivateAccount__v1__()
QuotationList = QuotationListResource__v1__()
SupplierOrderList = SupplierOrderListResource__v1__()
# ChangeBookingStatusToCargoSent = ChangeBookingStatusToCargoSent__v1__()
CustomerCountryList = CustomerCountryListResource__v1__()
SearchQuotationInit = SearchQuotationInitResource__v1__()
ChangeBookingStatusToCancel = ChangeBookingStatusToCancel__v1__()
# ChangeBookingStatusToCargoReadyforPickup = ChangeBookingStatusToCargoReadyforPickup__v1__()
ChangeBookingStatusToApproveCreditBlock = ChangeBookingStatusToApproveCreditBlock__v1__()
QuotationCountryList = QuotationCountryListResource__v1__()
UploadFile = UploadFile__v1__()
SupplierCountryList = SupplierCountryListResource__v1__()
SupplierProfile = SupplierProfileResource__v1__()
SupplierProfileInit = SupplierProfileInitResource__v1__()
SupplierFilterList = SupplierFilterListResource__v1__()
QuotationFilterList = QuotationFilterListResource__v1__()
# ChangeBookingStatusToCargoPickedUp = ChangeBookingStatusToCargoPickedUp__v1__()
# ChangeBookingStatusToCargoReceived = ChangeBookingStatusToCargoReceived__v1__()
CustomerInvoiceInit = CustomerInvoiceInit__v1__()
CheckDuplicateEmail = CheckDuplicateEmail__v1__()
CartList = CartList__v1__()
CustomerProfileUploadFile = CustomerProfileUploadFile__v1__()
SupplierProfileUploadFile = SupplierProfileUploadFile__v1__()
DeleteQuotation = DeleteQuotationResource__v1__()
PendingApproval = PendingApprovalQuotationResource__v1__()
ApprovedQuotation = ApprovedQuotationResource__v1__()
DuplicateQuotation = DuplicateQuotation__v1__()
CheckUserSession = CheckUserSession__v1__()
ActivateQuotation = ActivateQuotation__v1__()
UpdateCartStatus = UpdateCartStatusResource__v1__()
ChangeStatusCart = ChangeStatusCartResource__v1__()
SearchFiltering = SearchFiltering__v1__()
SupplierAssignContainer = SupplierAssignContainer__v1__()
OrderCsv = OrderCsvResource__v1__()
QuotationChargesBlock = QuotationChargesResource__v1__()
UploadOrderCsv = UpdateOrderCsvResource__v1__()
ChangeBookingStatus = ChangeBookingStatus__v1__()
AdminCountryList = AdminCountryListResource__v1__()
AdminFilterList = AdminFilterListResource__v1__()
AdminOrderList = AdminOrderListResource__v1__()
AdminQuotationCountryList = AdminQuotationCountryListResource__v1__()
AdminQuotationFilterList = AdminQuotationFilterListResource__v1__()
AdminQuotationList = AdminQuotationListResource__v1__()
DeleteFile = DeleteFile__V1__()
SupplierContainerList = SupplierContainerListResource__v1__()
CustomerCustomeFile = CustomerCustomeFile__v1__()
CustomerUploadCustomFile = CustomerUploadCustomFile__v1__()
AdminChangeQuotationStatus = AdminChangeQuotationStatus__v1__()
CustomerCustomDocumentDownload = CustomerCustomDocumentDownload__v1__()
FakeSignUp = FakeSignupResource__v1__()
AdminOrderDroppedChangeStatus = AdminOrderDroppedChangeStatus__v1__()
RequestForConfirmation = RequestForConfirmationResource__v1__()
DownloadSupplierQuotation = DownloadSupplierQuotation__v1__()
AdminCountryByQT = AdminCountryByQT__v1__()
AdminRoutesByCountry = AdminRoutesByCountry__v1__()
AdminVesselByPortAndDeparture = AdminVesselByPortAndDeparture__v1__()
AdminSupplierListByVessel = AdminSupplierListByVessel__v1__()
AdminQTByVesselAndSupplier = AdminQTByVesselAndSupplier__v1__()
AdminOrderListByQuotations = AdminOrderListByQuotations__v1__()
AdminQTByVessel = AdminQTByVessel__v1__()
SupplierVesselList = SupplierVesselList__v1__()
CustomAgentList = CustomAgentList__v1__()
CustomAgentProfile = CustomAgentProfileResource__v1__()
SupplierVessel = SupplierVessel__v1__()
AdminViewListOfUser = AdminViewListOfUserResource__v1__()
# AdminDownloadUserProfileDocuments = AdminDownloadUserProfileDocumentsResource__v1__()
CustomerPackingList = CustomerPackingListResource__v1__()
UsersViewHsWiki = UsersViewHsWikiResource__v1__()
CustomerProfileCompanyLogo = CustomerProfileCompanyLogo__v1__()
SupplierProfileCompanyLogo = SupplierProfileCompanyLogo__v1__()
QuotationChargesBlockInit = QuotationChargesBlockInitResource__v1__()
UserUpdateContainer = UserUpdateContainerResource__v1__()
SeaFreightCharges = SeaFreightChargesResource__v1__()
UserManageHsCode = UserManageHsCodeResource__v1__()
ChangeCustomStatus = ChangeCustomStatusResource__v1__()
ChangePaymentStatus = ChangePaymentStatusResource__v1__()
CheckEmailValidity = CheckEmailValidity__v1__()
ResetPassword = ResetPassword__V1__()
UserSignupAndSelectCheckBoxes = UserSignupAndSelectCheckBoxesResource__v1__()
SupplierCustomDashboardAction = SupplierCustomDashboardActionResource__v1__()
CustomAgentBookingList = CustomAgentBookingListResource__v1__()
CustomAgentCountryList = CustomAgentCountryListResource__v1__()
CustomAgentRoutes = CustomAgentRoutesResource__v1__()
CustomAgentListOfRoutes = CustomAgentListOfRoutesResource__v1__()
# AdminActivateSupplierAndCustomStatus = AdminActivateSupplierAndCustomStatusResource__v1__()
CartPaymentCheckout = CartPaymentCheckout__v1__()
AdminUsertypeList = AdminUsertypeListResource__v1__()
UserProfileUploader = UserProfileUploaderResource__v1__()
QuotationChargesPartA = QuotationChargesPartA__v1__()
CalendarVesselList = CalendarVesselList__v1__()
UploadProfilePicture = UploadProfilePictureResource__v1__()
DisplayProfilePicture = DisplayProfilePictureResource__v1__()
AdminVerifiedUser = AdminVerifiedUserResource__v1__()
UserProfileDocumentDownloader = UserProfileDocumentDownloader__v1__()
PackingTypesList = PackingTypesListResource__v1__()
AdminPaymentFiltration = AdminPaymentFiltrationResource__v1__()
PlatformPricing = Platform_Pricing__v1__()
SupplierPaymentFiltration = SupplierPaymentFiltrationResource__v1__()
AdminPaymentList = AdminPaymentListResource__v1__()
SupplierPaymentList = SupplierPaymentListResource__v1__()
EnterPaymentGateway = EnterPaymentGateway__v1__()
SupplierConfirmPayments = SupplierConfirmPaymentsResource__v1__()
SupplierPaymentRoutes = SupplierPaymentRoutesResource__v1__()
SupplierPaymentVessels = SupplierPaymentVesselsResource__v1__()
# ApproveCreditBlock = ApproveCreditBlock__v1__()
OrderCSV = OrderCSV__v1__()
AdminEmployeeList = AdminEmployeeListResource__v1__()
ChangeQTStatus = ChangeQTStatusResource__v1__()
AdminCountryListReport = AdminCountryListReportResource__v1__()


'''At which url what data to be accessible'''
IntugloLogistics.add_route('/Login/{user}/{password}', Login)
IntugloLogistics.add_route('/SignUp', SignUp)
IntugloLogistics.add_route('/SearchInit', SearchInit)
IntugloLogistics.add_route('/SignUpInit/{user_type}', SignUpInit)
# IntugloLogistics.add_route('/News/{news_id}', News)
# IntugloLogistics.add_route('/News', News)
# IntugloLogistics.add_route('/Announcements/{announcements_id}', Announcements)
# IntugloLogistics.add_route('/Announcements', Announcements)
# IntugloLogistics.add_route('/NewsList/{number_of_news}', NewsList)
# IntugloLogistics.add_route('/AnnouncementsList/{number_of_announcements}', AnnouncementsList)
# IntugloLogistics.add_route('/ForgotPassword', ForgotPassword)
IntugloLogistics.add_route('/HsWiki/{login_id}/{session}', HsWiki)
IntugloLogistics.add_route('/Quotation/{login_id}/{session}', Quotation)
IntugloLogistics.add_route('/Quotation/{login_id}/{session}/{quotation_id}', Quotation)
IntugloLogistics.add_route('/QuotationInit', QuotationInit)
IntugloLogistics.add_route('/CustomerProfileInit/{login_id}/{session}', CustomerProfileInit)
IntugloLogistics.add_route('/CustomerProfile/{login_id}/{session}', CustomerProfile)
IntugloLogistics.add_route('/CustomerDashboardInit/{login_id}/{session}', CustomerDashboardInit)
IntugloLogistics.add_route('/UpdateOrderStatus/{login_id}/{session}', UpdateOrderStatus)
IntugloLogistics.add_route('/CustomerBookingList/{login_id}/{session}', CustomerBookingList)
IntugloLogistics.add_route('/BookingInit/{login_id}/{session}/{container_id}',BookingInit)
IntugloLogistics.add_route('/Booking/{login_id}/{session}/{order_id}',Booking)
IntugloLogistics.add_route('/Booking/{login_id}/{session}',Booking)
IntugloLogistics.add_route('/CustomerRoutes/{login_id}/{session}', CustomerRoutes)
IntugloLogistics.add_route('/PasswordChange/{login_id}/{session}', PasswordChange)
IntugloLogistics.add_route('/ActivateAccount', ActivateAccount)
IntugloLogistics.add_route('/QuotationList/{login_id}/{session}',QuotationList)
IntugloLogistics.add_route('/SupplierOrderList/{login_id}/{session}', SupplierOrderList)
# IntugloLogistics.add_route('/ChangeBookingStatusToCargoSent/{login_id}/{session}', ChangeBookingStatusToCargoSent)
IntugloLogistics.add_route('/CustomerCountryList/{login_id}/{session}', CustomerCountryList)
IntugloLogistics.add_route('/SearchQuotationInit', SearchQuotationInit)
IntugloLogistics.add_route('/ChangeBookingStatusToCancel/{login_id}/{session}', ChangeBookingStatusToCancel)
# IntugloLogistics.add_route('/ChangeBookingStatusToCargoReadyforPickup/{login_id}/{session}', ChangeBookingStatusToCargoReadyforPickup)
IntugloLogistics.add_route('/ChangeBookingStatusToApproveCreditBlock/{login_id}/{session}', ChangeBookingStatusToApproveCreditBlock)
IntugloLogistics.add_route('/UploadFile', UploadFile)
IntugloLogistics.add_route('/QuotationCountryList/{login_id}/{session}', QuotationCountryList)
IntugloLogistics.add_route('/SupplierCountryList/{login_id}/{session}', SupplierCountryList)
IntugloLogistics.add_route('/SupplierProfileInit/{login_id}/{session}', SupplierProfileInit)
IntugloLogistics.add_route('/SupplierProfile/{login_id}/{session}', SupplierProfile)
# IntugloLogistics.add_route('/NewQuotation/{login_id}/{session}', NewQuotation)
IntugloLogistics.add_route('/SupplierFilterList/{login_id}/{session}', SupplierFilterList)
IntugloLogistics.add_route('/QuotationFilterList/{login_id}/{session}', QuotationFilterList)
# IntugloLogistics.add_route('/ChangeBookingStatusToCargoPickedUp/{login_id}/{session}', ChangeBookingStatusToCargoPickedUp)
# IntugloLogistics.add_route('/ChangeBookingStatusToCargoReceived/{login_id}/{session}', ChangeBookingStatusToCargoReceived)
IntugloLogistics.add_route('/CustomerInvoiceInit/{login_id}/{session}', CustomerInvoiceInit)
IntugloLogistics.add_route('/CheckDuplicateEmail/{email}', CheckDuplicateEmail)
IntugloLogistics.add_route('/CartList/{login_id}/{session}/{cart_id}', CartList)
IntugloLogistics.add_route('/CustomerProfileUploadFile', CustomerProfileUploadFile)
IntugloLogistics.add_route('/SupplierProfileUploadFile', SupplierProfileUploadFile)
IntugloLogistics.add_route('/DeleteQuotation/{login_id}/{session}', DeleteQuotation)
IntugloLogistics.add_route('/ApprovedQuotation/{login_id}/{session}/{quotation_id}', ApprovedQuotation)
IntugloLogistics.add_route('/PendingApproval/{login_id}/{session}/{quotation_id}', PendingApproval)
IntugloLogistics.add_route('/DuplicateQuotation/{login_id}/{session}/{quotation_id}', DuplicateQuotation)
IntugloLogistics.add_route('/CheckUserSession/{login_id}/{session}', CheckUserSession)
IntugloLogistics.add_route('/ActivateQuotation/{login_id}/{session}', ActivateQuotation)
IntugloLogistics.add_route('/UpdateCartStatus/{login_id}/{session}', UpdateCartStatus)
IntugloLogistics.add_route('/ChangeStatusCart/{login_id}/{session}', ChangeStatusCart)
# IntugloLogistics.add_route('/SearchFiltering/{login_id}/{session}', SearchFiltering)
IntugloLogistics.add_route('/SearchFiltering/', SearchFiltering)
IntugloLogistics.add_route('/SupplierAssignContainer/{login_id}/{session}', SupplierAssignContainer)
IntugloLogistics.add_route('/OrderCSV/{login_id}/{session}/{container_id}', OrderCSV)
IntugloLogistics.add_route('/CustomerCustomeFile/{login_id}/{session}/{order_id}', CustomerCustomeFile)
IntugloLogistics.add_route('/CustomerCustomeFile/{login_id}/{session}', CustomerCustomeFile)
IntugloLogistics.add_route('/QuotationChargesBlock/{login_id}/{session}/{quotation_id}', QuotationChargesBlock)
IntugloLogistics.add_route('/UploadOrderCsv/{login_id}/{session}', UploadOrderCsv)
IntugloLogistics.add_route('/ChangeBookingStatus/{login_id}/{session}', ChangeBookingStatus)
IntugloLogistics.add_route('/QuotationChargesBlockInit/', QuotationChargesBlockInit)
IntugloLogistics.add_route('/AdminCountryList/{login_id}/{session}', AdminCountryList)
IntugloLogistics.add_route('/AdminFilterList/{login_id}/{session}', AdminFilterList)
IntugloLogistics.add_route('/AdminOrderList/{login_id}/{session}', AdminOrderList)
IntugloLogistics.add_route('/AdminQuotationCountryList/{login_id}/{session}', AdminQuotationCountryList)
IntugloLogistics.add_route('/AdminQuotationFilterList/{login_id}/{session}', AdminQuotationFilterList)
IntugloLogistics.add_route('/AdminQuotationList/{login_id}/{session}', AdminQuotationList)
IntugloLogistics.add_route('/DeleteFile/{login_id}/{session}', DeleteFile)
IntugloLogistics.add_route('/SupplierContainerList/{login_id}/{session}/{quotation_id}',SupplierContainerList)
IntugloLogistics.add_route('/CustomerUploadCustomFile',CustomerUploadCustomFile)
IntugloLogistics.add_route('/AdminChangeQuotationStatus/{login_id}/{session}',AdminChangeQuotationStatus)
IntugloLogistics.add_route('/CustomerCustomDocumentDownload/{login_id}/{session}/{order_id}',CustomerCustomDocumentDownload)
IntugloLogistics.add_route('/FakeSignUp', FakeSignUp)
IntugloLogistics.add_route('/AdminOrderDroppedChangeStatus/{login_id}/{session}',AdminOrderDroppedChangeStatus)
IntugloLogistics.add_static_route('/quotations', quotation_files['quotation_files'],downloadable=True)
IntugloLogistics.add_static_route('/custom', custom_zip_files['custom_files'],downloadable=True)
IntugloLogistics.add_static_route('/custom_zip',custom_zip_files['custom_zip_files'],downloadable=True)
IntugloLogistics.add_static_route('/logo',profile_files['profile_files'])
IntugloLogistics.add_static_route('/profilepicture',profilepicture_files['profile_picture'])
IntugloLogistics.add_static_route('/profiledoc',profileDocuments['profile_doc_zip'])
IntugloLogistics.add_route('/RequestForConfirmation/{login_id}/{session}',RequestForConfirmation)
IntugloLogistics.add_route('/DownloadSupplierQuotation/{login_id}/{session}/{quotation_id}',DownloadSupplierQuotation)
IntugloLogistics.add_route('/AdminCountryByQT/{login_id}/{session}',AdminCountryByQT)
IntugloLogistics.add_route('/AdminRoutesByCountry/{login_id}/{session}/{country}',AdminRoutesByCountry)
IntugloLogistics.add_route('/AdminVesselByPortAndDeparture/{login_id}/{session}/{country_code}',AdminVesselByPortAndDeparture)
IntugloLogistics.add_route('/AdminSupplierListByVessel/{login_id}/{session}/{vessel_id}',AdminSupplierListByVessel)
IntugloLogistics.add_route('/AdminQTByVesselAndSupplier/{login_id}/{session}/{vessel_id}/{supplier_id}',AdminQTByVesselAndSupplier)
IntugloLogistics.add_route('/AdminOrderListByQuotations/{login_id}/{session}/{quotation_id}',AdminOrderListByQuotations)
IntugloLogistics.add_route('/AdminQTByVessel/{login_id}/{session}/{vessel_id}',AdminQTByVessel)
IntugloLogistics.add_route('/CustomAgentList/{login_id}/{session}',CustomAgentList)
IntugloLogistics.add_route('/CustomAgentProfile/{login_id}/{session}',CustomAgentProfile)
IntugloLogistics.add_route('/SupplierVesselList/{login_id}/{session}/{vessel_id}',SupplierVesselList)
IntugloLogistics.add_route('/SupplierVessel/{login_id}/{session}',SupplierVessel)
IntugloLogistics.add_route('/AdminViewListOfUser/{login_id}/{session}/{user_type}/{country_code}',AdminViewListOfUser)
IntugloLogistics.add_route('/AdminViewListOfUser/{login_id}/{session}',AdminViewListOfUser)
# IntugloLogistics.add_static_route('/profile', profile_files['profile_files'],downloadable=True)
# IntugloLogistics.add_route('/AdminDownloadUserProfileDocuments/{login_id}/{session}',AdminDownloadUserProfileDocuments)
IntugloLogistics.add_route('/CustomerPackingList/{login_id}/{session}/{order_id}',CustomerPackingList)
IntugloLogistics.add_route('/UsersViewHsWiki', UsersViewHsWiki)
IntugloLogistics.add_route('/CustomerProfileCompanyLogo/{login_id}/{session}', CustomerProfileCompanyLogo)
IntugloLogistics.add_route('/SupplierProfileCompanyLogo/{login_id}/{session}', SupplierProfileCompanyLogo)
IntugloLogistics.add_route('/QuotationChargesBlock/{login_id}/{session}/{quotation_id}/{handling_charges_id}', QuotationChargesBlock)
IntugloLogistics.add_route('/UserUpdateContainer/{login_id}/{session}',UserUpdateContainer)
IntugloLogistics.add_route('/SeaFreightCharges/{login_id}/{session}/{quotation_id}', SeaFreightCharges)
IntugloLogistics.add_route('/SeaFreightCharges/{login_id}/{session}/{quotation_id}/{sea_freight_charges_id}', SeaFreightCharges)
IntugloLogistics.add_route('/UserManageHsCode/{login_id}/{session}/{hs_code}', UserManageHsCode)
IntugloLogistics.add_route('/ChangeCustomStatus/{login_id}/{session}', ChangeCustomStatus)
IntugloLogistics.add_route('/ChangePaymentStatus/{login_id}/{session}', ChangePaymentStatus)
IntugloLogistics.add_route('/CheckEmailValidity/{email}', CheckEmailValidity)
IntugloLogistics.add_route('/ResetPassword', ResetPassword)
IntugloLogistics.add_route('/UserSignupAndSelectCheckBoxes/{login_id}/{session}', UserSignupAndSelectCheckBoxes)
IntugloLogistics.add_route('/SupplierCustomDashboardAction/{login_id}/{session}', SupplierCustomDashboardAction)
IntugloLogistics.add_route('/CustomAgentBookingList/{login_id}/{session}/{quotation_id}', CustomAgentBookingList)
IntugloLogistics.add_route('/CustomAgentCountryList/{login_id}/{session}', CustomAgentCountryList)
IntugloLogistics.add_route('/CustomAgentRoutes/{login_id}/{session}/{country}', CustomAgentRoutes)
IntugloLogistics.add_route('/CustomAgentListOfRoutes/{login_id}/{session}/{country_code}', CustomAgentListOfRoutes)
# IntugloLogistics.add_route('/AdminActivateSupplierAndCustomStatus/{login_id}/{session}', AdminActivateSupplierAndCustomStatus)
# IntugloLogistics.add_route('/AdminActivateSupplierAndCustomStatus/{login_id}/{session}/{merchant_id}', AdminActivateSupplierAndCustomStatus)
IntugloLogistics.add_route('/CartPaymentCheckout/{login_id}/{session}/{cart_id}', CartPaymentCheckout)
IntugloLogistics.add_route('/AdminUsertypeList/{login_id}/{session}', AdminUsertypeList)
IntugloLogistics.add_route('/UserProfileDocumentUploader/{login_id}/{session}', UserProfileUploader)
# IntugloLogistics.add_route('/UserProfileDocumentUploader/{login_id}/{session}/{merchant_id}', UserProfileUploader)
IntugloLogistics.add_route('/QuotationChargesPartA/{login_id}/{session}/{quotation_id}',QuotationChargesPartA)
IntugloLogistics.add_route('/QuotationChargesPartA/{login_id}/{session}/{quotation_id}/{charges_id}',QuotationChargesPartA)
IntugloLogistics.add_route('/CalendarVesselList/',CalendarVesselList)
IntugloLogistics.add_route('/DisplayProfilePicture/{login_id}/{session}/{user_type}',DisplayProfilePicture)
IntugloLogistics.add_route('/UploadProfilePicture',UploadProfilePicture)
IntugloLogistics.add_route('/AdminVerifiedUser/{login_id}/{session}',AdminVerifiedUser)
IntugloLogistics.add_route('/AdminVerifiedUser/{login_id}/{session}/{merchant_id}', AdminVerifiedUser)
IntugloLogistics.add_route('/UserProfileDocumentDownloader/{login_id}/{session}/{user_id}', UserProfileDocumentDownloader)
IntugloLogistics.add_route('/PackingTypesList/{login_id}/{session}', PackingTypesList)
IntugloLogistics.add_route('/AdminPaymentFiltration/{login_id}/{session}/{month}/{country}', AdminPaymentFiltration)
IntugloLogistics.add_route('/PlatformPricing', PlatformPricing)
IntugloLogistics.add_route('/SupplierPaymentFiltration/{login_id}/{session}/{month}/{country}', SupplierPaymentFiltration)
IntugloLogistics.add_route('/AdminPaymentList/{login_id}/{session}/{vessel_id}', AdminPaymentList)
IntugloLogistics.add_route('/SupplierPaymentList/{login_id}/{session}/{vessel_id}', SupplierPaymentList)
IntugloLogistics.add_route('/EnterPaymentGateway/{login_id}/{session}/{cart_id}', EnterPaymentGateway)
IntugloLogistics.add_route('/SupplierConfirmPayments/{login_id}/{session}', SupplierConfirmPayments)
IntugloLogistics.add_route('/SupplierPaymentRoutes/{login_id}/{session}/{month}/{country}', SupplierPaymentRoutes)
IntugloLogistics.add_route('/SupplierPaymentVessels/{login_id}/{session}/{route_id}', SupplierPaymentVessels)
# IntugloLogistics.add_route('/ApproveCreditBlock/{login_id}/{session}/{order_id}', ApproveCreditBlock)
IntugloLogistics.add_route('/AdminEmployeeList/{login_id}/{session}/{vessel_id}', AdminEmployeeList)
IntugloLogistics.add_route('/ChangeQTStatus/{login_id}/{session}', ChangeQTStatus)
IntugloLogistics.add_route('/AdminCountryListReport/{login_id}/{session}', AdminCountryListReport)