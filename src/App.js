import React from 'react';
import IndexRouter from "./router/IndexRouter";
import {Provider} from 'react-redux'
import {store,persistor} from "./redux/store.js";
import {PersistGate} from 'redux-persist/integration/react'

function App(props) {
    return <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <IndexRouter/>
        </PersistGate>
    </Provider>
}

export default App;
