import { Slot, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function AuthLayout() {
  const { userToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userToken) {
      router.replace("/(root)/(tabs)");
    }
  }, [userToken]);

  return <Slot />;
}
