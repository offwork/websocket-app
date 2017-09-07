import { Component } from '@angular/core';
import { SampleModel, single } from '../../../models';
import { RestAPIServices } from '../../../services';

@Component({
    selector: 'app-rest-sender',
    templateUrl: './rest-sender.component.html',
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
export class RestSenderComponent {

    sampleData      = [];
    isDisplay       = false;
    /* Pie Chart Options */
    showLegend      = true;
    showLabels      = true;
    explodeSlices   = false;
    doughnut        = false;
    gradient        = false;
    receiverTitle   = ""
    colorScheme     = {
      domain        : ['#2ecc71', '#e74c3c', '#f1c40f', '#34495e']
    };

    constructor(private service: RestAPIServices) {
        //this.service.getAllData().subscribe(data => this.sampleData = data);
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

    onSelect(event) {
        console.log(event);
    }

    sendAllData() {
        let blob: Blob;
        let timeMeasurement: any = {};
        timeMeasurement.start = new Date().getTime();

        this.service.sendAllData(this.sampleData)
            .subscribe(
                response => {
                    length = this.sampleData.length;
                    blob = new Blob([this.sampleData], { type: 'application/json' });
                },
                error => {console.log('an error has occurred!!');},
                () => {
                    timeMeasurement.end = new Date().getTime();
                    const delta = timeMeasurement.end - timeMeasurement.start;

                    for(let i = 0; i < single.length; i++) {
                        if(single[i].name === 'Boyut(Mb)') {
                            const fileSize = blob.size / 1024;
                            const size = parseFloat(fileSize.toString()).toFixed(2);
                            single[i].value = parseFloat(size);
                        }

                        if(single[i].name === 'Süre(S)') {
                            const second = delta / 1000;
                            const time = parseFloat(second.toString()).toFixed(2);
                            console.log('Time:', time);
                            single[i].value = parseFloat(time);
                        }
                    }
                    this.isDisplay = true;
                    Object.assign(this, { single });
                }
        );
    }
}
