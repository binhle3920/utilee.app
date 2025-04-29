import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { firebaseAuth } from './firebase.ts';

const requestAuthInterceptor = async (req: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const token = await firebaseAuth.currentUser?.getIdToken();
  const headers = {
    ...req.headers
  } as unknown as AxiosRequestHeaders;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    ...req,
    headers
  } as unknown as InternalAxiosRequestConfig;
};

const responseFulfilledInterceptor = (res: AxiosResponse): AxiosResponse => {
  if (res.data.error) {
    throw new Error(res.data.message);
  }

  return res;
};

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

instance.interceptors.request.use(requestAuthInterceptor);
instance.interceptors.response.use(responseFulfilledInterceptor);

export default instance;
