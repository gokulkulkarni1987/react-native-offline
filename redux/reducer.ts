import { SubOneType, AddOneType, NewAddOneType } from './actions';

const initialCount = 0;

const countReducer = (
  state = initialCount,
  action: ReturnType<SubOneType> | ReturnType<AddOneType>,
) => {
  if (action.type === 'ADD_ONE') {
    console.log('action.type: ', action.type);
    return state + 1;
  }
  if (action.type === 'SUB_ONE') {
    console.log('action.type: ', action.type);
    return state - 1;
  }

  if (action.type === 'NEW_ADD_ONE') {
    console.log('action.type: ', action.type);
    return state + 2;
  }
  return state;
};

export default countReducer;
