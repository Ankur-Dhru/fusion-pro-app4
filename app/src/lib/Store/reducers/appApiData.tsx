import {
    SET_INIT,
    SET_SETTINGS,
    SET_ITEMS,
    SET_CLIENTS,
    SET_VENDORS,
    SET_PREFERENCES,
    SET_COMPANY,
    SET_CONTACTS,
    SET_FAVOURITES,
    SET_CLIENTPENDINGINVOICES,
    SET_VOUCHERTYPE,
    SET_VOUCHERITEMS,
    SET_CONNECTION,
    DELETE_VOUCHERITEMS,
    UPDATE_VOUCHERITEMS,
    RESET_VOUCHERITEMS,
    SET_FAVOURITECLIENTS, SET_FAVOURITEVENDORS, SET_VOUCHERSETTINGS, SET_FAVOURITEITEMS, SET_NOTIFY
} from "../definitions/appApiData";
import {clone, log} from "../../functions";


const initState:any = {
    settings: false,
    company:false,
    connection:{internet:true,socket:false},
    voucheritems:{},
    vouchertype:{},
    companydetails:{},
    contacts:[],
    favouriteclients:[],
    favouritevendors:[],
    favouriteitems:[]
};


export default (state:any = initState, action:any) => {
    switch (action.type) {
        case SET_INIT:
            return {
                ...state,
                init: action.data
            };
        case SET_SETTINGS:
            return {
                ...state,
                settings: {
                    ...action.settings
                }
            };
        case SET_PREFERENCES:
            return {
                ...state,
                preferences: {
                    ...state.preferences,
                    ...clone(action.preferences)
                }
            };
        case SET_ITEMS:
            return {
                ...state,
                items:action.items
            };
        case SET_CLIENTPENDINGINVOICES:
            return {
                ...state,
                pendinginvoices:action.pendinginvoices
            };
        case SET_CLIENTS:
            return {
                ...state,
                clients:action.clients
            };
        case SET_VENDORS:
            return {
                ...state,
                vendors:action.vendors
            };
        case SET_FAVOURITECLIENTS:
            return {
                ...state,
                favouriteclients:action.favouriteclients
            };
        case SET_FAVOURITEVENDORS:
            return {
                ...state,
                favouritevendors:action.favouritevendors
            };
        case SET_FAVOURITEITEMS:
            return {
                ...state,
                favouriteitems:action.favouriteitems
            };
        case SET_CONTACTS:
            return {
                ...state,
                contacts:action.contacts
            };
        case SET_NOTIFY:
            return {
                ...state,
                notify:action.notify
            };
        case SET_CONNECTION:
            return {
                ...state,
                connection: {
                    ...state.connection,
                    ...action.connection
                }
            };
        case SET_VOUCHERTYPE:
            return {
                ...state,
                vouchertype:action.vouchertype,
                voucheritems:{},
                pendinginvoices:{},
                vouchersettings:''
            };
        case SET_VOUCHERSETTINGS:
            return {
                ...state,
                vouchersettings:action.vouchersettings,
            };
        case SET_VOUCHERITEMS:
            return {
                ...state,
                voucheritems: {
                    ...state.voucheritems,
                    [action.voucheritem.itemunique]: {
                        ...state.voucheritems[action.voucheritem.itemunique],
                        ...action.voucheritem
                    }
                }
            };

        case UPDATE_VOUCHERITEMS:
            return {
                ...state,
                voucheritems: action.voucheritems
            };


        case RESET_VOUCHERITEMS:
            return {
                ...state,
                voucheritems: {}
            };

        case DELETE_VOUCHERITEMS:
            return {
                ...state,
                voucheritems: {
                    ...state.voucheritems,
                    [action.voucheritem.itemunique]: {
                        ...state.voucheritems[action.voucheritem.itemunique],
                        ...action.voucheritem
                    }
                }
            };


        case SET_FAVOURITES:
            return {
                ...state,
                favourites:action.favourites
            };
        case SET_COMPANY:
            return {
                ...state,
                ...clone(action.companydetails),
            };
        default:
            return state;
    }
}
