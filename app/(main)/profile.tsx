import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useContext, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

export default function ProfileScreen() {
  const { user, updateProfile, setUser } = useContext(AuthContext);

  const [username, setUsername] = useState(user?.username || "");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [editing, setEditing] = useState(false);

  // 📸 estados cámara
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  const handleSave = async () => {
    const updated = { username, name, phone, gender, bio };
    const success = await updateProfile(updated);

    if (success && user?.id) {
      setUser({ ...user, ...updated, id: user.id });
      Alert.alert("Perfil actualizado correctamente");
      setEditing(false);
    } else {
      Alert.alert("Error al actualizar perfil");
    }
  };

  async function takePicture() {
    if (cameraRef.current) {
      const picture = await cameraRef.current.takePictureAsync();
      setPhoto(picture.uri);
    }
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.profileCard}>
          {/* 👤 Imagen de perfil */}
          {photo ? (
            <Image source={{ uri: photo }} style={s.avatar} />
          ) : (
            <Image
              source={require("../../assets/images/logo-betapp2.png")}
              style={s.avatar}
            />
          )}

          <Text style={s.name}>{username || "Sin usuario"}</Text>
          <Text style={s.email}>{user?.email || "email@example.com"}</Text>

          {/* Campos */}
          <View style={s.section}>
            <Text style={s.label}>Nombre de usuario:</Text>
            {editing ? (
              <TextInput
                style={s.input}
                value={username}
                autoCapitalize="none"
                onChangeText={setUsername}
              />
            ) : (
              <Text style={s.value}>{username || "No definido"}</Text>
            )}
          </View>

          <View style={s.section}>
            <Text style={s.label}>Nombre:</Text>
            {editing ? (
              <TextInput style={s.input} value={name} onChangeText={setName} />
            ) : (
              <Text style={s.value}>{name || "No definido"}</Text>
            )}
          </View>

          <View style={s.section}>
            <Text style={s.label}>Teléfono:</Text>
            {editing ? (
              <TextInput
                style={s.input}
                value={phone}
                keyboardType="phone-pad"
                onChangeText={setPhone}
              />
            ) : (
              <Text style={s.value}>{phone || "No definido"}</Text>
            )}
          </View>

          <View style={s.section}>
            <Text style={s.label}>Género:</Text>
            {editing ? (
              <TextInput
                style={s.input}
                value={gender}
                onChangeText={setGender}
              />
            ) : (
              <Text style={s.value}>{gender || "No definido"}</Text>
            )}
          </View>

          <View style={s.section}>
            <Text style={s.label}>Biografía:</Text>
            {editing ? (
              <TextInput
                style={[s.input, { height: 60 }]}
                multiline
                value={bio}
                onChangeText={setBio}
              />
            ) : (
              <Text style={s.value}>{bio || "No definida"}</Text>
            )}
          </View>

          {/* Botón de guardar */}
          <TouchableOpacity
            style={s.addBalanceBtn}
            activeOpacity={0.85}
            onPress={editing ? handleSave : () => setEditing(true)}
          >
            <Text style={s.addBalanceText}>
              {editing ? "Guardar Cambios" : "Modificar Perfil"}
            </Text>
          </TouchableOpacity>

          {/* Botón abrir cámara */}
          <TouchableOpacity
            style={[s.addBalanceBtn, { backgroundColor: "#ff914d" }]}
            activeOpacity={0.85}
            onPress={() => setShowCamera(true)}
          >
            <Text style={s.addBalanceText}>Abrir Cámara</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 📸 Modal cámara */}
      <Modal visible={showCamera} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "black" }}>
          {!permission ? (
            <View />
          ) : !permission.granted ? (
            <View style={styles.container}>
              <Text style={styles.message}>
                Necesitamos tu permiso para usar la cámara
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={requestPermission}
              >
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
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setShowCamera(false)}
                >
                  <Text style={styles.text}>Usar Foto</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
              />
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
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setShowCamera(false)}
                >
                  <Text style={styles.text}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1522" },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  profileCard: {
    backgroundColor: "#1a2131",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 380,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  name: {
    color: "#e8eef9",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 2,
  },
  email: {
    color: "#b0b8c8",
    fontSize: 14,
    marginBottom: 24,
  },
  section: {
    width: "100%",
    backgroundColor: "#252c3a",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  label: { color: "#c9d1de", fontSize: 16, fontWeight: "500", marginBottom: 6 },
  value: { color: "#e8eef9", fontSize: 16, fontWeight: "700" },
  input: {
    backgroundColor: "#1a2131",
    color: "#e8eef9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  addBalanceBtn: {
    marginTop: 20,
    backgroundColor: "#7a5cff",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 26,
  },
  addBalanceText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

// 📸 estilos de cámara
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