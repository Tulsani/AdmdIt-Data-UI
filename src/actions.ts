import { AxiosResponse } from "axios";
import { fileUploadAxiosApi, studentAxiosApi } from "./AxiosApi";

export const getSignedUrl = (fileType: any) => {
  return fileUploadAxiosApi
    .post(`/AD-SDC-UploaderService?fileType=${fileType}`, {
      details: {},
    })
    .then((res) => res)
    .catch((err) => err);
};

export const putFileToS3 = (url: string, file: any, contentType: any) => {
  console.log({ url, file, contentType });
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    mode: "cors",
    body: file,
  });
};

export const doSubmitForm = async (requestBody: any): Promise<any> => {
  const response: AxiosResponse = await fileUploadAxiosApi({
    method: "POST",
    url: "/AD-SDC-UploaderService",
    data: requestBody,
  });
  console.log({ response });
  return response?.data;
};

export const getStudentDetailsById = async (userId: string): Promise<any> => {
  const response: AxiosResponse = await studentAxiosApi({
    method: "GET",
    url: `/AD-SDC-StudentLifecycleMangementService?flowSelected=get-user-by-id&userId=${userId}`,
  });
  console.log({ response });
  return response?.data;
};
