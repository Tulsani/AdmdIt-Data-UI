import { AxiosResponse } from "axios";
import { fileUploadAxiosApi, studentAxiosApi } from "./AxiosApi";

// export const doUploadFile = async (requestBody: any): Promise<any> => {
//   const response: AxiosResponse = await fileUploadAxiosApi({
//     method: "POST",
//     url: "/AD-SDC-UploaderService",
//     data: requestBody,
//   });
//   console.log({ response });
//   return response?.data;
// };
// export const getSignedUrl = (fileType: any) => {
//   return fileUploadAxiosApi
//     .post(`/AD-SDC-UploaderService?fileType=${fileType}`, {
//       details: {},
//     })
//     .then((res) => res)
//     .catch((err) => err);
// };

export const getSignedUrl = async (fileType: any): Promise<any> => {
  try {
    const response = await fetch(
      `https://v1r6vpt7gf.execute-api.ap-south-1.amazonaws.com/default/AD-SDC-UploaderService?fileType=${fileType}`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          details: {},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get signed URL", error);
    throw error;
  }
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
