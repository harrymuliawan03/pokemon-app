import axios, {AxiosRequestConfig} from 'axios';
import {API_URL} from './env';

export const getData = async (url: string): Promise<any> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        Accept: 'application/json',
      },
    };

    const response = await axios.get(`${API_URL}${url}`, config);

    return response.data;
  } catch (error) {
    return error;
  }
};
