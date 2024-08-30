export class Measure {
    measure_uuid: string;
    customer_code: string;
    measure_datetime: Date;
    measure_type: string;
    description: string;
    image: string;
    measure_value: number;

    constructor(
        measure_uuid: string,
        customer_code: string,
        measure_datetime: Date,
        measure_type: string,
        description: string,
        image: string,
        measure_value: number
    ) {
        this.measure_uuid = measure_uuid;
        this.customer_code = customer_code;
        this.measure_datetime = measure_datetime;
        this.measure_type = measure_type;
        this.description = description;
        this.image = image;
        this.measure_value = measure_value
    }
}