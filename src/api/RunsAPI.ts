import {
  fetchRunsStart,
  fetchRunsSuccess,
  fetchRunsFailure,
  fetchChartTableStart,
  fetchChartTableSuccess,
  fetchChartTableFailure,
} from '../features/runsSlice';
import {
  GET_RUNS,
  POST_RUNS,
  DELETE_RUNS,
  GET_SINGLE_RUNS,
  UPDATE_RUNS,
  GET_CHART_TABLE
} from '../graphql/runs/runs.graphql';
import { client } from '../utils/config';

export const fetchRunsData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchRunsStart());
  try {
    const response = await client.query({
      query: GET_RUNS,
      variables: payload,
      fetchPolicy: 'network-only',
    });
    console.log('reponse.data786', response.data);
    dispatch(fetchRunsSuccess(response.data));
    return response.data
  } catch (error: any) {
    dispatch(fetchRunsFailure(error.message));
  }
};

export const postRunsData = (payload: any) => async () => {
  try {
    const response = await client.mutate({
      mutation: POST_RUNS,
      variables: payload,
    });
    console.log(response);
  } catch (error: any) {
    console.log(error);
  }
};
export const deleteRunsData = (payload: any) => async () => {
  try {
    const response = await client.mutate({
      mutation: DELETE_RUNS,
      variables: payload,
    });
    console.log(response);
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchSingleRunsData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchRunsStart());
  try {
    const response = await client.query({
      query: GET_SINGLE_RUNS,
      variables: payload,
      fetchPolicy: 'network-only',
    });
    dispatch(fetchRunsSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchRunsFailure(error.message));
  }
};

export const fetchUpdateRunsData = (payload: any) => async () => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_RUNS,
      variables: payload,
    });
    console.log(response);
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchTableChartData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchChartTableStart());
  try {
    const response = await client.query({
      query: GET_CHART_TABLE,
      variables: payload,
      fetchPolicy: 'network-only',
    });
    dispatch(fetchChartTableSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchChartTableFailure(error.message));
  }
};
