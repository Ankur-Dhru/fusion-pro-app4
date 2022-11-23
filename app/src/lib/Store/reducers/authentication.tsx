import {LOGIN, LOGOUT} from "../definitions/authentication";

const initState:any = {isAuthenticated: false};

export default (state:any = initState, action:any) => {
    switch (action.type) {
        case LOGIN:
            const {authDetails} = action;
            if (authDetails) {
                return {
                    isAuthenticated: true,
                    token:authDetails.token,
                    userdetail:authDetails.user
                };
            }
            return state;
        case LOGOUT:
            return initState;
        default:
            return state;
    }
};
