import { Component } from '@angular/core';
import { SampleModel } from '../../../models/sample.model';
import { single } from '../../../models/chart-info.model';
import { RestAPIServices } from '../../../services/rest-api.services';

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

    isDisplay       = false;
    // Advanced Pie Chart
    showLegend      = true;
    gradient        = false;
    showLabels      = true;
    explodeSlices   = false;
    doughnut        = false;
    colorScheme     = {
      domain        : ['#2ecc71', '#e74c3c', '#f1c40f', '#34495e']
    };

    sampleData: SampleModel[];

    constructor(private service: RestAPIServices) {
        this.service.getAllData().subscribe(data => this.sampleData = data);
    }

    onSelect(event) {
        console.log(event);
    }

    sendAllData() {
        let blob: Blob;
        let length: number;
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
                    this.isDisplay = true
                    Object.assign(this, { single });
                }
        );
    }
}
