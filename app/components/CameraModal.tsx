import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type CameraModalProps = {
  visible: boolean;
  onClose: () => void;
  onPictureTaken: (uri: string) => void;
};

export default function CameraModal({
  visible,
  onClose,
  onPictureTaken,
}: CameraModalProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  async function takePicture() {
    if (cameraRef.current) {
      const picture = await cameraRef.current.takePictureAsync();
      setPhoto(picture.uri);
    }
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  function handleUsePhoto() {
    if (photo) {
      onPictureTaken(photo); // ✅ enviamos la foto al padre
    }
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {!permission ? (
          <View />
        ) : !permission.granted ? (
          <View style={styles.container}>
            <Text style={styles.message}>
              Necesitamos tu permiso para usar la cámara
            </Text>
            <TouchableOpacity style={styles.button} onPress={requestPermission}>
              <Text style={styles.text}>Conceder permiso</Text>
            </TouchableOpacity>
          </View>
        ) : photo ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: photo }} style={styles.preview} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setPhoto(null)}
              >
                <Text style={styles.text}>Reintentar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleUsePhoto}>
                <Text style={styles.text}>Usar Foto</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.text}>Cambiar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Text style={styles.text}>Capturar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.text}>Galería</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.text}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "black" },
  message: { textAlign: "center", paddingBottom: 10, color: "white" },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 8,
  },
  text: { fontSize: 16, fontWeight: "600", color: "white" },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: "80%",
    borderRadius: 12,
  },
});