import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_IMAGE_KEY = "fitpulse.profile.image";

export async function getProfileImage(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
  } catch {
    return null;
  }
}

export async function saveProfileImage(
  uri: string
): Promise<void> {
  await AsyncStorage.setItem(
    PROFILE_IMAGE_KEY,
    uri
  );
}

export async function removeProfileImage(): Promise<void> {
  await AsyncStorage.removeItem(
    PROFILE_IMAGE_KEY
  );
}