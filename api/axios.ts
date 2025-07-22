import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { logger } from "@/utils/logger";

const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    logger.apiRequest(
      config.method?.toUpperCase() || "GET",
      config.url || "",
      config.data
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logger.apiError("REQUEST", error.config?.url || "", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // logger.apiResponse(
    //   response.config.method?.toUpperCase() || 'GET',
    //   response.config.url || '',
    //   response.status,
    //   response.data
    // );
    return response;
  },
  (error) => {
    // logger.apiError(
    //   error.config?.method?.toUpperCase() || 'GET',
    //   error.config?.url || '',
    //   error
    // );
    return Promise.reject(error);
  }
);
export default api;
