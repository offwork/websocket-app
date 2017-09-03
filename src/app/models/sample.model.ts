declare var Object: any;
export interface SampleModelInterFace {
    'id'?: string;
    'name'?: string;
    'name1'?: string;
    'name2'?: string;
    'name3'?: string;
    'name4'?: string;
}

export class SampleModel implements SampleModelInterFace {
    'id'?: string;
    'name'?: string;
    'name1'?: string;
    'name2'?: string;
    'name3'?: string;
    'name4'?: string;

    constructor(data?: SampleModelInterFace) {
        Object.assign(data, this);
    }
}