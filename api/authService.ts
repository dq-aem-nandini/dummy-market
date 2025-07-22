import axios from "./axios";
import { LoginRequest, LoginResponse, RegisterRequest } from "./types";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log("Attempting for login ", credentials);
    const response = await axios.post("/web/api/v1/auth/login", credentials);
    // console.log("Response",response.data)

    return response.data; // since wrapped in WebResponseDTO
  },
  register: async (userData: RegisterRequest) => {
    try {
      const formData = new FormData();

      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
        console.log(`${key}: ${value}`); // Debug log
      });

      const response = await axios.post("/web/api/v1/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error: any) {
      console.error(
        "Register API error:",
        error?.response?.data || error.message
      );
      throw error;
    }
  },

  getProfile: async (userId: string, token: string): Promise<any> => {
    const response = await axios.get(`/web/api/v1/user/view`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        userId,
      },
    });
    return response.data.response;
  },
};
