import { Component } from '@angular/core';
import { SampleModel, single } from '../../../models';
import { RestAPIServices } from '../../../services';

@Component({
    selector: 'app-rest-recipient',
    templateUrl: './rest-recipient.component.html',
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
export class RestRecipientComponent {
    
    restData        : SampleModel[];
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

    constructor(private service: RestAPIServices) { }

    onSelect(event) {
        console.log(event);
    }

    getAllData() {
        let blob: Blob;
        let timeMeasurement: any = {};
        timeMeasurement.start = new Date().getTime();
        
        this.service.getAllData()
            .subscribe(
                response => {
                    this.receiverTitle = response.length.toString() + ' (Adet)';
                    this.restData = response;
                    blob = new Blob([this.restData], { type: 'application/json' });
                    console.log('Response: ', this.restData);
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
