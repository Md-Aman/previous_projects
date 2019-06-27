import { PublicApiService } from './../../services/public-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {

  logisticBookingPrice: string;
  warehouseBookingPrice: string;

  constructor(private publicApiService: PublicApiService) { }

  ngOnInit() {
    this.publicApiService.getPricingDetails().subscribe(details => {
      this.logisticBookingPrice = details['logistics_booking_fee'];
      this.warehouseBookingPrice = details['warehouse_booking_fee'];
    });
  }

}
