import {SET_ROOT_APP_DATA} from "../definitions/rootAppData";

const initState: any = {};

export default (state: any = initState, action: any) => {
    switch (action.type) {
        case SET_ROOT_APP_DATA:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }
}
