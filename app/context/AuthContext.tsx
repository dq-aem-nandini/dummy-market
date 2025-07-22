import { authService } from "@/api/authService";
import { RegisterRequest } from "@/api/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

interface User {
  userName: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

interface AuthContextProps {
  user: User | null;
  userToken: string | null; // ✅ Added token to context
  login: (userName: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null); // ✅
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredUser = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const storedUser = await AsyncStorage.getItem("userData");
      if (token && storedUser) {
        setUserToken(token);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    loadStoredUser();
  }, []);

  const login = async (userName: string, password: string) => {
    try {
      const data = await authService.login({ userName, password });

      const userData: User = {
        userName,
        name: data.name,
        email: data.email,
        isLoggedIn: true,
      };

      await AsyncStorage.setItem("userToken", data.accessToken);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      await AsyncStorage.setItem("userId", data.headerUserId);

      setUser(userData);
      setUserToken(data.accessToken);
    } catch (error) {
      Alert.alert("Login Failed", "Invalid credentials");
      throw error;
    }
  };

  const register = async (form: RegisterRequest) => {
    try {
      console.log("Inside Auth Context", form);
      const response = await authService.register(form);
      Alert.alert(
        "Registered successfully!",
        response?.data?.message || "Registration successful!"
      );
    } catch (err) {
      Alert.alert("Registration Failed", "Check your inputs");
      throw err;
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, userToken, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
