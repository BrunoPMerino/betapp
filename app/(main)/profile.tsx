import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import CameraModal from "../components/CameraModal";

export default function ProfileScreen() {
  const { user, updateProfile, setUser } = useContext(AuthContext);

  const [username, setUsername] = useState(user?.username || "");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [editing, setEditing] = useState(false);

  // 📸 estado para avatar y modal
  const [photo, setPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

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

          {/* Username */}
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

          {/* Nombre */}
          <View style={s.section}>
            <Text style={s.label}>Nombre:</Text>
            {editing ? (
              <TextInput style={s.input} value={name} onChangeText={setName} />
            ) : (
              <Text style={s.value}>{name || "No definido"}</Text>
            )}
          </View>

          {/* Teléfono */}
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

          {/* Género */}
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

          {/* Biografía */}
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

          {/* Botón de guardar / editar */}
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

      {/* 📸 Modal de cámara */}
      <CameraModal
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onPictureTaken={(uri) => setPhoto(uri)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1522",
  },
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
  label: {
    color: "#c9d1de",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  value: {
    color: "#e8eef9",
    fontSize: 16,
    fontWeight: "700",
  },
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
  addBalanceText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
