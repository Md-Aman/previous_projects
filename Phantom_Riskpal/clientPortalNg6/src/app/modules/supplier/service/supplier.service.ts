import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  supplierId: string;
  constructor(public http: HttpClient) { }

  getAllSupplier(data) {
    return this.http
    .post(environment.baseUrl + 'admin/supplier/getAllSupplier', data);
  }
  getCountryList() {
    return this.http
      .get(environment.baseUrl + 'super_admin/getCountries');
  }

  getCurrencyList() {
    return this.http
    .get(environment.baseUrl + 'admin/getAllCurrencies');
  }

  addSupplier(data){
    return this.http
    .post(environment.baseUrl + 'admin/supplier/addSupplier', data);
  }

  getIndividualSupplier(supplierId){
    return this.http
      .get(environment.baseUrl + 'admin/supplier/getSupplierDetails/' + supplierId);
  }
  
  updateSupplier(data){
    return this.http
    .post(environment.baseUrl + 'admin/supplier/updateSupplier', data);
  }

  deleteSupplier(supplierId){
    return this.http
    .get(environment.baseUrl + 'admin/supplier/deleteSupplier/' + supplierId);
  }

  
  supplierPriorityStatus = [
    {name: 'Compulsory'},
    {name: 'Preferred'},
    {name: 'Normal'}
  ]
  serviceProvided = [
    { id:101, name: 'Hotel', category: 'Accommodation' },
    { id:102, name: 'B&B', category: 'Accommodation' },
    { id:103, name: 'Self Catering Apartment', category: 'Accommodation' },
    { id:104, name: 'Airbnb', category: 'Accommodation' },
    { id:105, name: 'Guesthouse', category: 'Accommodation' },
    { id:106, name: 'Other - please specify', category: 'Accommodation' },
    
    { id:108, name: 'Airline', category: 'Transportation' },
    { id:112, name: 'Boat/Ferry', category: 'Transportation' },
    { id:109, name: 'Car Rental/Self Drive', category: 'Transportation' },
    { id:110, name: 'Chauffered Vehicle', category: 'Transportation' },
    { id:113, name: 'Driver', category: 'Transportation' },
    { id:114, name: 'Other - please specify', category: 'Transportation' }, 

    // { id:107, name: 'Taxi', category: 'Transportation' },
    // { id:111, name: 'Train', category: 'Transportation' },
    { id:124, name: 'Banking Facilities/Currency Exchange', category: 'Facilitation Providers' },
    { id:131, name: 'Camera Person', category: 'Facilitation Providers' },
    { id:122, name: 'Doctor/Medic', category: 'Facilitation Providers' },
    { id:132, name: 'Drone Operator', category: 'Facilitation Providers' },
    { id:133, name: 'Editor', category: 'Facilitation Providers' },
    { id:118, name: 'Fixer', category: 'Facilitation Providers' },
    { id:120, name: 'Interpreter/Translator', category: 'Facilitation Providers' },
    { id:119, name: 'Lawyers', category: 'Facilitation Providers' },
    { id:121, name: 'Security/Backwatcher', category: 'Facilitation Providers' },

    // { id:123, name: 'Driver', category: 'Facilitation Providers' },
    // { id:126, name: 'Other - please specify', category: 'Facilitation Providers' },

    { id:115, name: 'Bar/Restaurant/Cafe', category: 'Subsistence' },
    { id:116, name: 'Supermarket', category: 'Subsistence' },
    { id:117, name: 'Other - please specify', category: 'Subsistence' },

    // { id:127, name: 'Local Shops Please state what kind of shop', category: 'Equipment Providers' },
    // { id:128, name: 'Other - please specify', category: 'Equipment Providers' },
    
    // { id:129, name: 'Mobile Networks', category: 'Communications' },
    // { id:130, name: 'Satellite Phone Network', category: 'Communications' },
    // { id:130, name: 'Other - please specify', category: 'Communications' }
    { id:129, name: 'Local shop', category: 'Other' },
    { id:134, name: 'Mobile Network', category: 'Other' },
    { id:130, name: 'Satellite Phone Network', category: 'Other' },
    { id:130, name: 'Other - please specify', category: 'Other' }
];
  
}
