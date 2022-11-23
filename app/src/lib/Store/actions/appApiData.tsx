import {
    SET_INIT,
    SET_KOTS,
    SET_SETTINGS,
    SET_ITEMS,
    SET_CLIENTS,
    SET_CONTACTS,
    SET_FAVOURITECLIENTS,
    SET_FAVOURITES,
    SET_COMPANY,
    SET_CONNECTION,
    SET_VOUCHERSETTINGS,
    SET_VOUCHERITEMS,
    SET_NOTIFY,
    UPDATE_VOUCHERITEMS,
    SET_PREFERENCES, SET_VOUCHERTYPE, SET_CLIENTPENDINGINVOICES, SET_VENDORS, SET_FAVOURITEVENDORS, RESET_VOUCHERITEMS,SET_FAVOURITEITEMS
} from "../definitions/appApiData";
import {log} from "../../functions";



const setInit = (data:any) => ({
    type: SET_INIT,
    data
});

const setKots = (data:any) => ({
    type: SET_KOTS,
    kots:data
});


const setSettings = (settings:any) => ({
    type: SET_SETTINGS,
    settings:settings
});

const setPreferences = (preferences:any) => ({
    type: SET_PREFERENCES,
    preferences:preferences
});

const setItems = (items:any) => ({
    type: SET_ITEMS,
    items:items
});

const setPendingInvoices = (pendinginvoices:any) => ({
    type: SET_CLIENTPENDINGINVOICES,
    pendinginvoices:pendinginvoices
});

const setClients = (clients:any) => ({
    type: SET_CLIENTS,
    clients:clients
});

const setVendors = (vendors:any) => ({
    type: SET_VENDORS,
    vendors:vendors
});

const setFavouriteClients = (favouriteclients:any) => ({
    type: SET_FAVOURITECLIENTS,
    favouriteclients:favouriteclients
});

const setFavouriteVendors = (favouritevendors:any) => ({
    type: SET_FAVOURITEVENDORS,
    favouritevendors:favouritevendors
});

const setFavouriteItems = (favouriteitems:any) => ({
    type: SET_FAVOURITEITEMS,
    favouriteitems:favouriteitems
});

const setContacts = (contacts:any) => ({
    type: SET_CONTACTS,
    contacts:contacts
});

const setConnection = (connection:any) => ({
    type: SET_CONNECTION,
    connection:connection
});

const setNotify = (notify:any) => ({
    type: SET_NOTIFY,
    notify:notify
});

const setVoucherSettings = (vouchersettings:any) => ({
    type: SET_VOUCHERSETTINGS,
    vouchersettings:vouchersettings
});


const setVoucherItems = (voucheritem:any) => ({
    type: SET_VOUCHERITEMS,
    voucheritem:voucheritem
});

const updateVoucherItems = (voucheritems:any) => ({
    type: UPDATE_VOUCHERITEMS,
    voucheritems:voucheritems
});

const resetVoucherItems = () => ({
    type: RESET_VOUCHERITEMS,
});


const setFavourites = (favourites:any) => ({
    type: SET_FAVOURITES,
    favourites:favourites
});


const setCompany = (company:any) => ({
    type: SET_COMPANY,
    companydetails:company
});


export {
    setInit,
    setKots,
    setSettings,
    setItems,
    setNotify,
    setVendors,
    setClients,
    setContacts,
    setFavouriteClients,
    setFavouriteVendors,
    setFavouriteItems,
    setPendingInvoices,
    setConnection,
    setFavourites,
    setCompany,
    setVoucherSettings,
    setVoucherItems,
    resetVoucherItems,
    updateVoucherItems,
    setPreferences
}
