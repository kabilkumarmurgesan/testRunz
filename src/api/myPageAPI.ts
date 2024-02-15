import {
  fetchRunsStart,
  fetchRunsSuccess,
  fetchRunsFailure,
  fetchCalendarEventStart,
  fetchCalendarEventSuccess,
  fetchCalendarEventFailure,
} from '../features/myPageSlice';
import { GET_RUNS } from '../graphql/runs/runs.graphql';
import { CALENDER_DATA } from '../graphql/myPage/myPage.graphql';
import { client } from '../utils/config';

export const fetchMyPageRunsData = (payload: any) => async (dispatch: any) => {
  dispatch(fetchRunsStart());
  try {
    const response = await client.query({
      query: GET_RUNS,
      variables: payload,
      fetchPolicy: 'network-only',
    });
    dispatch(fetchRunsSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchRunsFailure(error.message));
  }
};

export const fetchCalendarEventData =
  (payload: any) => async (dispatch: any) => {
    dispatch(fetchCalendarEventStart());
    try {
      const response = await client.query({
        query: CALENDER_DATA,
        variables: payload,
        fetchPolicy: 'network-only',
      });
      dispatch(fetchCalendarEventSuccess(response.data));
    } catch (error: any) {
      dispatch(fetchCalendarEventFailure(error.message));
    }
  };
