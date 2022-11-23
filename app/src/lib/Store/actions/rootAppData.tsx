import {SET_ROOT_APP_DATA} from "../definitions/rootAppData";

export const setRootAppData = (data:any) => ({
    type: SET_ROOT_APP_DATA,
    data
});
