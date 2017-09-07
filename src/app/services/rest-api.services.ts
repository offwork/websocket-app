import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { SampleModel } from '../models/sample.model';

export const BASE_URL = 'http://192.168.0.103:8080/';
export const SECOND_URL = 'http://192.168.0.110:8080/';

@Injectable()
export class RestAPIServices {
    constructor(private http: Http) {}

    getAllData(): Observable<SampleModel[]> {
        return this.http
            .get(`${BASE_URL}rest/api/stocks`) /** <<-- rest/api/stocks */
            .map(response => response.json())
            .do(() => console.log('Rest Service Get All Data!'))
            .catch(this.getRequestError);
    }

    sendAllData(data) {
        const header = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: header});

        return this.http
            .post(`${SECOND_URL}rest/api/create/stock`, data, options);
    }

    private getRequestError(error: any) {
        return Observable.throw(new Error(error || 'Unknowledge Server Error!!'));
    }
}
