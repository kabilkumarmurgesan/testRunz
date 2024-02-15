import {
    fetchRoleStart,
    fetchRoleSuccess,
    fetchRoleFailure,
} from '../features/roleSlice';
import { FIND_ROLE, GET_ROLE, UPDATE_FIND_ROLE} from '../graphql/role/role.graphql';
import { client } from '../utils/config';

export const fetchRoleData = (payload:any) => async (dispatch: any) => {
    dispatch(fetchRoleStart());
    try {
        const response = await client.query({
            query: FIND_ROLE,
            variables: payload,
            fetchPolicy: 'network-only',
        });

        dispatch(fetchRoleSuccess(response.data));
    } catch (error: any) {
        dispatch(fetchRoleFailure(error.message));
    }
};
export const fetchSingleRoleData = (payload: any) => async (dispatch: any) => {
    dispatch(fetchRoleStart());
    try {
        const response = await client.query({
            query: FIND_ROLE,
            variables: payload,
            fetchPolicy: 'network-only',
        });
        dispatch(fetchRoleSuccess(response.data));
    } catch (error: any) {
        dispatch(fetchRoleFailure(error.message));
    }
};

export const fetchUpdateRoleData = (payload: any) => async () => {
    console.log("payload",payload)

    try {
      const response = await client.mutate({
        mutation: UPDATE_FIND_ROLE,
        variables: payload
      });
    return response.data
    //   console.log("response",response);
    } catch (error: any) {
      console.log(error);
    }
  };
