import {SET_ACTIVE_STEP, TOGGLE_WALK_THROUGH} from "../definitions/walkthrough";

const initState: any = {
    activeStep: 0,
    enable: false
};

export default (state: any = initState, action: any) => {
    switch (action.type) {
        case SET_ACTIVE_STEP:
            const {activeStep} = action;
            if (state.enable) {
                return {
                    ...state,
                    activeStep
                }
            }
            return state;
        case TOGGLE_WALK_THROUGH:
            return {
                ...state,
                enable: !state.enable,
                activeStep: 0
            }
        default:
            return state;
    }
}
