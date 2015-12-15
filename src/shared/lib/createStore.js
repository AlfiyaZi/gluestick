import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import promiseMiddleware from "../../lib/promiseMiddleware";

/**
 * This reducer always returns the original state, this prevents an error when
 * no other reducers have been added.
 */
function emptyReducer (state=null, action) {
    return state;
}

export default function (customRequire, hotCallback) {
    const reducer = combineReducers(Object.assign({}, {emptyReducer}, customRequire()));
    const finalCreateStore = compose(
        applyMiddleware(promiseMiddleware)
    )(createStore);
    const store = finalCreateStore(reducer, typeof window !== "undefined" ? window.__INITIAL_STATE__ : {});

    if (hotCallback) {
        hotCallback(() => {
            const nextReducer = combineReducers(Object.assign({}, {emptyReducer}, customRequire()));
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}

