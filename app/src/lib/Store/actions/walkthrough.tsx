import {SET_ACTIVE_STEP, TOGGLE_WALK_THROUGH} from "../definitions/walkthrough";

export const setActiveStep = (activeStep:number) => ({
    type: SET_ACTIVE_STEP,
    activeStep
});


export const toggleWalkThrough = ()=>({
    type: TOGGLE_WALK_THROUGH,
});
