import requestApi, {actions, methods} from "./index";
import {clone, getInit, log, map} from "../functions";
import {store} from "../../App";
import {STATUS} from "../static";

export const putSettings = (settingid: string, settingdata: any, convertToKeyValue?: boolean) => {
    if (convertToKeyValue) {
        let data = clone(settingdata);
        settingdata = [];
        map(data, function (key: any, value: any) {
            settingdata.push({key: key, value: value});
        });
    }
    return requestApi({
        method: methods.put,
        action: actions.settings,
        body: {settingid, settingdata},
        showlog: true
    })
}

export const getPrintingTemplate = () => requestApi({
    method: methods.get,
    action: actions.printingtemplate,
    showlog: false
})

export const getEmailTemplate = () => requestApi({
    method: methods.get,
    action: actions.emailtemplate,
    showlog: false
})

export const getNotificationTemplate = () => requestApi({
    method: methods.get,
    action: actions.notificationtemplate,
    showlog: false
})

export const deleteSettings = (settingid: any, settingkey: any, callback: any, settingnode?: any, bodydata?: any) => {

    let body: any = {settingid, settingkey}
    if (settingnode) {
        body = {
            ...body,
            settingnode
        }
    }
    if (bodydata) {
        body = {
            ...body,
            ...bodydata
        }
    }

    requestApi({
        method: methods.delete,
        action: actions.settings,
        body,
        showlog: true
    }).then((result) => {
        callback(result)
    })
};

export const getCurrencyRate = (currency: any) => requestApi({
    method: methods.get,
    action: actions.currency,
    showlog: false,
    queryString: {currency}
})

export const getPaymentGateway = () => requestApi({
    method: methods.get,
    action: actions.paymentgateway,
    queryString: {customgateway: 1},
    showlog: true
})

export const getTaxRegType = (country: any) => requestApi({
    method: methods.get,
    action: actions.gettaxregtype,
    queryString: {country},
    showlog: true
})

export const getNextVoucherNumber = (vouchertypeid: any) => requestApi({
    method: methods.get,
    action: actions.settings,
    queryString: {getautoincrement: 1, vouchertype: vouchertypeid},
    showlog: true
})


export const putTickets = (tickettypeid: any, data: any) => {
    return new Promise((resolve, reject) => {
        const ticketsList = store.getState().appApiData.settings.tickets
        ticketsList[tickettypeid] = data
        let postData: any = {};
        Object.values(ticketsList).map(({tickettypeid, voucherlink, ...data}: any) => [
            postData[tickettypeid] = {tickettypeid, ...data}
        ])
        putSettings("tickets", postData, true).then((result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, () => resolve({status: result.status}), "form", true)
            } else {
                reject();
            }
        })
    })
}
