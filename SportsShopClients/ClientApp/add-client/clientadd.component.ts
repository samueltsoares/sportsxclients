import { Component, OnInit, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';

@Component({
  selector: 'client-add',
  templateUrl: './clientadd.component.html'
})

export class clientAddComponent implements OnInit {
  title: string = 'Create'
  errorMessage: any;
  modelData: any = {};
  myAppUrl: string = "";
  id: number = 0;

  constructor(private _avRoute: ActivatedRoute, public http: Http, private _router: Router, @Inject('BASE_URL') baseUrl: string) {
    this.myAppUrl = baseUrl;
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
  }

  ngOnInit() {
    if (this.id > 0) {
      this.title = "Edit";
      let self = this;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json; charset=utf-8');
      this.http.get(this.myAppUrl + "api/Clients/" + this.id, { headers: headers })
        .subscribe((res: Response) => {
          self.modelData = JSON.parse(res['_body']);
        });
    }
  }

  save(): void {
    if (this.validateData()) {
      let self = this;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json; charset=utf-8');
      if (this.title == "Create") {
        this.http.post(this.myAppUrl + "api/Clients/", this.modelData, { headers: headers })
          .subscribe((res: Response) => {
            self._router.navigate(['/client-list']);
          });
      }
      if (this.title == "Edit") {
        this.http.put(this.myAppUrl + "api/Clients/" + this.id, this.modelData, { headers: headers })
          .subscribe((res: Response) => {
            self._router.navigate(['/client-list']);
          });
      }
    }
  }

  private validateData(): boolean {
    let status: boolean = true;
    let strMessage: string = '';
    let emailExp = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
    let cepExp = new RegExp(/[0-9]{2}-[0-9]{3}-[0-9]{3}/);
    if (this.isNullOrUndefined(this.modelData)) {
      status = false;
      strMessage = 'Fill the the Fields in the Forms';
    }
    else if (this.isNullOrUndefined(this.modelData.name)) {
      status = false;
      strMessage = 'Name is a required field...';
    }
    else if (this.modelData.name.length > 100) {
      status = false;
      strMessage = 'The max lenght of name field is 100 characters...';
    }
    else if (this.isNullOrUndefined(this.modelData.email)) {
      status = false;
      strMessage = 'Email is a required field...';
    }
    else if (this.modelData.email.length > 100) {
      status = false;
      strMessage = 'The max lenght of email field is 100 characters...';
    }
    else if (!emailExp.test(this.modelData.email)) {
      status = false;
      strMessage = 'Invalid email';
    }
    else if (this.isNullOrUndefined(this.modelData.classification)) {
      status = false;
      strMessage = 'Classification is a required field...';
    }
    else if (!this.isNullOrUndefined(this.modelData.cep) && !cepExp.test(this.modelData.cep)) {
      status = false;
      strMessage = 'Invalid CEP...';
    }
    else if (this.modelData.socialNumber.length > 100) {
      status = false;
      strMessage = 'The max lenght of social number field is 100 characters...';
    }
    else if (this.modelData.cep.length > 10) {
      status = false;
      strMessage = 'The max lenght of CEP field is 100 characters...';
    }
    if (status === false)
      alert(strMessage);
    return status;
  }

  isNullOrUndefined(data: any): boolean {
    return this.isUndefined(data) || this.isNull(data);
  }

  isUndefined(data: any): boolean {
    return typeof (data) === "undefined";
  }

  isNull(data: any): boolean {
    return data === null;
  }

  cancel() {
    this._router.navigate(['/client-list']);
  }

  deleteNumber(id: number, telNumber: string) {
    if (confirm("Do you want to delete the telephone : " + telNumber)) {
      let found = this.modelData.telephoneList.findIndex(x => x.id == id);
      this.modelData.telephoneList.splice(found, 1);
    }
  }

  editNumber(id: number, telNumber: string) {
    let newNumber = prompt("Edit the telephone number", telNumber);
    if (!this.isNullOrUndefined(newNumber) && newNumber != "" && newNumber.length <= 50) {
      let found = this.modelData.telephoneList.findIndex(x => x.id == id);
      this.modelData.telephoneList[found].number = newNumber;
    }
    else if (newNumber.length > 50) {
      alert("The max lenght of the phone number is 50 cheracters...");
    }
  }

  addNumber() {
    let newNumber = prompt("Add a new telephone number", "");
    if (!this.isNullOrUndefined(newNumber) && newNumber != "" && newNumber.length <= 50) {
      let lastIndex = 0;
      let newIndex = 0;
      if (this.modelData.telephoneList && this.modelData.telephoneList.length > 0) {
        lastIndex = this.modelData.telephoneList[this.modelData.telephoneList.length - 1];
        newIndex = lastIndex++;
      }
      else {
        this.modelData.telephoneList = [];
        newIndex = 0;
      }
      let newNumberObj = { id: newIndex, number: newNumber, clientId: this.id };
      this.modelData.telephoneList.push(newNumberObj);
    }
    else if (newNumber.length > 50) {
      alert("The max lenght of the phone number is 50 cheracters...");
    }
  }

} 
