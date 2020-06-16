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
var FetchClientComponent = /** @class */ (function () {
    function FetchClientComponent(http, _router, baseUrl) {
        this.http = http;
        this._router = _router;
        this.clientList = [];
        this.myAppUrl = "";
        this.myAppUrl = baseUrl;
        this.getProductList();
    }
    FetchClientComponent.prototype.getProductList = function () {
        var self = this;
        this.http.request(this.myAppUrl + '/api/Clients')
            .subscribe(function (res) {
            self.clientList = JSON.parse(res['_body']);
            self.clientList.map(function (item) {
                var numbers = item['telephoneList'].map(function (tel) {
                    return tel['number'];
                });
                item['numberList'] = numbers.toString();
            });
        });
    };
    FetchClientComponent.prototype.delete = function (clientId, name) {
        if (confirm("Do you want to delete Client : " + name)) {
            var self_1 = this;
            var headers = new http_1.Headers();
            headers.append('Content-Type', 'application/json; charset=utf-8');
            this.http.delete(this.myAppUrl + "api/Clients/" + clientId, { headers: headers })
                .subscribe(function (res) {
                self_1.getProductList();
            });
        }
    };
    FetchClientComponent = __decorate([
        core_1.Component({
            selector: 'app-fetch-client',
            templateUrl: './fetch-client.component.html'
        }),
        __param(2, core_1.Inject('BASE_URL'))
    ], FetchClientComponent);
    return FetchClientComponent;
}());
exports.FetchClientComponent = FetchClientComponent;
//# sourceMappingURL=fetch-client.component.js.map