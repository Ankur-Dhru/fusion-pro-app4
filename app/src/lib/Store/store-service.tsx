import {store} from "../../App";
import {setSettings} from "./actions/appApiData";
import React from "react";
import {setModal} from "./actions/components";
import { setActiveStep } from "./actions/walkthrough";

export const saveSettings = (key: string, value: any) => {
    const {settings}: any = store.getState();
    store.dispatch(setSettings({
        ...settings,
        [key]: value
    }))
}


export const openModal = (title: string, component: any) => {
    store.dispatch(setModal({title, visible: true, component}))
}

export const selectLocation = (locationId: any) => {
    const locations = store.getState()?.appApiData.settings.location;
    if (locations && locationId) {
        return locations[locationId];
    }
    return {}
}

export const getCurrentStep = () => {
    return store.getState()?.walkthrough.activeStep
}

export const isVisibleTooltip = (stepOrder: number) => {
    return getCurrentStep() === stepOrder;
}

export const setActiveStepNumber = (nextStep?:number) => {
    store.dispatch(setActiveStep(nextStep || getCurrentStep() + 1))
}
