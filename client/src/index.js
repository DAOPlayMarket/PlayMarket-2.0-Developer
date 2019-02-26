import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

// STYLES
import './styles/reset.sass';
import './styles/main.sass';

import App from './App';

import * as serviceWorker from './serviceWorker';
import reducer from './reducers'

const store = createStore(
    reducer,
    applyMiddleware(thunk)
);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
serviceWorker.unregister();
