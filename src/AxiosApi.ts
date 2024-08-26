import axios, { AxiosInstance } from "axios";

export const fileUploadAxiosApi: AxiosInstance = axios.create({
  baseURL: "https://v1r6vpt7gf.execute-api.ap-south-1.amazonaws.com/default",
});
export const studentAxiosApi: AxiosInstance = axios.create({
  baseURL: "https://z3orszb22h.execute-api.ap-south-1.amazonaws.com/default",
});

const handleSuccess = (response: any) => {
  return response;
};
const handleError = (error: any) => {
  console.log({ error });
  return Promise.reject(error.response);
};
fileUploadAxiosApi.interceptors.response.use(handleSuccess, handleError);
studentAxiosApi.interceptors.response.use(handleSuccess, handleError);
