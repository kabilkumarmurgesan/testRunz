import {
  fetchAssetsStart,
  fetchAssetsSuccess,
  fetchAssetsFailure,
} from '../features/assetsSlice';
import { GET_ASSETS_NAMES, GET_ASSETS, POST_ASSETS, DELETE_ASSETS, GET_SINGLE_ASSETS ,UPDATE_ASSETS,GET_PROCEDURE_ASSETS,GET_ALL_RUNS_PROCEDURE} from '../graphql/assets/assets.graphql';
import { client } from '../utils/config';

export const fetchAssetsData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchAssetsStart());
  try {
    const response = await client.query({
      query: GET_ASSETS,
      variables: payload,
      fetchPolicy: 'network-only',
    });
    dispatch(fetchAssetsSuccess(response.data));
    return response.data
  } catch (error: any) {
    dispatch(fetchAssetsFailure(error.message));
  }
};

export const postAssetsData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await client.mutate({
      mutation: POST_ASSETS,
      variables: payload,
    });
    console.log(response);
    const q: any = { page: 1, perPage: 10, sortOrder: 'desc' };
    dispatch(fetchAssetsData(q));
  } catch (error: any) {
    console.log(error);
  }
};

export const deleteAssetsData = (payload: any) => async () => {
  try {
    const response = await client.mutate({
      mutation: DELETE_ASSETS,
      variables: payload,
    });
    console.log(response);
    return response.data
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchSingleAssetsData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchAssetsStart());
  try {
    const response = await client.query({
      query: GET_SINGLE_ASSETS,
      variables: payload,
      fetchPolicy: 'network-only',
    });
    dispatch(fetchAssetsSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchAssetsFailure(error.message));
  }
};

export const fetchUpdateAssetsData = (payload: any) => async () => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_ASSETS,
      variables: payload,
    });
    console.log(response);
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchAssetsName = () => async (dispatch: any) => {
  dispatch(fetchAssetsStart());
  try {
    const response = await client.query({
      query: GET_ASSETS_NAMES,
      fetchPolicy: 'network-only',
    });
    dispatch(fetchAssetsSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchAssetsFailure(error.message));
  }
};

export const fetchProcedureByAssetsName = (payload:any) => async (dispatch: any) => {
  dispatch(fetchAssetsStart());
  try {
    const response = await client.query({
      query: GET_PROCEDURE_ASSETS,
      variables: payload,
    });
    dispatch(fetchAssetsSuccess(response.data));
    return response.data
  } catch (error: any) {
    dispatch(fetchAssetsFailure(error.message));
  }
};
export const fetchRunsByProcedure = (payload:any) => async (dispatch: any) => {
  // dispatch(fetchAssetsStart());
  try {
    const response = await client.query({
      query: GET_ALL_RUNS_PROCEDURE,
      variables: payload,
    });
    // dispatch(fetchAssetsSuccess(response.data));
    return response.data
  } catch (error: any) {
    // dispatch(fetchAssetsFailure(error.message));
  }
};