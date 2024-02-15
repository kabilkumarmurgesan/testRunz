import {  fetchinstitutionStart,
  fetchinstitutionSuccess,
  fetchinstitutionFailure} from '../features/institutionSlice'
import {GET_ALL_INSTITUTIONS} from '../graphql/institution/institution.graphql'
import { client } from '../utils/config';

export const fetchinstitutionData = () => async (dispatch: any) => {
  dispatch(fetchinstitutionStart());
  try {
    const response = await client.query({
      query: GET_ALL_INSTITUTIONS,
      fetchPolicy: 'network-only',
    });
    dispatch(fetchinstitutionSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchinstitutionFailure(error.message));
  }
};  