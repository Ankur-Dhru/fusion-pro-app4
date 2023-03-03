import {store} from '../App';
import {setDialog, setLoader} from './Store/actions/components';
import {
    setClients,
    setCompany,
    setConnection,
    setContacts,
    setFavouriteClients,
    setFavouriteVendors,
    setItems,
    setNotify,
    setSettings,
    setVendors
} from "./Store/actions/appApiData";
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import {render} from 'react-dom';
import moment from 'moment';
import requestApi, {actions, methods, SUCCESS} from "./ServerRequest";
import {callingcode, currencylist, FILTERED_VOUCHER, STATUS} from "./static";
import {logout} from "./Store/actions/authentication";

import {Alert, PermissionsAndroid, Platform, Text} from "react-native";

import NetInfo from "@react-native-community/netinfo";
import React from "react";
import Contacts from "react-native-contacts";
import {auth, current, defaultvalues, loginUrl, nav, spotlight, voucher} from "./setting";
import {CommonActions} from "@react-navigation/native";
import RNFetchBlob from "rn-fetch-blob";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNPrint from "react-native-print";
import Share from "react-native-share";
import {regExpJson2} from "./validation";
import {decode} from 'html-entities';

import { NumericFormat  } from 'react-number-format';
const getSymbolFromCurrency = require('currency-symbol-map')
let base64 = require('base-64');
let utf8 = require('utf8');

export const STORE_KEY_SPOTLIGHT = "spotlight";

export const log = (text: any, text2?: any, text3?: any) => {
    console.log('mylog', text, text2 ? text2 : '', text3 ? text3 : '');
}
export const log2 = (text: any, text2?: any, text3?: any) => {
    //console.log('mylog',text,text2?text2:'',text3?text3:'');
}

export const bootstrap = () => {
    return requestApi({
        method: methods.get,
        action: actions.bootstrap
    })
}

export const errorAlert = (message: any, title?: any) => {
    Alert.alert(
        title || "Opps",
        message,
        [
            {text: "OK"}
        ]
    );
}

/*export const setModel = () > {

}*/

export const getInit = (companydetail?: any, navigation?: any, locationid?: any, callback?: any, loadertype?: any, showCallbackLoader?: boolean) => {




    try{

            if(Boolean(navigation)) {
                navigation?.closeDrawer();
            }

            if (!Boolean(companydetail)) {
                companydetail = store.getState().appApiData.companydetails
            }

            let currentuser: any = current.user;
            let company: any = current.company;

            if (Boolean(current?.locationid) && !Boolean(locationid)) {
                locationid = current?.locationid
            }



            if (Boolean(company) && companydetail.token !== 'logout') {
                requestApi({
                    method: methods.get,
                    action: actions.init,
                    companyname: company,
                    queryString: {stream: Platform.OS, device_token: auth.device_token}, //device_token:auth.device_token
                    loader: true,
                    showlog: true,
                    loadertype: loadertype || 'clientarea',
                }).then((result) => {

                    companydetail.currentuser = currentuser;
                    companydetail.current = company;

                    if (showCallbackLoader) {
                        store.dispatch(setLoader({
                            show: true,
                            type: loadertype
                        }));
                    }


                    if (result.status === SUCCESS) {

                        let defaultlocation = Boolean(locationid) ? locationid : result.data?.user?.settings?.defaultlocation;
                        let defaultcurrency = findObject(objectToArray(result.data?.currency), 'rate', '1');

                        auth.license_token = result.license_token;
                        companydetail.license_token = auth.license_token;
                        companydetail.adminid = result.data?.user?.adminid;

                        if (currentuser) {
                            companydetail.companies[currentuser] = {
                                ...companydetail.companies[currentuser],
                                locationid: defaultlocation,
                                adminid: companydetail.adminid,
                                locations: result.data.location,
                                defaultcurrency: defaultcurrency[0],
                                firstname: companydetail.firstname,
                                lastname: companydetail.lastname,
                                init: result.data
                            }
                        }

                    }

                    storeData('fusion-pro-app', companydetail).then((r: any) => {


                        store.dispatch(setCompany({companydetails: companydetail}));

                        const {clients, vendors}: any = companydetail.companies[currentuser];

                        if (result?.status === SUCCESS) {

                            if (result?.data.systemsetup) {

                                nav.navigation.navigate('OrganizationProfile', {
                                    screen: 'OrganizationProfile',
                                });
                                if (showCallbackLoader) {
                                    store.dispatch(setLoader({
                                        show: false
                                    }));
                                }

                                return callback(false);
                            }

                            store.dispatch(setSettings(result.data));

                            store.dispatch(setFavouriteClients(clients));
                            store.dispatch(setFavouriteVendors(vendors));

                            store.dispatch(setItems(''));
                            store.dispatch(setVendors(''));
                            store.dispatch(setClients(''));

                            if (showCallbackLoader) {
                                store.dispatch(setLoader({
                                    show: false
                                }));
                            }
                            return callback(true);
                        } else {
                            if (showCallbackLoader) {
                                store.dispatch(setLoader({
                                    show: false
                                }));
                            }
                            callback(false);
                        }
                    });


                });
            }

            if (companydetail.token === 'logout') {
                store.dispatch(logout());
                navigation.navigate('LoginStack', {
                    screen: 'LoginStack',
                });
            }

    }
    catch (e) {
        log('e',e)
    }

}

export const updateToken = async (token: any) => {
    return new Promise<any>(((resolve, reject) => {
        retrieveData('fusion-pro-app').then((companydetail) => {
            companydetail.token = token;
            auth.token = token;
            storeData('fusion-pro-app', companydetail).then((r: any) => {
                store.dispatch(setCompany({companydetails: companydetail}));
                resolve(token)
            });
        })
    }))
}

export const logoutUser = () => {
    try{
        store.dispatch(logout());
        retrieveData('fusion-pro-app').then((companydetail) => {
            companydetail.token = 'logout';
            storeData('fusion-pro-app', companydetail).then((r: any) => {
                store.dispatch(setCompany({companydetails: companydetail}));


                Boolean(nav) && nav.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {name: 'LoginStack'},
                        ],
                    })
                );
            });
        })
    }
    catch (e) {
        log('e',e)
    }
}

export const loginUser = async (email?: string, password?: string, gcaptcha?: string) => {

    return new Promise<any>(((resolve, reject) => {

        if (!email && !password) {
            const {appApiData: {companydetails}}: any = store.getState();

            if (!companydetails.email && !companydetails.password) {
                logoutUser()
            }
            email = companydetails.email;
            password = companydetails.password;
            gcaptcha = auth.reuse_token;
        }

        fetch(loginUrl + 'login', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: email, password: password, 'g-recaptcha-response': gcaptcha})
        })
            .then((result) => {
                return result.json()
            })
            .then((data) => {

                const {appApiData: {companydetails}}: any = store.getState();

                if (data.status === SUCCESS) {
                    const {token} = data;
                    if(Boolean(token)) {
                        auth.token = token;

                        companydetails.token = auth.token;
                        storeData('fusion-pro-app', companydetails).then((r: any) => {
                            store.dispatch(setCompany({companydetails: companydetails}));
                        });
                    }
                    resolve(true);
                } else {
                    logoutUser()
                    resolve(false);
                }
            })
            .catch((error) => {
                reject();
            })
    }))

}

export const checkUserAccess = (data?: any, isReload?: any) => {
    bootstrap().then((bootstrapdata) => {
        if (bootstrapdata.status === STATUS.SUCCESS) {
            const workspace_name = bootstrapdata.data.workspace_name
        } else {
            render();
        }
    })
};


export const CheckConnectivity = () => {
    NetInfo.addEventListener((networkState: any) => {
        defaultvalues.internetconnection = networkState.isConnected;
        notifyMe(networkState.isConnected).then()
        //store.dispatch(setConnection({internet: networkState.isConnected}));
    });
};

let socketcounter = 0;
let ws: any;

export const notifyMe = async (flag = true) => {


    let connectionCounter: any;
    let connectionInterval: any;
    let internetStatus: any;


    if (!flag) {
        if (connectionCounter) {
            connectionCounter = 11;
        }
        if (ws) {
            ws.close();
        }
        ws = undefined;
        await store.dispatch(setConnection({socket: false}));
    } else {

        if (Boolean(auth.token) && ((ws && ws.readyState === 3) || (!ws))) {


            ws = new WebSocket(`wss://connect.dhru.com/?token=${auth.token}`);

            ws.onmessage = (e: any) => {
                store.dispatch(setNotify(e.data));
                //log('e.data',e.data)
                if (e.data) {
                    //log("SOCKET: Event Data->", e.data, true);
                }
            };
            ws.onerror = (err: any) => {
                if (err.message.includes("403") && socketcounter < 2) {
                    auth.token = '';
                    setTimeout(() => {
                        loginUser().then((loginstatus: any) => {
                            if (loginstatus) {
                                socketcounter++;
                                notifyMe(true);
                            } else {
                                log('SOCKET: encountered error-> ', err.message, true);
                                ws.close();
                            }
                        });
                    }, 2000)
                }
            };

            ws.addEventListener('open', async () => {
                connectionCounter = 0;
                clearInterval(connectionInterval);
                connectionInterval = undefined;
                await store.dispatch(setConnection({socket: true}));
                // log('SOCKET: Open->', "Connected", true);
            });

            ws.addEventListener('close', (event: any) => {
                connectionCounter++;

                store.dispatch(setConnection({socket: false}));
                //log('SOCKET: Close->', event, true);
                ws = null;
                if (!Boolean(connectionInterval)) {
                    connectionInterval = setInterval(() => {
                        //log('SOCKET: COUNTER->', connectionCounter, true);
                        if (connectionCounter < 11 && flag) {
                            notifyMe(flag)
                        } else {
                            clearInterval(connectionInterval);
                            connectionInterval = undefined;
                        }
                    }, 10000)
                }
            });

        }
    }
}


export const getIntraStateTax = (taxgroupid: any, stateCode: any, clientTaxRegistrationType?: any) => {
    const {settings} = store.getState().appApiData;
    const {tax, general}: any = settings;

    if (clientTaxRegistrationType === "o" && tax[taxgroupid]?.overseastaxgroupid) {
        return tax[taxgroupid].overseastaxgroupid
    }

    if (Boolean(general.state) &&
        Boolean(stateCode !== general.state)) {
        if (tax[taxgroupid]?.statetax) {
            let find: any = Object.values(tax[taxgroupid].statetax).find((st: any) => st.state === stateCode);
            if (find?.taxgroupid) {
                return find.taxgroupid
            }
        }

        if (tax[taxgroupid]?.intrastatetaxgroupid) {
            return tax[taxgroupid].intrastatetaxgroupid
        }
    }

    return taxgroupid;
}


export const loadContacts = async () => {

    store.dispatch(setLoader({show: true}));

    function compare(a: any, b: any) {
        if (a.displayname < b.displayname) {
            return -1;
        }
        if (a.displayname > b.displayname) {
            return 1;
        }
        return 0;
    }

    await Contacts.getAll()
        .then(async contacts => {
            let clients: any = [];
            contacts && contacts.map((contact: any) => {
                if (Boolean(contact.phoneNumbers[0])) {
                    contact && clients.push({
                        displayname: contact.displayName || contact.givenName + ' ' + contact.familyName,
                        phone: contact.phoneNumbers[0].number,
                        phonebook: true,
                        thumbnailPath: contact.thumbnailPath
                    })
                }
            });
            clients.sort(compare);
            store.dispatch(setLoader({show: false}));
            await store.dispatch(setContacts(clients));
        })
        .catch(e => {
            log('error', e)
        });
    Contacts.checkPermission();


}


export const loadClients = async (type: any, skip: any = 0, take: any = 50) => {
    return new Promise(((resolve, reject) => {
        requestApi({
            method: methods.get,
            action: actions.clients,
            queryString: {clienttype: type === 'Client' ? 0 : 1, phone: '', mobile: 1, skip: skip, take: take},
            loader: false,
            showlog: true,
        }).then(async (result: any) => {
            let isTypeArray = getType(result?.data) === "array";
            if (result.status === SUCCESS && isTypeArray) {
                if (Boolean(result?.info?.total > 0)) {
                    if (type === 'Client') {
                        await store.dispatch(setClients(result.data));
                    } else {
                        await store.dispatch(setVendors(result.data));
                    }
                }
            }
            resolve(isTypeArray? result.data : [])
        });
    }))
}


export const loadItems = async (skip: any = 0, take: any = 50) => {
    return new Promise(((resolve, reject) => {
        requestApi({
            method: methods.get,
            action: actions.items,
            queryString: {mobile: 1, skip: skip, take: take},
            loader: false,
            showlog: true,
        }).then(async (result: any) => {
            if (result.status === SUCCESS) {
                if (Boolean(result?.info?.total > 0)) {
                    await store.dispatch(setItems(result.data));
                }
            }
            resolve(result.data || [])
        });
    }))
}


/*export const autoLogin = (data:any) => {


  const {username,password,token}:any = data

  const {company}:any = '';
  let companydetail:any;


  retrieveData('fusion-pro-app').then((data: any) => {
    companydetail = data;
    requestApi({
      method: methods.post,
      action: actions.login,
      body: {username: username, password: password, "g-recaptcha-response": token},
      alert:true
    }).then((result) => {
      if (result.status === SUCCESS) {
        const {username,adminid,firstname,lastname,email,init} = result.data;
        const {token} = result;
        companydetail['current'] = company;
        companydetail['currentuser'] = company+'-'+adminid;
        companydetail[company+'-'+adminid] = {company:company,username: username, password: password,firstname:firstname,lastname:lastname,email:email,adminid:adminid,token:token}

        storeData('fusion-pro-app', companydetail).then((r: any) => {
          store.dispatch(setSettings(init));
          store.dispatch(setCompany({companydetails:companydetail}));
        });
      }
    });
  });

}*/

export const updateComponent = (ref: any, key: any, value: any) => {
    ref?.current?.setNativeProps({[key]: value})
}

export const shortName = (str: any) => {

    if (Boolean(str)) {
        const firstLetters = str
            .split(' ')
            .map((word: any) => word[0])
            .join('');
        return firstLetters.substring(0, 2).toUpperCase();
    }
    return
}

export const getCompany = () => {
    retrieveData('fusion-pro-app').then((data: any) => {
        return data.company
    });
}

export const storeData = async (key: any, value: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true
    } catch (error) {
        return false;
    }
};

export const retrieveData = async (key: any) => {
    return await AsyncStorage.getItem(key).then((data: any) => {
        return JSON.parse(data);
    });
};

export const objToArray = (data: any) => {
    if (data) {
        let result = [];
        for (let i in data) {
            result.push(data[i]);
        }
        return result;
    }
};

export const getStateList = (country: any) => {
    let queryString = {country};
    return requestApi({
        method: methods.get,
        action: actions.getstate,
        loader: false,
        queryString
    })
}

export const filterArray = (array: any, fields: any, searchText: any, multilevel: any = false) => {
    if (Boolean(array.length)) {
        if (multilevel) {
            return array?.map((item: any) => {
                return {
                    title: item.title, data: item.data.filter((item: any, key: any) => {
                        let searchin: any = item;
                        if (Boolean(fields)) {
                            searchin = '';
                            fields.map((field: any) => {
                                searchin += item[field]
                            })
                        }
                        return JSON.stringify(searchin).toLowerCase().includes(searchText && searchText.toLowerCase())
                    })
                }
            })
        } else {
            return array?.filter((item: any, key: any) => {
                let searchin: any = item;
                if (Boolean(fields)) {
                    searchin = '';
                    fields.map((field: any) => {
                        searchin += item[field]
                    })
                }
                return JSON.stringify(searchin).toLowerCase().includes(searchText && searchText.toLowerCase())
            })
        }
    }
}


export const getSelectedColumn = (array: any, columns: any) => {
    if (array) {
        return array.map((item: any, key: any) => {
            item.itemname
        })
    }
}

export const openDialog = (obj: any) => {
    obj.isOpen = true;
    store.dispatch(setDialog(obj));
};

export const closeDialog = () => {
    store.dispatch(setDialog({isOpen: false}));
};

export const clone = (obj: any) => {
    var copy: any;
    if (obj == null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr]);
            }
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
};

export const map = (object: any, callback: any) => {
    return Object.keys(object).map(function (key) {
        return callback(key, object[key]);
    });
};

export const findObject = (array: any, field: any, value: any) => {

    if (Boolean(array && array.length)) {
        let find: any = array.filter(function (item: any) {
            if (!Boolean(item[field])) {
                return false;
            }
            return item[field] && item[field]?.toString() === value?.toString();
        });
        return find;
    }
    return []
};

export const getLabel = (array: any, value: any) => {
    let find = findObject(array, 'value', value);
    return find[0]?.label;
}

export const getSince = (from: any) => {
    if (!from) {
        return false;
    }
    // @ts-ignore
    let diffMs: any = new Date() - new Date(from);
    let diffDays = Math.floor(diffMs / 86400000); // days
    let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if (from.toString().length === 10) {
        return moment(from * 1000).fromNow();
    }
    return moment(from).fromNow();

    //return (diffHrs + parseInt(diffDays * 24)) + ":" + diffMins;
};

export const timeToDate = (time: any) => {
    if (!time) {
        return false;
    }
    return moment(new Date(time * 1000), 'DD/MM/YYYY', true).format();
};

export const objectToArray = (object: any) => {
    let out = [];
    for (let i in object) {
        out.push(object[i]);
    }
    return out;
};

export const isStateVisible = (client?: any) => {

    const general = store.getState()?.appApiData.settings.general;
    let visible = {fieldVisible: false, labelVisible: true, taxname: client?.taxname || 'Consumer'};

    if (general?.country === "IN" && client?.taxregtype !== 'o') {
        visible.fieldVisible = !general?.taxregtype?.some((tax: any) => tax === "gu");
    }

    return visible;
}

/*export const toCurrency = (value: any) => {
  if (!value) {
    return value;
  }
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    minimumFractionDigits: 2,
    currency: 'USD',
  });
  return formatter.format(value);
};*/

export const toCurrency = (value: any, code?: any, decimal?: any) => {

    try {

        const {settings} = store.getState().appApiData;
        let currencylist = settings && settings.currency;

        if (!code) {
            code = getDefaultCurrency().__key;
            if (voucher.data?.currency) {
                code = voucher.data.currency;
            }
        }

        let decimalplace = decimal || currencylist[code].customdecimalplace || 2;

        if(Boolean(value)) {

                return <NumericFormat
                    value={parseFloat(value).toFixed(decimalplace)}
                    displayType={'text'}
                    thousandSeparator={true}
                    thousandsGroupStyle="lakh"
                    prefix={getSymbolFromCurrency(code)}
                    renderText={(value: any, props: any) => <Text {...props}>{value}</Text>}
                />;

        }

    } catch (e) {

        log('error ',e);
    }
    return 0
};


export const getType = (p: any) => {
    if (p) {
        if (Array.isArray(p)) return 'array';
        else if (typeof p == 'string') return 'string';
        else if (p != null && typeof p == 'object') return 'object';
        else return 'other';
    }
    return 'other';
}

export const setDecimal = (value: any, code?: any, decimal?: any) => {
    if (!code) {
        code = getDefaultCurrency().__key;
        if (voucher.data.currency) {
            code = voucher.data.currency;
        }
    }

    if (value) {
        try {
            return parseFloat(value).toFixed(decimal ? decimal : currencylist[code].decimal_digits);
        } catch (e) {
            log(e);
        }
    }

};


export const getCurrentCompanyDetails = () => {
    const {companydetails} = store.getState().appApiData;

    if (companydetails && Boolean(Object.keys(companydetails).length) && companydetails.token !== 'logout') {
        if (Boolean(companydetails?.companies)) {
            let currentcompany = companydetails?.companies[companydetails.currentuser];

            if (currentcompany) {
                return {
                    defaultcurrency: currentcompany?.defaultcurrency?.__key,
                    locationid: currentcompany.locationid,
                    adminid: currentcompany.adminid,
                    email: currentcompany.email,
                    defaulttasktype: currentcompany.defaulttasktype,
                    username: companydetails.firstname + ' ' + companydetails.lastname,
                    init: currentcompany.init,
                    lastassettype: currentcompany?.lastassettype,
                }
            }
        }

        return {
            adminid: companydetails.adminid,
            username: companydetails.firstname + ' ' + companydetails.lastname,
            email: companydetails?.email,
        }
    }
    return {
        adminid: companydetails.adminid,
        username: companydetails.firstname + ' ' + companydetails.lastname,
        email: companydetails?.email,
    }
}

export const getDefaultCurrency = () => {

    const {settings} = store.getState().appApiData;
    let currencylist = settings && settings.currency;

    if (Boolean(currencylist)) {
        let defaultcurrency: any = currencylist && Object.keys(currencylist).find((k) => currencylist[k].rate === "1")
        currencylist[defaultcurrency].symbol = defaultcurrency && getSymbolFromCurrency(defaultcurrency);
        return currencylist[defaultcurrency];
    } else {
        return {rate: '1', __key: 'INR', decimalplace: 2, symbol: '₹'}
    }

}

export const getCurrencySign = () => {
    const {settings} = store.getState().appApiData;
    let currencylist = settings.currency
    let defaultcurrency: any = Object.keys(currencylist).find((k) => currencylist[k].rate === "1")

    if (voucher.data.currency) {
        return getSymbolFromCurrency(voucher.data.currency) + ' ';
    }
    return getSymbolFromCurrency(defaultcurrency) + ' ';
}

export const currencyRate = (currencyName: any) => {
    const {settings:{currency}} = store.getState().appApiData;
    log('currency',currency)
    const rate = currency[currencyName].rate;
    log('rate',rate)
    return parseFloat(rate);
}


export const getCurrencyCode = () => {
    const {
        appApiData: {defaultCurrency},
    } = store.getState();
    return defaultCurrency ? defaultCurrency : 'USD';
};

export const logData = (message: any, data: any) => {
    console.log(message, data);
};

export const getThisYear = (dayOption?: string) => {

    let {financialfirstmonth} = store.getState().appApiData.settings.general;
    let startdate = moment({M: parseInt(financialfirstmonth) - 1}).subtract(12, 'month').startOf('month'),
        enddate = moment({M: parseInt(financialfirstmonth) - 1}).subtract(1, 'month').endOf('month');

    if (moment().get("month") + 1 >= 4) {
        startdate = moment({M: parseInt(financialfirstmonth) - 1}).startOf('month');
        enddate = moment({
            M: parseInt(financialfirstmonth) - 1,
            y: moment().year() + 1
        }).subtract(1, 'month').endOf('month');
    }

    if (Boolean(dayOption)) {
        startdate = moment().startOf('day');
        if (dayOption == "Today") {
            enddate = moment().endOf('day');
        } else if (dayOption == "Last 7 Days") {
            startdate = startdate.subtract(6, "day");
            enddate = moment().endOf('day');
        }
    }


    return {
        startdate: startdate.format("YYYY-MM-DD"),
        enddate: enddate.format("YYYY-MM-DD"),
        starttime: startdate.format("hh:mm A"),
        endtime: enddate.format("hh:mm A")
    };
}

export const getMonthsYear = (start: any, end: any) => {

    let startDate = moment(start).subtract(1, "month");
    let endDate = moment(end);

    let dates = [];
    endDate.subtract(1, "month"); //Substract one month to exclude endDate itself
    let month = moment(startDate); //clone the startDate
    while (month < endDate) {
        month.add(1, "month");
        dates.push({
            format1: month.format('MMMM YYYY '),
            format2: month.format('MMMM '),
            format3: month.format('MMM '),
            format4: month.format('MMM YY'),
            month: month.format('MM')
        });
    }
    return dates;
}


export const uploadFile = async (file: any, callback: any, loader: boolean = false, doNotReplaceProtocol: boolean = false) => {


    if (file) {

        await requestApi({
            method: methods.get,
            action: 'getuploadurl',
            loader,
            queryString: {file_name: file.name, file_type: file.type}, //, uri: file.uri
            other: {url: 'https://apigateway.dhru.com/v1/', token: auth.license_token, xhrRequest: true},
            doNotReplaceProtocol,
            showlog: true
        }).then(async (responseUrl) => {
            if (responseUrl.status === SUCCESS) {
                let requestOptions = {
                    method: 'PUT',
                    headers: {"Content-Type": file.type},
                    body: file,
                };

                await fetch(responseUrl.upload_url, requestOptions)
                    .then(response => {
                        if (response.status === 200) {
                            callback({
                                download_url: responseUrl.download_url,
                                file_name: responseUrl.original_file_name,
                            })
                        }
                    })
                    .catch(error => {
                        //console.log('error', error)
                    });
            }
        });


    }
};


export const downloadFile = async ({url, filename}: any) => {

    store.dispatch(setLoader({show: true, type: 'activity'}))


    let headers: any = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth.token,
        // 'x-workspace': current.company
    };

    const {dirs} = RNFetchBlob.fs;
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
    const configfb: any = {
        fileCache: true,
        addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title: `${filename}.pdf`,
            path: `${dirToSave}/${filename}.pdf`,
        },
    }
    const configOptions: any = Platform.select({
        ios: {
            fileCache: configfb.fileCache,
            title: configfb.title,
            path: configfb.path,
            appendExt: 'pdf',
        },
        android: configfb,
    });


    if (Platform.OS === "android") {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "Extranal Storage.",
                    message:
                        "This app would like access to external storage",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                RNFetchBlob.config(configOptions)
                    .fetch('GET', url, headers)
                    .then((result: any) => {
                        store.dispatch(setLoader({show: false}))
                    })
                    .catch((e) => {
                        store.dispatch(setLoader({show: false}))
                        log('error', e)
                    });
            } else {
                log("WRITE_EXTERNAL_STORAGE permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    } else {

        RNFetchBlob.config(configOptions)
            .fetch('GET', url, headers)
            .then((result: any) => {
                if (Platform.OS === "ios") {
                    RNFetchBlob.ios.openDocument(result.data);
                    RNFetchBlob.fs.writeFile(configfb.path, result.data, 'base64');
                    RNFetchBlob.ios.previewDocument(configfb.path);
                }
                store.dispatch(setLoader({show: false}))
            })
            .catch((e) => {
                store.dispatch(setLoader({show: false}))
                log('error', e)
            });
    }


}


export const printPDF = async ({data, filename}: any) => {
    const results: any = await RNHTMLtoPDF.convert({
        html: data,
        fileName: `${filename}.pdf`,
        base64: true,
    })
    await RNPrint.print({filePath: results.filePath})
}

export const sharePDF = async ({data, filename}: any) => {

    await RNHTMLtoPDF.convert({
        html: data,
        fileName: `${filename}.pdf`,
        base64: true,
    }).then((results: any) => {
        try {
            Share.open({
                title: 'Share',
                message: `${filename}.pdf`,
                subject: `Share ${filename}.pdf`,
                url: 'data:application/pdf;base64,' + results.base64,
            });
        } catch (error) {

        }
    })
}

export const decodeHtml = (html: any) => {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}


export const base64Decode = (encodedData: any) => {
    try {
        if (Boolean(encodedData)) {
            let bytes = base64.decode(encodedData);
            return Boolean(bytes) ? decode(utf8.decode(bytes)) : '';
        }
        return
    } catch (e) {
        console.log(e);
    }
}
export const base64Encode = (content: any) => {
    if (!content) {
        content = ' '
    }
    let bytes = utf8.encode(content);
    return base64.encode(bytes);
}



export function isEmpty(obj: any) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
    }

    return true;
}


export function nFormatter(num: any, digits: any) {
    const lookup = [
        {value: 1, symbol: ""},
        {value: 1e3, symbol: "k"},
        {value: 1e6, symbol: "M"},
        {value: 1e9, symbol: "G"},
        {value: 1e12, symbol: "T"},
        {value: 1e15, symbol: "P"},
        {value: 1e18, symbol: "E"}
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

export const editOptionItem = (title: string, screen: string, visible: boolean = true, type?: string[]) => ({
    title,
    screen,
    visible,
    type
});

export const getRoleModuleList = () => {

    const {settings} =  store.getState().appApiData;
    const {roleaccess} = settings;

    let roleModuleList = {};
    if (roleaccess) {
        Object.keys(roleaccess).forEach((parentID: any) => {
            let roleList = roleaccess[parentID];

            Object.keys(roleList).forEach((roleKey: any) => {
                if (roleKey === "permissions") {
                    Object.keys(roleList[roleKey]).forEach((permissonKey: any) => {

                        roleModuleList = {
                            ...roleModuleList,
                            [permissonKey]: {
                                id: permissonKey,
                                parentID,
                                ...roleList[roleKey][permissonKey],
                                ...roleList[roleKey][permissonKey].access
                            }
                        }
                    })
                } else {
                    roleModuleList = {
                        ...roleModuleList,
                        [roleKey]: {
                            id: roleKey,
                            parentID,
                            ...roleList[roleKey],
                            ...roleList[roleKey].access
                        }
                    }
                }
            })
        })
    }


    return roleModuleList;
}

export const getVisibleNav = (listData: any) => {

    const {settings} = store.getState().appApiData;
    const {navigation: webNavigations, general, location: locations, roleaccess} = settings;
    let {locationid, init} = getCurrentCompanyDetails()

    let roleModuleList: any = getRoleModuleList();


    let notAdmin = init?.user?.role !== "admin";

    return listData?.filter(({navigationid, vouchertypeid}: any) => {
        let visible = true;

        if (Boolean(navigationid) && Boolean(webNavigations) && Boolean(webNavigations[navigationid])) {
            const nav = webNavigations[navigationid];

            if (nav.hasOwnProperty("isAllCountry") &&
                !Boolean(nav?.isAllCountry) &&
                nav?.allowedCountries &&
                nav?.allowedCountries.length > 0) {
                visible = webNavigations[navigationid]?.allowedCountries.some((c: any) => c === general.country);
            }
            if (Boolean(visible) && Boolean(nav?.industry) && !isEmpty(nav?.industry)) {
                if (locationid) {
                    let currentIndustryType = locations[locationid].industrytype
                    let checkAllowForAnyOne = Object.values(nav?.industry).some((allow: any) => Boolean(allow));
                    if (checkAllowForAnyOne) {
                        visible = Boolean(nav?.industry[currentIndustryType])
                    }
                }
            }
        }
        return Boolean(visible);
    }).map((data: any) => {

        const {navigationid} = data;

        let accessType: any = {};


        if (Boolean(navigationid) && Boolean(webNavigations) && webNavigations[navigationid]?.modulePermission) {

            if(data.label === 'Client') {

            }

            const nav = webNavigations[navigationid];

            Object.keys(nav?.modulePermission).forEach((navModuleKey: any) => {



                if (regExpJson2?.uuidValidate.test(data.vouchertypeid2) || regExpJson2?.uuidValidate.test(data.vouchertypeid)) {

                    // filter module which is true, not false;
                    let navAccessKey = Object.keys(nav?.modulePermission[navModuleKey])
                        .filter((navAccessKey: any) => Boolean(nav?.modulePermission[navModuleKey][navAccessKey]));
                    if (!isEmpty(navAccessKey)) {

                        navAccessKey.forEach((access: any) => {
                            if (Boolean(roleModuleList[navModuleKey]) && Boolean(roleModuleList[navModuleKey][access])) {
                                accessType = {
                                    ...accessType,
                                    [access]: true
                                }
                            }
                        })
                    }
                } else {
                    Object.keys(nav?.modulePermission[navModuleKey]).forEach((access) => {
                        accessType = {
                            ...accessType,
                            [access]: true
                        }
                    })
                }
            })
        }
        return {...data, accessType};
    })
}

export const isPermissionAllow = (permissionName: any) => {
    const {user} = store.getState().appApiData.settings;
    if (!isEmpty(user?.settings) && Boolean(permissionName)) {
        return Boolean(user?.settings[permissionName])
    }
    return false;
}

export const toDateFormat = (value: string) => {
    const dateformat: any = store.getState().appApiData.settings.general.dateformat;
    return moment(value).format(dateformat)
}

export const getAssetData = (clientasset: any, assetid: any) => {
    let appendData: any = {}

    const findId: any = Object.keys(clientasset).find((assetid: any) => assetid === assetid);
    const assetData: any = clientasset[findId];


    let data: any = {};
    if (!isEmpty(assetData?.data)) {
        Object.keys(assetData?.data).forEach((key: any) => {
            if (key !== "assetname" &&
                key !== "basefield" &&
                key !== "model" &&
                key !== "brand") {
                data[key] = assetData.data[key];
            }
        })
    }


    if (Boolean(voucher.settings.assettype) && Boolean(assetData)) {
        appendData = {
            ...appendData,
            assetid: assetid || 0,
            assettype: assetData.assettype,
            assetdata: {
                assetname: assetData?.assetname,
                brand: assetData?.brand,
                model: assetData?.model,
                basefield: assetData?.basefield,
                data
            },
        }
    }

    return appendData;
}

export const setAppType = (type: any) => {
    return storeData("type", type)
}

export const getAppType = () => {
    return retrieveData("type");
}

export const checkStock = (serialNoValue: any, qsp?: any) => {

    const {locationid}: any = getCurrentCompanyDetails();

    let queryString: any = {
        serial: `["${serialNoValue}"]`,
        location: locationid
    };
    if (!isEmpty(qsp)) {
        queryString = {...queryString, ...qsp}
    }
    return requestApi({
        method: methods.get,
        action: actions.stock,
        queryString
    });
}


export const groupErrorAlert = ({submitFailed, touched, errors}: any) => {

    let errorList: any = [];
    // if (Boolean(submitFailed)) {
    Object.keys(touched).forEach((t: any) => {
        let keys = t.split('[')
        if (Boolean(errors[keys[0]])) {
            let message;
            if (keys.length > 1) {
                let data = errors[keys[0]];
                keys.forEach((keyVar: any, index: any) => {
                    if (index != 0) {
                        let key: any = keyVar.split(']')[0];
                        if (data[key]) {
                            data = data[key];
                            if (getType(data) === "string") {
                                message = data;
                            }
                        }
                    }
                })
            } else if (getType(errors[keys[0]]) === "string") {
                message = errors[keys[0]];
            }
            if (getType(message) === "string") {
                errorList = [...errorList, message]
            }
        }
    })
    // }

    if (!isEmpty(errorList)) {
        let error = errorList.join("\n");

        errorAlert(error);
    }

}

export const getVoucherTypeData = (fieldKey: string, fieldValue: any, voucherdisplayid?: string, voucherid?: any) => {
    let vouchers = store.getState().appApiData.settings.voucher;

    const voucherData = vouchers[fieldValue];
    let typeData = {};
    const voucherTypeData = findObject(FILTERED_VOUCHER.data, fieldKey, fieldValue)
    if (!isEmpty(voucherTypeData)) {
        typeData = {
            ...voucherTypeData[0],
        };
    }
    typeData = {
        ...typeData,
        ...voucherData,
        voucherdisplayid,
        voucherid
    };

    return typeData
}

/**
 * @function getStock - use for get item stock list;
 * @param productid - product id;
 * @param qty - product quantity
 */
export const getStock = (productid: any, qty: any) => {

    const {locationid}: any = getCurrentCompanyDetails();

    let queryString: any = {
        productid,
        qty,
        location: locationid
    };
    return requestApi({
        method: methods.get,
        action: actions.getstock,
        queryString
    })
}


export const getCountryDialCode = (countryCode: any) => {
    let data = findObject(callingcode, "code", countryCode);
    let returnData = {};
    if (data.length > 0) {
        returnData = data[0];
    }
    return returnData;
}

export const setSpotLight = (data:any)=>{
    storeData(STORE_KEY_SPOTLIGHT, data).then((data: any) => {
    });
}



export const dataURLToFile = async (dataURL: any, fileName: any) => {
    let _blob:any='';
   await fetch(dataURL)
        .then(res => res.blob())
        .then((blob:any) => {
            blob._data={
                ...blob._data,
                name:fileName
            }
            _blob = blob
       });
    return _blob
}



export const isAfterDate = (date1: string, date2?: string) => {
    if (!Boolean(date2)) {
        date2 = moment().format("YYYY-MM-DD");
    }
    return moment(date2).isAfter(date1);
}




export enum PERMISSION_NAME {
    ASSIGN_TASK = "assigntask", // VIEW
    MODIFY_REPORTER = "modifyreporter", // ADD, UPDATE
    CLOSE_TASK = "closetask", // UPDATE
    OTHER_TASK = "otherstask", // VIEW, UPDATE, DELETE
    SCHEDULE_TASK = "scheduletask", // UPDATE
    VIEW_PROFIT = "viewprofit", // VIEW,
    VIEW_TASK = "Task", // VIEW,
    ASSET = "Asset", // ADD, EDIT, VIEW, DELETE,
    JOBSHEET = "JobSheet", // ADD, EDIT, VIEW, DELETE,
    FINANCIAL_DASHBOARD = "Financial Dashboard",
    RESTAURANT_DASHBOARD = "Restaurant Dashboard",
    BANKING_DASHBOARD = "Banking",
    TASK_DASHBOARD = "Task",
}
export enum PERMISSION_MODE {
    VIEW = "view",
    ADD = "add",
    UPDATE = "update",
    DELETE = "delete"
}
export const getRoleModuleAccess = (permissionName:PERMISSION_NAME)=>{
    let accessList:any  = getRoleModuleList();
    return accessList[permissionName]
}
