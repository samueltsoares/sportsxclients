import { Component, Inject } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';

@Component({
  selector: 'app-fetch-client',
  templateUrl: './fetch-client.component.html'
})


export class FetchClientComponent {
  public clientList: Array<any> = [];
  myAppUrl: string = "";

  constructor(public http: Http, private _router: Router, @Inject('BASE_URL') baseUrl: string) {
    this.myAppUrl = baseUrl;
    this.getProductList();
  }

  getProductList() {
    let self = this;
    this.http.request(this.myAppUrl + '/api/Clients')
      .subscribe((res: Response) => {
        self.clientList = JSON.parse(res['_body']);

        self.clientList.map(function (item) {
          let numbers = item['telephoneList'].map(function (tel) {
            return tel['number'];
          });
          item['numberList'] = numbers.toString();
        });


      });
  }

  delete(clientId: number, name: string) {
    if (confirm("Do you want to delete Client : " + name)) {
      let self = this;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json; charset=utf-8');
      this.http.delete(this.myAppUrl + "api/Clients/" + clientId, { headers: headers })
        .subscribe((res: Response) => {
          self.getProductList();
        });
    }
  }
}
