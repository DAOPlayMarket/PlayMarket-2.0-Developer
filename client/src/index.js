import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
// import { logger } from 'redux-logger'

// STYLES
import './styles/reset.sass';
import './styles/main.sass';

import App from './App';

import registerServiceWorker from './registerServiceWorker';
import reducer from './reducers'

const store = createStore(
    reducer,
    applyMiddleware(thunk)
    // applyMiddleware(thunk, logger)
);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
