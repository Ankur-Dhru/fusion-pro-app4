import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunk from "redux-thunk";
import appApiData from "./reducers/appApiData";
import authentication from './reducers/authentication'
import components from "./reducers/components";
import rootAppData from "./reducers/rootAppData";
import walkthrough from "./reducers/walkthrough";


// @ts-ignore
const composeEnhancers:any = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {

    const reducers = {
        appApiData,
        authentication,
        components,
        rootAppData,
        walkthrough
    };

    const store = createStore(
        combineReducers(reducers),
        composeEnhancers(applyMiddleware(thunk))
    );

    return store;
}
