import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import { decode } from "base64-arraybuffer";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useRef, useState } from "react";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type CameraModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (url: string) => void;
};

export default function CameraModal({
  isVisible,
  onClose,
  onConfirm,
}: CameraModalProps) {
  const { user } = useContext(AuthContext);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<{ uri: string; base64: string } | null>(
    null
  );
  const cameraRef = useRef<CameraView | null>(null);

  async function takePicture() {
    if (cameraRef.current) {
      const picture = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });
      if (picture?.uri && picture?.base64) {
        setPhoto({ uri: picture.uri, base64: picture.base64 });
      }
    }
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].uri && result.assets[0].base64) {
      setPhoto({
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
      });
    }
  }

  async function handleSaveImageBucket() {
    if (!photo || !user?.id) return;

    try {
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, decode(photo.base64), {
          contentType: "image/jpg",
          upsert: true,
        });

      if (error) throw error;

      // Obtener URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      onConfirm(publicUrl);
    } catch (err) {
      console.log("❌ Error subiendo imagen:", err);
    } finally {
      onClose();
    }
  }

  return (
    <Modal visible={isVisible} animationType="slide">
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
            <Image source={{ uri: photo.uri }} style={styles.preview} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setPhoto(null)}
              >
                <Text style={styles.text}>Reintentar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSaveImageBucket}
              >
                <Text style={styles.text}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  setFacing((c) => (c === "back" ? "front" : "back"))
                }
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
  preview: { width: "100%", height: "80%", borderRadius: 12 },
});
