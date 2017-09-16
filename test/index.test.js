import {createStore,applyMiddleware} from "redux"
import createSagaMiddleware from "redux-saga"
import {take,put} from "redux-saga/effects"
import createMiddleware from "./index"
let store = null;
const reducer = (state = {actions:[]}, action) => {
    return {actions:[action,...state.actions]}
};

function* longSaga(){
    const action = yield take("TEST");
    yield new Promise((resolve,reject)=>setTimeout(resolve, 1000));
    yield put({type:"AFTER_TEST"});
    action.meta.async.resolve("ASYNC!!!");
}

test('apply middleware', () => {
    const sagaMiddleware = createSagaMiddleware();
    const sagaPromiseMiddleware = createMiddleware();
    store = createStore(reducer,applyMiddleware(sagaPromiseMiddleware,sagaMiddleware));
    sagaMiddleware.run(longSaga)
});

test('normal action', () => {
    const action = {type:"NORMAL"};
    const ret = store.dispatch(action);
    expect(ret).toBe(action);
    expect(store.getState().actions[0].type).toBe("NORMAL")
});

test('async action', async () => {
    const action = {type:"TEST",meta:{async:true}};
    const ret = store.dispatch(action);
    expect(ret).toBeInstanceOf(Promise);
    expect(store.getState().actions[0].type).toBe("TEST");
    expect(await ret).toBe("ASYNC!!!");
    expect(store.getState().actions[0].type).toBe("AFTER_TEST");
});
