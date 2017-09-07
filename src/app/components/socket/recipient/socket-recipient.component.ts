import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Message } from '@stomp/stompjs';
import { StompState } from '@stomp/ng2-stompjs';
import { ReceiverStompService, StompMessageService } from '../../../services';
import { SampleModel, single } from '../../../models';

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
export class SocketRecipientComponent implements OnInit, OnDestroy {

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
    // Stream of messages
    private subscription    : Subscription;
    public messages         : Observable<Message>;
    // Subscription status
    public subscribed       : boolean;
    // Array of historic message (bodies)
    public messageQueue     : SampleModel[];
    // A count of messages received
    public messageCount     = 0;
    public state            : Observable<string>;
    public stateTitle       : string;
    private timeMeasurement : any = {};
    
    constructor(
        private receiverStompService: ReceiverStompService, 
        private messageService: StompMessageService) {}

    ngOnInit() {
        this.subscribed = false;
        this.state = this.receiverStompService.state
            .map((state: number) => {
                this.stateTitle = StompState[state].toString();
                return StompState[state]
            });
    }

    ngOnDestroy() { this.onUnsubcribe(); }

    onSelect(event) { console.log('Selected Chart: ', event); }

    onSubcribe(): void {
        if (this.subscribed) return;
        
        this.timeMeasurement.start = new Date().getTime();
        
        // Stream of messages
        this.messages = this.receiverStompService.subscribe('/app/stocks');

        // Subscribe a function to be run on_next message
        this.subscription = this.messages.subscribe(this.on_next);
    }

    onUnsubcribe(): void {
        if ( !this.subscribed ) return;
        // This will internally unsubscribe from Stomp Broker
        // There are two subscriptions - one created explicitly, the other created in the template by use of 'async'
        this.subscription.unsubscribe();
        this.subscription   = null;
        this.messages       = null;
        this.subscribed     = false;
    }

    /** Consume a message from the _orderStompService */
    public on_next = (message: Message) => {
        this.subscribed = true;
        // Store message in "historic messages" queue
        this.messageQueue = JSON.parse(message.body);

        let blob = new Blob([this.messageQueue], { type: 'application/json' });
        this.receiverTitle = this.messageQueue.length.toString() + ' (Adet)';

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

        // send message
        this.messageService.changeMessage(message.body);
    }

    private zeroFill(num, len) {
        return (len > num.toString().length)?((Array(len).join('0') + num).slice(-len)):num;
    }
}
