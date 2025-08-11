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


import * as runtime from '../runtime';
import type {
  InlineObject,
  InlineObject1,
  InlineObject2,
  InlineObject3,
  InlineObject4,
  InlineObject5,
  InlineObject6,
  InlineObject7,
  InlineObject8,
  InlineObject9,
  Order,
  OrderDetail,
} from '../models/index';
import {
    InlineObjectFromJSON,
    InlineObjectToJSON,
    InlineObject1FromJSON,
    InlineObject1ToJSON,
    InlineObject2FromJSON,
    InlineObject2ToJSON,
    InlineObject3FromJSON,
    InlineObject3ToJSON,
    InlineObject4FromJSON,
    InlineObject4ToJSON,
    InlineObject5FromJSON,
    InlineObject5ToJSON,
    InlineObject6FromJSON,
    InlineObject6ToJSON,
    InlineObject7FromJSON,
    InlineObject7ToJSON,
    InlineObject8FromJSON,
    InlineObject8ToJSON,
    InlineObject9FromJSON,
    InlineObject9ToJSON,
    OrderFromJSON,
    OrderToJSON,
    OrderDetailFromJSON,
    OrderDetailToJSON,
} from '../models/index';

export interface GetOrderDetailRequest {
    xMcldTenant: string;
    xAPIKey: string;
    id: string;
    xCorrelationId?: string;
    authorization?: string;
}

export interface GetOrdersRequest {
    xMcldTenant: string;
    xApiKey: string;
    xCorrelationId?: string;
    authorization?: string;
}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     * ### Getting started   If you want to try out the API now, try our sandbox by filling out the following information: |Header|Value| |------|-----| |Authorization (Auth/Token)|[Get quick access token here](https://controlhub.mcleodsoftware.com/?action=Sandbox) |X-Api-Key|[Get a trial key here](https://innovationhub.mcleodsoftware.com/apis) |X-Mcld-Tenant|2|  Order Detail returns details of a single order and accepts the order Id parameter. The response retrieves information on a specific order in addition to the latest and historical state of the order. This API allows the customer to access information about the order, shipper, consignee and intermediate stops.  ### Flowchart  ```mermaid flowchart TB   Register --> ViewCatalog((Browse\\n API catalog))   ViewCatalog --> SelectProduct((Choose\\n a product))   SelectProduct --> RequestKey[Request a key]   RequestKey --> HasKey{{Do you already have a product key?}}   HasKey -- Yes --> KeyError>You already possess a key]   HasKey -- No --> GrantKey[Issue a new key]   GrantKey --> UseKey[Use key, send T&T API request for an order\\n with required parameters]   KeyError --> UseKey   UseKey --> ValidRequest{{Is the request valid?}}   ValidRequest -- Yes --> IsValid[Request successful\\n Process requested data, send response with status code 200]   ValidRequest -- No --> IsNotValid[Request unsuccessful\\n Process request, send response with status code 4xx]   IsValid --> SendResponse[Send response]   IsNotValid --> SendResponse
     * Order Detail
     */
    async getOrderDetailRaw(requestParameters: GetOrderDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<OrderDetail>> {
        if (requestParameters['xMcldTenant'] == null) {
            throw new runtime.RequiredError(
                'xMcldTenant',
                'Required parameter "xMcldTenant" was null or undefined when calling getOrderDetail().'
            );
        }

        if (requestParameters['xAPIKey'] == null) {
            throw new runtime.RequiredError(
                'xAPIKey',
                'Required parameter "xAPIKey" was null or undefined when calling getOrderDetail().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling getOrderDetail().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters['xCorrelationId'] != null) {
            headerParameters['X-Correlation-Id'] = String(requestParameters['xCorrelationId']);
        }

        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }

        if (requestParameters['xMcldTenant'] != null) {
            headerParameters['X-Mcld-Tenant'] = String(requestParameters['xMcldTenant']);
        }

        if (requestParameters['xAPIKey'] != null) {
            headerParameters['X-API-Key'] = String(requestParameters['xAPIKey']);
        }


        let urlPath = `/orders/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => OrderDetailFromJSON(jsonValue));
    }

    /**
     * ### Getting started   If you want to try out the API now, try our sandbox by filling out the following information: |Header|Value| |------|-----| |Authorization (Auth/Token)|[Get quick access token here](https://controlhub.mcleodsoftware.com/?action=Sandbox) |X-Api-Key|[Get a trial key here](https://innovationhub.mcleodsoftware.com/apis) |X-Mcld-Tenant|2|  Order Detail returns details of a single order and accepts the order Id parameter. The response retrieves information on a specific order in addition to the latest and historical state of the order. This API allows the customer to access information about the order, shipper, consignee and intermediate stops.  ### Flowchart  ```mermaid flowchart TB   Register --> ViewCatalog((Browse\\n API catalog))   ViewCatalog --> SelectProduct((Choose\\n a product))   SelectProduct --> RequestKey[Request a key]   RequestKey --> HasKey{{Do you already have a product key?}}   HasKey -- Yes --> KeyError>You already possess a key]   HasKey -- No --> GrantKey[Issue a new key]   GrantKey --> UseKey[Use key, send T&T API request for an order\\n with required parameters]   KeyError --> UseKey   UseKey --> ValidRequest{{Is the request valid?}}   ValidRequest -- Yes --> IsValid[Request successful\\n Process requested data, send response with status code 200]   ValidRequest -- No --> IsNotValid[Request unsuccessful\\n Process request, send response with status code 4xx]   IsValid --> SendResponse[Send response]   IsNotValid --> SendResponse
     * Order Detail
     */
    async getOrderDetail(requestParameters: GetOrderDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<OrderDetail> {
        const response = await this.getOrderDetailRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * ### Getting started   If you want to try out the API now, try our sandbox by filling out the following information: |Header|Value| |------|-----| |Authorization (Auth/Token)|[Get quick access token here](https://controlhub.mcleodsoftware.com/?action=Sandbox) |X-Api-Key|[Get a trial key here](https://innovationhub.mcleodsoftware.com/apis) |X-Mcld-Tenant|2|  The Orders List endpoint returns all active orders placed by the customer. The response retrieves a list of all active orders in addition to the latest and historical state of the orders. This API allows the customer to access information about the order, shipper, consignee and intermediate stops.   The OrdersList endpoint now filters results to only include orders scheduled for pick-up within the last 30 days. This is   achieved by looking at the *scheduledArrivalEarly* date provided in the request. The endpoint will only return orders where   the pick-up date falls within the past 30 days relative to the *scheduledArrivalEarly* date specified.<br>     ### Flowchart  ```mermaid flowchart TB   Register --> ViewCatalog((Browse\\n API catalog))   ViewCatalog --> SelectProduct((Choose\\n a product))   SelectProduct --> RequestKey[Request a key]   RequestKey --> HasKey{{Do you already have a product key?}}   HasKey -- Yes --> KeyError>You already possess a key]   HasKey -- No --> GrantKey[Issue a new key]   GrantKey --> UseKey[Use key, send T&T API request for orders list\\n with required parameters]   KeyError --> UseKey   UseKey --> ValidRequest{{Is the request valid?}}   ValidRequest -- Yes --> IsValid[Request successful\\n Process requested data, send response with status code 200]   ValidRequest -- No --> IsNotValid[Request unsuccessful\\n Process request, send response with status code 4xx]   IsValid --> SendResponse[Send response]   IsNotValid --> SendResponse
     * Orders List
     */
    async getOrdersRaw(requestParameters: GetOrdersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Order>>> {
        if (requestParameters['xMcldTenant'] == null) {
            throw new runtime.RequiredError(
                'xMcldTenant',
                'Required parameter "xMcldTenant" was null or undefined when calling getOrders().'
            );
        }

        if (requestParameters['xApiKey'] == null) {
            throw new runtime.RequiredError(
                'xApiKey',
                'Required parameter "xApiKey" was null or undefined when calling getOrders().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters['xCorrelationId'] != null) {
            headerParameters['X-Correlation-Id'] = String(requestParameters['xCorrelationId']);
        }

        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }

        if (requestParameters['xMcldTenant'] != null) {
            headerParameters['X-Mcld-Tenant'] = String(requestParameters['xMcldTenant']);
        }

        if (requestParameters['xApiKey'] != null) {
            headerParameters['X-Api-Key'] = String(requestParameters['xApiKey']);
        }


        let urlPath = `/orders`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(OrderFromJSON));
    }

    /**
     * ### Getting started   If you want to try out the API now, try our sandbox by filling out the following information: |Header|Value| |------|-----| |Authorization (Auth/Token)|[Get quick access token here](https://controlhub.mcleodsoftware.com/?action=Sandbox) |X-Api-Key|[Get a trial key here](https://innovationhub.mcleodsoftware.com/apis) |X-Mcld-Tenant|2|  The Orders List endpoint returns all active orders placed by the customer. The response retrieves a list of all active orders in addition to the latest and historical state of the orders. This API allows the customer to access information about the order, shipper, consignee and intermediate stops.   The OrdersList endpoint now filters results to only include orders scheduled for pick-up within the last 30 days. This is   achieved by looking at the *scheduledArrivalEarly* date provided in the request. The endpoint will only return orders where   the pick-up date falls within the past 30 days relative to the *scheduledArrivalEarly* date specified.<br>     ### Flowchart  ```mermaid flowchart TB   Register --> ViewCatalog((Browse\\n API catalog))   ViewCatalog --> SelectProduct((Choose\\n a product))   SelectProduct --> RequestKey[Request a key]   RequestKey --> HasKey{{Do you already have a product key?}}   HasKey -- Yes --> KeyError>You already possess a key]   HasKey -- No --> GrantKey[Issue a new key]   GrantKey --> UseKey[Use key, send T&T API request for orders list\\n with required parameters]   KeyError --> UseKey   UseKey --> ValidRequest{{Is the request valid?}}   ValidRequest -- Yes --> IsValid[Request successful\\n Process requested data, send response with status code 200]   ValidRequest -- No --> IsNotValid[Request unsuccessful\\n Process request, send response with status code 4xx]   IsValid --> SendResponse[Send response]   IsNotValid --> SendResponse
     * Orders List
     */
    async getOrders(requestParameters: GetOrdersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Order>> {
        const response = await this.getOrdersRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
