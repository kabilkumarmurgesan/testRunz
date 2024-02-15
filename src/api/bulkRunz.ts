import {
    fetchbulkRunzStart,
    fetchbulkRunzSuccess,
    fetchbulkRunzFailure,
  } from '../features/bulkRunz'
  import {POST_BULKRUNZ,SHARE_RUNZ} from '../graphql/bulkRunz/bulkRunz.graphql';
  import { client } from '../utils/config';
export const fetchbulkRunz = (payload: any) => async () => {
    try {
      const response = await client.mutate({
        mutation: POST_BULKRUNZ,
        variables: payload,
      });
      console.log(response);
    } catch (error: any) {
      console.log(error);
    }
  };
  export const fetchShareRunz = (payload: any) => async () => {
    try {
      const response = await client.mutate({
        mutation: SHARE_RUNZ,
        variables: payload,
      });
      console.log(response);
    } catch (error: any) {
      console.log(error);
    }
  };
  