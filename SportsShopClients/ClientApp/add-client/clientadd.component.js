"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
require("rxjs/Rx");
var clientAddComponent = /** @class */ (function () {
    function clientAddComponent(_avRoute, http, _router, baseUrl) {
        this._avRoute = _avRoute;
        this.http = http;
        this._router = _router;
        this.title = 'Create';
        this.modelData = {};
        this.myAppUrl = "";
        this.id = 0;
        this.myAppUrl = baseUrl;
        if (this._avRoute.snapshot.params["id"]) {
            this.id = this._avRoute.snapshot.params["id"];
        }
    }
    clientAddComponent.prototype.ngOnInit = function () {
        if (this.id > 0) {
            this.title = "Edit";
            var self_1 = this;
            var headers = new http_1.Headers();
            headers.append('Content-Type', 'application/json; charset=utf-8');
            this.http.get(this.myAppUrl + "api/Clients/" + this.id, { headers: headers })
                .subscribe(function (res) {
                self_1.modelData = JSON.parse(res['_body']);
            });
        }
    };
    clientAddComponent.prototype.save = function () {
        if (this.validateData()) {
            var self_2 = this;
            var headers = new http_1.Headers();
            headers.append('Content-Type', 'application/json; charset=utf-8');
            if (this.title == "Create") {
                this.http.post(this.myAppUrl + "api/Clients/", this.modelData, { headers: headers })
                    .subscribe(function (res) {
                    self_2._router.navigate(['/client-list']);
                });
            }
            if (this.title == "Edit") {
                this.http.put(this.myAppUrl + "api/Clients/" + this.id, this.modelData, { headers: headers })
                    .subscribe(function (res) {
                    self_2._router.navigate(['/client-list']);
                });
            }
        }
    };
    clientAddComponent.prototype.validateData = function () {
        var status = true;
        var strMessage = '';
        var emailExp = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
        var cepExp = new RegExp(/[0-9]{2}-[0-9]{3}-[0-9]{3}/);
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
    };
    clientAddComponent.prototype.isNullOrUndefined = function (data) {
        return this.isUndefined(data) || this.isNull(data);
    };
    clientAddComponent.prototype.isUndefined = function (data) {
        return typeof (data) === "undefined";
    };
    clientAddComponent.prototype.isNull = function (data) {
        return data === null;
    };
    clientAddComponent.prototype.cancel = function () {
        this._router.navigate(['/client-list']);
    };
    clientAddComponent.prototype.deleteNumber = function (id, telNumber) {
        if (confirm("Do you want to delete the telephone : " + telNumber)) {
            var found = this.modelData.telephoneList.findIndex(function (x) { return x.id == id; });
            this.modelData.telephoneList.splice(found, 1);
        }
    };
    clientAddComponent.prototype.editNumber = function (id, telNumber) {
        var newNumber = prompt("Edit the telephone number", telNumber);
        if (!this.isNullOrUndefined(newNumber) && newNumber != "" && newNumber.length <= 50) {
            var found = this.modelData.telephoneList.findIndex(function (x) { return x.id == id; });
            this.modelData.telephoneList[found].number = newNumber;
        }
        else if (newNumber.length > 50) {
            alert("The max lenght of the phone number is 50 cheracters...");
        }
    };
    clientAddComponent.prototype.addNumber = function () {
        var newNumber = prompt("Add a new telephone number", "");
        if (!this.isNullOrUndefined(newNumber) && newNumber != "" && newNumber.length <= 50) {
            var lastIndex = 0;
            var newIndex = 0;
            if (this.modelData.telephoneList && this.modelData.telephoneList.length > 0) {
                lastIndex = this.modelData.telephoneList[this.modelData.telephoneList.length - 1];
                newIndex = lastIndex++;
            }
            else {
                this.modelData.telephoneList = [];
                newIndex = 0;
            }
            var newNumberObj = { id: newIndex, number: newNumber, clientId: this.id };
            this.modelData.telephoneList.push(newNumberObj);
        }
        else if (newNumber.length > 50) {
            alert("The max lenght of the phone number is 50 cheracters...");
        }
    };
    clientAddComponent = __decorate([
        core_1.Component({
            selector: 'client-add',
            templateUrl: './clientadd.component.html'
        }),
        __param(3, core_1.Inject('BASE_URL'))
    ], clientAddComponent);
    return clientAddComponent;
}());
exports.clientAddComponent = clientAddComponent;
//# sourceMappingURL=clientadd.component.js.map