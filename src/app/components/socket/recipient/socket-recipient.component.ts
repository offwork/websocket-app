import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { StompService } from 'ng2-stomp-service';

import { SampleModel } from '../../../models/sample.model';
import { single } from '../../../models/chart-info.model';

@Component({
    selector: 'app-socket-recipient',
    templateUrl: './socket-recipient.component.html',
    styles: [`
        .chart-content {
            background: ghostwhite;
            border: 1px solid rgba(0, 0, 0, 0.2);
        }
        .avatar-font-size {
            font-size: 40px;
        }
    `]
})
export class SocketRecipientComponent {

    // Advanced Pie Chart
    showLegend      = true;
    gradient        = false;
    showLabels      = true;
    explodeSlices   = false;
    doughnut        = false;
    colorScheme     = {
      domain        : ['#2ecc71', '#e74c3c', '#f1c40f', '#34495e']
    };

    // Subscription status
    public subscribed: boolean;
    private subscription: any;
    private timeMeasurement: any = {};
    
    constructor(private stomp: StompService) {
        this.stomp.configure({
            host:'http://192.168.0.103:8080/register',
            debug:true,
            queue:{'init':false}
        });
    }

    onSelect(event) {
        console.log(event);
    }

    onSubcribe(): void {
        this.stomp.startConnect().then(() => {
            this.stomp.done('init');            
            this.timeMeasurement.start = new Date().getTime();
            this.subscription = this.stomp.subscribe('/app/stocks', this.response);
            this.subscribed = true;
        });
    }

    onUnsubcribe(): void {
        this.stomp.disconnect().then(() => {
            //this.subscription.unsubscribe();
            this.subscribed = false;
        });
    }

    //response
    public response = (data) => {
        console.log('Get All Data!');
        let blob = new Blob([data], { type: 'application/json' });
        let length = data.length;
        this.timeMeasurement.end = new Date().getTime();
        const delta = this.timeMeasurement.end - this.timeMeasurement.start;
        
        for(let i = 0; i < single.length; i++) {
            if(single[i].name === 'Toplam(adet)') {
                single[i].value = length;
            }

            if(single[i].name === 'Boyut(Kb)') {
                single[i].value = blob.size;
            }

            if(single[i].name === 'Süre(ms)') {
                single[i].value = delta;
            }
        }
        
        Object.assign(this, { single }); 
    }
}
