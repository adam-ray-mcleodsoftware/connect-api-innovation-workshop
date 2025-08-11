/* tslint:disable */
/* eslint-disable */
/**
 * Track and Trace
 * ### Getting started   If you want to try out the API now, try our sandbox by filling out the following information: |Header|Value| |------|-----| |Authorization (Auth/Token)|[Get quick access token here](https://controlhub.mcleodsoftware.com/?action=Sandbox) |X-Api-Key|[Get a trial key here](https://innovationhub.mcleodsoftware.com/apis) |X-Mcld-Tenant|2|  The Tracking component of McLeod software provides a reliable way for McLeod customers such as carriers, brokers, 3PLs, shippers, and consignees to monitor the movement of a order in real-time using GPS location.    The Tracing component helps investigate the path of a package through the life cycle of the order.   Track and Trace helps improve efficiency, deliver tracking updates and notifications along the path of the order, create transparency, reduce costs, and provide quality customer experience.  ### The Track and Trace API And its End Points  The Track and Trace API retrieves a list of all active orders or information on a specific order in addition to the latest and historical state of the order(s). This API allows the customer to access information about the order, shipper, consignee and intermediate stops.  The Track and Trace API has two endpoints: Orders List and Order Detail.   The Orders List returns all active orders placed in the past 30 days and Order Detail returns details of a single order and accepts the Order Id parameter.   ### Reasons to use the Track and Trace API: 1. Track/ monitor the progress of an order in real-time.  2. Track orders 24/7, throughout the year. 3. Investigate the path of a shipment through the life cycle of the order, from order dispatch to delivery. 4. Improve transportation, fleet and inventory management processes. 5. Send up-to-date shipping information, including minute details like miles to destination, to the customers via email or alerts.  6. Reduce errors that may occur due to manual data entry/ collection. 7. Clients can use the response from this API and develop custom web applications as per their requirements. 8. Eliminate the need for the traditional and cumbersome proof of delivery by using the shipping status information from the response.  ## Getting Started  You can get started immediately by registering an Innovation Hub account and requesting a trial key.   ### Registering an account To create an account, go to: https://innovationhub.mcleodsoftware.com/register/ and click on “Register an account” button.   The account registration process is simple and needs basic information such as email address, company name.  ### Requesting a key To request a key, go to: https://innovationhub.mcleodsoftware.com/apis and click on “Get a trial key” button under the API that you are interested in.  Please take note of the trail key and keep it safe.  The trial key expires in 7 days.  ### Example call This is an example call to track and trace an order https://api.mcleodsoftware.com/trackandtrace-sandbox/orders  ### Example response This is a sample response of the Track and Trace API call: ```json   { \"items\":      [       {         \"consigneeReferenceNumber\": \"12239\",         \"status\": \"Available\",                     \"orderId\": \"0251897\\\",         \"shipmentId\": null,         \"billToCustomerCode\": \"AAAKMO\",         \"linehaul\": {                           \"amount\": 1150.0,           \"conversionDate\": null,           \"currencyCode\": \"USD\",           \"conversionRate\": 1.0,           \"baseAmount\": 1150.0                     },         \"shipperStop\": {           \"city\": \"SAINT ALBANS\",           \"state\": \"VT\",           \"postalCode\": \"05478\",           \"latitude\": 44.8108,           \"longitude\": -73.0831,           \"eta\": null,           \"scheduledArrivalEarly\": \"2023-04-05T09:39Z\",           \"scheduledArrivalLate\": null,           \"actualArrivalEarly\": null,           \"actualArrivalLate\": null         },         \"consigneeStop\": {           \"city\": \"BLUFFTON\",           \"state\": \"IN\",           \"postalCode\": \"46714\",           \"latitude\": 40.7389,           \"longitude\": -85.1722,           \"eta\": null,           \"scheduledArrivalEarly\": \"2023-04-29T14:06Z\",           \"scheduledArrivalLate\": null,           \"actualArrivalEarly\": null,           \"actualArrivalLate\": null         },         \"intermediateStops\": [           {             \"city\": \"DOWAGIAC\",             \"state\": \"MI\",             \"postalCode\": \"49047\",             \"latitude\": 41.9842,             \"longitude\": -86.1086,             \"eta\": null,             \"scheduledArrivalEarly\": \"2023-04-20T14:06Z\",             \"scheduledArrivalLate\": null,             \"actualArrivalEarly\": null,             \"actualArrivalLate\": null           }                     ]       }     ]   } ```
 *
 * The version of the OpenAPI document: 0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface MultiCurrency
 */
export interface MultiCurrency {
    /**
     * The average linehaul amount for this lane.
     * @type {number}
     * @memberof MultiCurrency
     */
    amount?: number;
    /**
     * 3-letter code to identify the currency.
     * @type {string}
     * @memberof MultiCurrency
     */
    currencyCode?: string;
}

/**
 * Check if a given object implements the MultiCurrency interface.
 */
export function instanceOfMultiCurrency(value: object): value is MultiCurrency {
    return true;
}

export function MultiCurrencyFromJSON(json: any): MultiCurrency {
    return MultiCurrencyFromJSONTyped(json, false);
}

export function MultiCurrencyFromJSONTyped(json: any, ignoreDiscriminator: boolean): MultiCurrency {
    if (json == null) {
        return json;
    }
    return {
        
        'amount': json['amount'] == null ? undefined : json['amount'],
        'currencyCode': json['currencyCode'] == null ? undefined : json['currencyCode'],
    };
}

export function MultiCurrencyToJSON(json: any): MultiCurrency {
    return MultiCurrencyToJSONTyped(json, false);
}

export function MultiCurrencyToJSONTyped(value?: MultiCurrency | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'amount': value['amount'],
        'currencyCode': value['currencyCode'],
    };
}

