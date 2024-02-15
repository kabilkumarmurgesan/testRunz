import {
  fileUploadStart,
  fileUploadSuccess,
  fileUploadFailure,
} from '../features/fileUploadSlice';
import { FILE_UPLOAD } from '../graphql/file-upload/file-upload.graphql';
import { client } from '../utils/config';

export const fileUploadData = (payload: any) => async (dispatch: any) => {

  dispatch(fileUploadStart());
  try {
    const response = await client.mutate({
      mutation: FILE_UPLOAD,
      variables: payload,
    });

    dispatch(fileUploadSuccess(response.data));
    console.log(response);
  } catch (error: any) {
    console.log(error);
    dispatch(fileUploadFailure(error));
  }
};
