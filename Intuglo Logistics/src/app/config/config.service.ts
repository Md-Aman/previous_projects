/*
This config service will load before 
rendering the browser. All server related 
configuaration should be done in this service
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ConfigService {
  envConfig: any;
  server_url: string;
  client_url: string;
  constructor(private httpClient: HttpClient) { }

  getEnvSettings(): Promise<any> {
    // Getting JSON file
    const promise = this.httpClient.get('./assets/custom-config.json')
      .toPromise()
      .then(getEnvConfig => {
        // Reading JSON file data
        this.envConfig = getEnvConfig;
        if (this.envConfig.environment.name == "PRODUCTION") {
          this.server_url = this.envConfig.production.api;
          this.client_url = this.envConfig.production.application;
        } else if (this.envConfig.environment.name == "STAGING") {
          this.server_url = this.envConfig.staging.api;
          this.client_url = this.envConfig.staging.application;
        } else {
          this.server_url = this.envConfig.development.api;
          this.client_url = this.envConfig.development.application;
        }
        return this.server_url,this.client_url;
      });
    return promise;
  }
}
