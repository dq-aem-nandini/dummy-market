import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const savedName = await AsyncStorage.getItem("profileName");
      const savedBio = await AsyncStorage.getItem("profileBio");
      if (savedName) setName(savedName);
      if (savedBio) setBio(savedBio);
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem("profileName", name);
    await AsyncStorage.setItem("profileBio", bio);
    alert("Profile updated!");
    router.back();
  };

  return (
    <View className="flex-1 bg-white px-4 py-6">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="ml-4 text-3xl font-bold">Edit Profile</Text>
      </View>

      {/* Name Input */}
      <Text className="font mb-1 text-xl">Name</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      {/* Bio Input */}
      <Text className="font-semibold mb-1 text-xl">Bio</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
        value={bio}
        onChangeText={setBio}
        placeholder="Enter your bio"
      />

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-purple-600 p-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold text-xl">
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
}
