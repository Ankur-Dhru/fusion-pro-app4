import {
    SET_DIALOG,
    SET_MODAL,
    SET_BOTTOMSHEET,
    SET_PAGESHEET,
    SET_ALERT,
    SET_LOADER,
    TOGGLE_LOADER, SET_TOKEN
} from "../definitions/components";
import React from "react";
import {log} from "../../functions";


const initState = {
    dialog: {visible:false,title:'',component: () => {return <></>}},
    token: {visible:false,title:'',component: () => {return <></>}},
    modal: {visible:false,title:'',component: () => {return <></>}},
    bottomsheet: {visible:false,title:'',component: () => {return <></>}},
    pagesheet: {visible:false,title:'',component: () => {return <></>}},
    alert: {message:'', variant: 'success',visible:false},
    loader:{show:false}
};

export default (state = initState, action:any) => {
    switch (action.type) {
        case SET_DIALOG:
            return {
                ...state,
                dialog: {
                    ...state.dialog,
                    ...action.dialog
                }
            };
        case SET_TOKEN:
            return {
                ...state,
                token: {
                    ...state.token,
                    ...action.token
                }
            };
        case SET_MODAL:
            return {
                ...state,
                modal: {
                    ...state.modal,
                    ...action.modal
                }
            };
        case SET_BOTTOMSHEET:
            return {
                ...state,
                bottomsheet: {
                    ...state.bottomsheet,
                    ...action.bottomsheet
                }
            };
        case SET_PAGESHEET:
            return {
                ...state,
                pagesheet: {
                    ...state.pagesheet,
                    ...action.pagesheet
                }
            };
        case SET_ALERT:
            return {
                ...state,
                alert: {
                    ...state.alert,
                    ...action.alert
                }
            };
        case SET_LOADER:
            return {
                ...state,
                loader: {
                    ...state.loader,
                    ...action.loader
                }
            };

        case TOGGLE_LOADER:
            return {...state, isOpenLoader: action.isOpenLoader};
        default:
            return state;
    }
}
