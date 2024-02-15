import {
    fetchNotificationStart,
    fetchNotificationSuccess,
    fetchNotificationFailure,
} from '../features/notificationSlice';
import { GET_ALL_NOTIFICATION,GET_SINGLE_NOTIFICATION ,UPDATE_NOTIFICATION} from '../graphql/notification/notification.graphql';
import { client } from '../utils/config';

export const fetchNotificationData = () => async (dispatch: any) => {
    dispatch(fetchNotificationStart());
    try {
        const response = await client.query({
            query: GET_ALL_NOTIFICATION,
            fetchPolicy: 'network-only',
        });
        dispatch(fetchNotificationSuccess(response.data));
    } catch (error: any) {
        dispatch(fetchNotificationFailure(error.message));
    }
};

export const fetchUserNotificationData = (payload:any) => async (dispatch:any) => {
    // dispatch(fetchNotificationStart());
    try {
        const response = await client.query({
            query: GET_SINGLE_NOTIFICATION,
            variables: payload,
            fetchPolicy: 'network-only',
        });
        console.log("response1",response);
        return response.data
        // dispatch(fetchNotificationSuccess(response.data));
    } catch (error: any) {
        // dispatch(fetchNotificationFailure(error.message));
    }
};
export const fetchUpdateNotification = (payload: any) => async () => {
    console.log("payload",payload)

    try {
      const response = await client.mutate({
        mutation: UPDATE_NOTIFICATION,
        variables: payload
      });
    
      console.log("response",response);
    } catch (error: any) {
      console.log(error);
    }
  };

