import { all, fork, takeEvery, call } from 'redux-saga/effects';
import { Alert } from 'react-native';
import { networkSaga } from 'react-native-offline';

function* doSideEffect({ type }: { type: string }) {
  console.log('doSideEffectdoSideEffect: ', type);
  yield call(
    [Alert, Alert.alert],
    type,
    'This is a fake side effect ONLY running on online mode',
  );
}

function* doNewSideEffect({ type }: { type: string }) {
  console.log('doNewSideEffectdoNewSideEffect: ', type);
  yield call(
    [Alert, Alert.alert],
    type,
    'This is a fake side effect ONLY running on online mode',
  );
}

export default function* rootSaga() {
  yield all([
    yield takeEvery(['ADD_ONE', 'SUB_ONE'], doSideEffect),
    yield takeEvery('NEW_ADD_ONE', doNewSideEffect),
    fork(networkSaga),
  ]);
}
