import {store} from "../../App";
import {methods} from "./methods";
import {actions} from "./actions";
import {DEFAULT_MESSAGE, ERROR, SUCCESS} from "./status";
import {apiUrl, auth, current, defaultvalues, isDevelopment} from "../setting";
import {setAlert, setLoader} from "../Store/actions/components";
import {logout} from "../Store/actions/authentication";
import {errorAlert, log, loginUser, logoutUser, notifyMe, setAppType} from "../functions";
import React from "react";
import {Alert} from "react-native";


const requestApi = async ({
                              method,
                              action,
                              queryString,
                              body,
                              other,
                              companyname,
                              loader = true,
                              loadertype = 'activity',
                              abort = false,
                              alert = true,
                              successalert = true,
                              erroralert = true,
                              showlog = false,
                              doNotReplaceProtocol=false
                          }: any) => {


    const {authentication, appApiData}: any = store.getState();

    let requestparams = {
        method,
        action,
        queryString,
        body,
        other,
        companyname,
        loader,
        loadertype,
        abort,
        alert,
        successalert,
        erroralert,
        showlog
    };

    const responseJson: any = {};
    const isMethod: any = method in methods;

    let token = auth.token && auth.token;

    if (!defaultvalues.internetconnection) {
        store.dispatch(setAlert({
            message: 'No internet connections are available',
            variant: 'error',
            visible: true
        }));
        return
    }

    if (!isMethod ) {
        let msg = "Set ";
        if (!isMethod) {
            msg += "method"
        }
        if (!action || !action.trim()) {
            if (msg) {
                msg += " and "
            }
            msg += "action";
        }
        responseJson.status = ERROR;
        responseJson.msg = msg;

        return responseJson;
    }

    const company = companyname   || current.company || (appApiData && appApiData.companydetails && appApiData.companydetails.current)

    let url = other && other.url ? other.url : apiUrl(company);

    if (action) {
        url += `${action}`;
    }

    if (queryString) {
        url += jsonToQueryString(queryString);
    }

    let headers: any = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'x-workspace': companyname   || current.company || (appApiData && appApiData.companydetails && appApiData.companydetails.current)
    };

    if (other && other.token) {
        token = other.token;
    }

    if (token) {
        headers = {
            ...headers,
            'Authorization': 'Bearer ' + token,
        };
    }


    const init: any = {
        method,
        headers: new Headers(headers),
        //signal
    };

    if (body) {
        log('init.body',body)
        if (doNotReplaceProtocol){
            init.body = JSON.stringify(body);
        }   else {
            init.body = JSON.stringify(body).replace('http://', '').replace('https://', '');
        }
    }

    loader && store.dispatch(setLoader({
        show: loader,
        type: loadertype
    }));


    console.log("url", url)

    return fetchData({url, init, requestparams, loader})

};


const fetchData: any = ({url, init, requestparams, loader}: any) => {

    const {showlog, successalert, alert, erroralert, other}: any = requestparams


    return new Promise<any>(((resolve, reject) => {

        fetch(url, init)
            .then((result) => {
                return result.json()
            })
            .then(async (data) => {

                loader && store.dispatch(setLoader({
                    show: false
                }));

                if (isDevelopment && showlog) {
                    log({request_url: url, payload: init, response_data: data});
                }

                let message = data.message;

                /////// update new token
                /*if(data?.token && auth.token !== data.token){
                    await updateToken(data.token).then( async (data:any)=>{
                        log('3')
                    });
                }*/

                if (data.code === 401) {
                    auth.token = '';
                    await loginUser().then(async (loginstatus: any) => {
                        if (loginstatus) {
                            notifyMe(true).then();
                            return requestApi(requestparams).then((data: any) => {
                                resolve(data)
                            })
                        }
                    });
                }
                // STATUS 401 AND 402 NOT SHOW ALERT
                if (data.status === ERROR && data.code !== 401 && data.code !== 402) {
                    Alert.alert(
                        "Opps",
                        message,
                        [
                            {
                                text: "OK", onPress: () => {
                                }
                            }
                        ]
                    );
                } else if (message && data.status === SUCCESS && alert && successalert) {
                    store.dispatch(setAlert({
                        message: message,
                        variant: data.status,
                        visible: true
                    }));
                }

                if (data.code === 403) {
                    if (other && !other.fromlogin) {
                        setAppType("account").then(() => {})
                        logoutUser()
                    }
                }
                log("data", data)
                resolve(data);

            })
            .catch((error) => {
                reject()
                log("REQUEST", error)
                store.dispatch(setLoader({
                    show: false
                }));

            })

    }))

};


const requestApiPrint = async ({body, loader = true}: any) => {

    const {
        appApiData: {
            serversettings: {
                printerutilityip
            }
        }
    }: any = store.getState();

    const responseJson: any = {};

    let url: any = `http://${printerutilityip}:8080/`;

    const init: any = {
        "method": "POST",
    };

    if (body) {
        init.body = JSON.stringify(body);
    }

    store.dispatch(setLoader({
        show: loader,
    }));

    return fetch(url, init)
        .then((result) => result.json())
        .then((data) => {

            store.dispatch(setLoader({
                show: false
            }));

            if (isDevelopment) {
                console.log(
                    "==========",
                    "\napi url : ", url,
                    "\nbody : ", JSON.stringify(body),
                    "\nresponse : ", data,
                    "\n=========="
                );
            }
            let callback: any = '';
            let message = data.message;
            if (data.code === 401) {
                setAppType("account").then(() => {
                })
                store.dispatch(logout());
            }
            callback = data;
            if (message) {
                store.dispatch(setAlert({
                    message: message,
                    variant: data.status,
                    visible: true
                }));
            }


            return callback;
        })
        .catch((error) => {


            store.dispatch(setLoader({
                show: false
            }));
            if (isDevelopment) {
                console.log("catch", error);
                console.log('catch : ', error.message, error);
            }
            responseJson.title = "Printer utility not responding";
            responseJson.status = ERROR;
            responseJson.msg = "Printer utility not responding";

            errorAlert(responseJson.msg);
            return responseJson
        })
};

const jsonToQueryString = (json: any) => {
    if (!json) {
        return undefined;
    }
    return '?' + Object.keys(json).map((key) => {
        return `${key}=${json[key]}`
    }).join('&');
};

const queryStringToJson = (string: any) => {

    if (string) {
        var pairs = string.slice(1).split('&');

        var result: any = {};
        pairs.forEach(function (pair: any) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });

        return JSON.parse(JSON.stringify(result));
    }
    return false
};

export {
    methods,
    actions,
    ERROR,
    SUCCESS,
    DEFAULT_MESSAGE,
    jsonToQueryString,
    queryStringToJson,
    requestApiPrint
};

export default requestApi;
