import {
  POST_USER_RUNS,
  UPDATE_USER_RUNS,
  GET_SINGLE_USER_RUNS,
} from '../graphql/userRuns/userRunz.graphql';
import { client } from '../utils/config';

export const postUserRunsData = (payload: any) => async () => {
  try {
    const response = await client.mutate({
      mutation: POST_USER_RUNS,
      variables: payload,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const UpdateUserRunsData = (payload: any) => async () => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_USER_RUNS,
      variables: payload,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchSingleUserRunzData =
  (payload: any) => async (dispatch: any) => {
    // dispatch(fetchUserStart());
    try {
      const response = await client.query({
        query: GET_SINGLE_USER_RUNS,
        variables: payload,
        fetchPolicy: 'network-only',
      });
      return response.data;
      // dispatch(fetchUserSuccess(response.data));
    } catch (error: any) {
      return error;
      // dispatch(fetchUserFailure(error.message));
    }
  };
