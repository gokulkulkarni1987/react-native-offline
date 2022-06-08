import { createStore, combineReducers, applyMiddleware } from 'redux';

// TODO: removed require and imported it from file system,
// I hope this is okay
import createSagaMiddleware from 'redux-saga';
import {
  reducer as network,
  offlineActionCreators,
  createNetworkMiddleware,
  checkInternetConnection
} from 'react-native-offline';

import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import counter from './reducer';
import rootSaga from './sagas';

type GetReducerState<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => infer Q ? Q : never
};

const reducers = {
  counter,
  network,
};

export type AppState = GetReducerState<typeof reducers>;
export default function createReduxStore({
  withSaga = false,
  queueReleaseThrottle = 1000,
} = {}, callback: () => void) {
  const networkMiddleware = createNetworkMiddleware({
    regexActionType: /^OTHER/,
    actionTypes: ['ADD_ONE', 'SUB_ONE'],
    queueReleaseThrottle,
  });

  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  };
  
  const sagaMiddleware = createSagaMiddleware();

  const rootReducer = combineReducers(reducers);

  const persistedReducer = persistReducer<AppState>(persistConfig, rootReducer);

  const middlewares = [networkMiddleware];
  if (withSaga === true) {
    middlewares.push(sagaMiddleware);
  }

  const store = createStore(persistedReducer, applyMiddleware(...middlewares));

  const { connectionChange } = offlineActionCreators;

  // if(store.getState().counter) {
  //   callback()
  // } else {
  const persistor = persistStore(store, null, () => {
      // After rehydration completes, we detect initial connection
      checkInternetConnection().then(isConnected => {
        store.dispatch(connectionChange(isConnected));
        callback(); // Notify our root component we are good to go, so that we can render our app
      });
    });
  // }

  if (withSaga === true) {
    sagaMiddleware.run(rootSaga);
  }

  return {store, persistor};
}
