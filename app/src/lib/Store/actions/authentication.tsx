import {LOGIN, LOGOUT} from "../definitions/authentication";

const login = (authDetails:any) => ({
    type: LOGIN,
    authDetails,
});

const logout = () => ({
    type: LOGOUT
});



export {login, logout};
