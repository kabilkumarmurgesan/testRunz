import { fetchNotificationMessageFailure, fetchNotificationMessageStart, fetchNotificationMessageSuccess } from "../features/notificationMessageSlice";
import { GET_NOTIFICATION_MESSAGE ,READ_SINGLE_NOTIFICATION_MESSAGE, READ_BULK_NOTIFICATION_MESSAGE} from '../graphql/notification_message/notification_message.graphql'
import { client } from '../utils/config';

export const fetchNotificationMessageData = (payload: any)=> async (dispatch: any) => {
    dispatch(fetchNotificationMessageStart());
    try {
        const response = await client.query({
            query: GET_NOTIFICATION_MESSAGE,
            variables: payload,
            fetchPolicy: 'network-only',
        })
        dispatch(fetchNotificationMessageSuccess(response.data));

        console.log('response',response)
        return response
    } catch (error: any) {
        dispatch(fetchNotificationMessageFailure(error.message))   
    }
};

export const fetchReadSingleMessageData = (payload: any)=> async (dispatch: any) => {
    try {
        const response = await client.mutate({
            mutation: READ_SINGLE_NOTIFICATION_MESSAGE,
            variables: payload,
        })

        console.log('response',response)

    } catch (error: any) {
    }
};
export const fetchReadBulkMessageData = (payload: any)=> async (dispatch: any) => {
    try {
        const response = await client.mutate({
            mutation: READ_BULK_NOTIFICATION_MESSAGE,
            variables: payload,
        })

        console.log('response',response)

    } catch (error: any) {
    }
};

