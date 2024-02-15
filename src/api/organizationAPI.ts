import { fetchOrganizationStart,fetchOrganizationFailure,fetchOrganizationSuccess } from '../features/organizationSlice';
import {GET_ORGANIZATION} from '../graphql/organization/organization.graphql'
  import { client } from '../utils/config';
  
  export const fetchOrganizationData = () => async (dispatch: any) => {
    dispatch(fetchOrganizationStart());
    try {
      const response = await client.query({
        query: GET_ORGANIZATION,
        fetchPolicy: 'network-only',
      });
      dispatch(fetchOrganizationSuccess(response.data));
      return response.data
    } catch (error: any) {
      dispatch(fetchOrganizationFailure(error.message));
    }
  };

  export const fetchOrganizationById = (payload:any) => async (dispatch: any) => {
    dispatch(fetchOrganizationStart());
    try {
      const response = await client.query({
        query: GET_ORGANIZATION,
        variables: payload,
        fetchPolicy: 'network-only',
      });
      dispatch(fetchOrganizationSuccess(response.data));
      return response.data
    } catch (error: any) {
      dispatch(fetchOrganizationFailure(error.message));
    }
  };