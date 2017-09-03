import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { SampleModel } from '../models/sample.model';

export const BASE_URL = 'http://www.mocky.io/v2/';

@Injectable()
export class RestAPIServices {
    constructor(private http: Http) {}

    getAllData(): Observable<SampleModel[]> {
        return this.http
            .get(`${BASE_URL}59abd1641000006306f9c1ce`) /** <<-- rest/api/stocks */
            .map(response => response.json())
            .do(() => console.log('Rest Service Get All Data!'))
            .catch(this.getRequestError);
    }

    sendAllData(data) {
        const header = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: header});

        return this.http
            .post(`${BASE_URL}59ac3218100000550cf9c242`, data, options);
    }

    private getRequestError(error: any) {
        return Observable.throw(new Error(error || 'Unknowledge Server Error!!'));
    }
}
