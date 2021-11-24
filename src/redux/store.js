import {createStore,combineReducers} from 'redux'
import {collapsedReducer} from './reducers/collapsedReducer'
import {loadingReducer} from './reducers/loadingReducer'
import  {  persistStore ,  persistReducer  }  from  'redux-persist'
import  storage  from  'redux-persist/lib/storage'  // 默认为localStorage for web

//合并多个reducer
const reducer = combineReducers({
    collapsedReducer,
    loadingReducer
})
const  persistConfig  =  {
    key : 'root' ,
    storage ,
    blacklist:['loadingReducer']
}
const  persistedReducer  =  persistReducer ( persistConfig , reducer )
const store = createStore(persistedReducer)
const persistor  =  persistStore ( store )
export {
    store,
    persistor
}
