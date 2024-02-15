import React from 'react';
import store from './src/utils/store';
import { Provider } from 'react-redux';

export const wrapRootElement = ({ element }) => {
  return <Provider store={store}>{element}</Provider>;
};