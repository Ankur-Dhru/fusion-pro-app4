import {
    SET_DIALOG,
    SET_TOKEN,
    SET_BOTTOMSHEET,
    SET_PAGESHEET,
    SET_ALERT,
    SET_LOADER,
    TOGGLE_LOADER, SET_MODAL
} from "../definitions/components";

const setDialog = (dialog:any) => ({
    type: SET_DIALOG,
    dialog
});

const setToken = (token:any) => ({
    type: SET_TOKEN,
    token
});

const setModal = (modal:any) => ({
    type: SET_MODAL,
    modal
});

const setBottomSheet = (bottomsheet:any) => ({
    type: SET_BOTTOMSHEET,
    bottomsheet
});

const setPageSheet = (pagesheet:any) => ({
    type: SET_PAGESHEET,
    pagesheet
});

const setAlert = (alert:any) => ({
    type: SET_ALERT,
    alert
});


const setLoader = (loader:any) => ({
    type: SET_LOADER,
    loader
});

const toggleLoader = (isOpenLoader:any)=>({
    type:TOGGLE_LOADER,
    isOpenLoader
});

export {setDialog,setModal,setAlert,setToken,setLoader,toggleLoader,setBottomSheet,setPageSheet};
