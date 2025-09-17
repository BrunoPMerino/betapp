import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    const success = await register({ email, name }, password);

    if (success) {
      router.replace("/(main)/home");
    } else {
      Alert.alert("Error", "No se pudo completar el registro.");
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView
        style={s.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.content}>
            {/* Logo */}
            <View style={s.header}>
              <Image
                source={require("../../assets/images/logo-betapp2.png")}
                style={s.logo}
                resizeMode="contain"
              />
            </View>

            {/* Formulario */}
            <View style={s.form}>
              <View style={s.inputWrap}>
                <TextInput
                  style={s.input}
                  placeholder="Full Name"
                  placeholderTextColor="#98a0ab"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={s.inputWrap}>
                <TextInput
                  style={s.input}
                  placeholder="Email"
                  placeholderTextColor="#98a0ab"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={s.inputWrap}>
                <TextInput
                  style={s.input}
                  placeholder="Password"
                  placeholderTextColor="#98a0ab"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                style={s.primaryBtn}
                activeOpacity={0.85}
                onPress={handleRegister}
              >
                <Text style={s.primaryText}>Register</Text>
              </TouchableOpacity>

              <View style={s.footerRow}>
                <Text style={s.footerText}>Already have an account? </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push("/login")}
                >
                  <Text
                    style={[s.footerText, { textDecorationLine: "underline" }]}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1522",
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 144,
    height: 144,
    marginBottom: 8,
  },
  form: {
    width: "100%",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252c3a",
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 52,
    marginTop: 14,
  },
  input: {
    flex: 1,
    color: "#e8eef9",
    fontSize: 16,
    paddingVertical: 10,
  },
  primaryBtn: {
    marginTop: 18,
    backgroundColor: "#7a5cff",
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  primaryText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#c9d1de",
  },
});