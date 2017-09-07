import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { StompState } from '@stomp/ng2-stompjs';
import { SenderStompService, StompMessageService } from '../../../services';
import { SampleModel, single } from '../../../models';

@Component({
    selector: 'app-socket-sender',
    templateUrl: './socket-sender.component.html',
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
export class SocketSenderComponent implements OnInit, OnDestroy {

    /* Pie Chart Options */
    showLegend              = true;
    showLabels              = true;
    explodeSlices           = false;
    doughnut                = false;
    gradient                = false;
    receiverTitle           = ""
    colorScheme             = {
      domain                : ['#2ecc71', '#e74c3c', '#f1c40f', '#34495e']
    };

    // Subscription status
    public subscribed       : boolean;
    public messageQueue     : SampleModel[];
    public sampleData       = [];
    public state            : Observable<string>;
    public stateTitle       : string;
    private timeMeasurement : any = {};
    
    constructor(
        private senderStompService: SenderStompService, 
        private messageService: StompMessageService) {
        //this.messageService.currentMessage.subscribe(message => this.sampleData = message);
        for (let i = 0; i < 500; i++) {
            this.sampleData.push({ 
                'name': this.randomizeCollection(9, '0123456789abcdefghijklmnopqrstuvwxyz'),
                'name1': this.randomizeCollection(9, '0123456789abcdefghijklmnopqrstuvwxyz'),
                'name2': this.randomizeCollection(9, '0123456789abcdefghijklmnopqrstuvwxyz'),
                'name3': this.randomizeCollection(9, '0123456789abcdefghijklmnopqrstuvwxyz'),
                'name4': this.randomizeCollection(9, '0123456789abcdefghijklmnopqrstuvwxyz')
            })
        }
    }

    private randomizeCollection = (len, chars) => {
        let result = '';
        for(let i = len; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }
        return result;
    }

    ngOnInit() {
        this.subscribed = false; 
        this.state = this.senderStompService.state
            .map((state: number) => {
                this.stateTitle = StompState[state].toString();
                return StompState[state]
            });
        this.onSubcribe(); 
    }
    
    ngOnDestroy() { this.onDisconnect(); }
    
    onSelect(event) { console.log('Selected Chart: ', event); }
    
    onSubcribe(): void { if (this.subscribed) return; }
    
    onDisconnect(): void {
        this.subscribed     = false;

        this.stateTitle === 'CONNECTED' ? this.senderStompService.disconnect() : this.senderStompService;
    }

    /** Consume a message from the _orderStompService */
    public onSendMessage() {
        this.timeMeasurement.start = new Date().getTime();

        this.subscribed = true;

        let blob = new Blob([this.sampleData], { type: 'application/json' });
        this.receiverTitle = this.sampleData.length.toString() + ' (Adet)';

        this.senderStompService.publish(
            '/app/create/createStockListByWebSocket', 
            JSON.stringify(this.sampleData)
        );

        this.timeMeasurement.end = new Date().getTime();
        const delta = this.timeMeasurement.end - this.timeMeasurement.start;

        for(let i = 0; i < single.length; i++) {
            if(single[i].name === 'Boyut(Mb)') {
                const fileSize = blob.size / 1024;
                const size = parseFloat(fileSize.toString()).toFixed(2);
                single[i].value = parseFloat(size);
            }

            if(single[i].name === 'Süre(S)') {
                const second = delta / 1000;
                const time = parseFloat(second.toString()).toFixed(2);
                single[i].value = parseFloat(time);
            }
        }

        Object.assign(this, { single }); 
    }

}