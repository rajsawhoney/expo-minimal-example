import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useMediaPicker } from "@/components/useMediaPicker";

export default function TabOneScreen() {
  const { media, pickMedia } = useMediaPicker();
  const handleUpload = () => {
    const task = FileSystem.createUploadTask(
      "<s3-pre-signed-url>",
      media?.uri as string,
      {
        sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          "Content-Type": "video/mp4",
        },
      },
      (result) => {
        const { totalBytesSent, totalBytesExpectedToSend } = result;
        console.log(
          "UploadTask Progress:",
          `${((totalBytesSent / totalBytesExpectedToSend) * 100).toFixed(0)}%`
        );
      }
    );
    task
      .uploadAsync()
      .then((res) => {
        if (res != null && res?.status >= 200 && res?.status < 300) {
          console.log("File Uploaded!", res);
        } else {
          console.log("Failed to upload!", res);
        }
      })
      .catch((err: Error) => {
        console.log("Failed to upload!", err);
      });
  };

  const pickYourVideo = async () => {
    await pickMedia({ mediaTypes: ImagePicker.MediaTypeOptions.Videos });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { width: "80%", textAlign: "center" }]}>
        Upload File using Expo-File-System
      </Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Pressable
        onPress={pickYourVideo}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ color: "blue", fontSize: 20 }}>Pick File</Text>
        {media != null && (
          <Text style={{ color: "red", fontSize: 20 }}>
            Selected: {media?.mimeType}
          </Text>
        )}
      </Pressable>
      <Pressable
        onPress={handleUpload}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <Text style={{ color: "blue", fontSize: 20 }}>Upload File</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
