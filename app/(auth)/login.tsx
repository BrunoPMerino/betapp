import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView style={s.keyboard}>
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
                placeholder="Email"
                placeholderTextColor="#98a0ab"
                editable={false}
              />
            </View>

            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                placeholder="Password"
                placeholderTextColor="#98a0ab"
                secureTextEntry
                editable={false}
              />
              <Text style={s.rightIcon}>👁️</Text>
            </View>

            <TouchableOpacity
              style={s.linkRight}
              activeOpacity={0.8}
              onPress={() => router.push("/reset")}
            >
              <Text style={s.linkText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={s.primaryBtn} 
            activeOpacity={0.85}
            onPress={() => router.push("../(main)/home")}
            >
              <Text style={s.primaryText}>Sign In</Text>
            </TouchableOpacity>

            <Text style={s.dividerText}>Or sign in with</Text>

            <View style={s.socialRow}>
              <TouchableOpacity style={s.socialBtn} activeOpacity={0.8}>
                <Text style={s.socialTxt}>f</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.socialBtn} activeOpacity={0.8}>
                <Text style={s.socialTxt}>G+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.socialBtn} activeOpacity={0.8}>
                <Text style={s.socialTxt}>t</Text>
              </TouchableOpacity>
            </View>

            <View style={s.footerRow}>
              <Text style={s.footerText}>Don’t have an account? </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/register")}
              >
                <Text style={[s.footerText, { textDecorationLine: "underline" }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1522" },
  keyboard: { flex: 1 },
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
  logo: { width: 144, height: 144, marginBottom: 8 },
  form: { width: "100%" },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252c3a",
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 52,
    marginTop: 14,
  },
  input: { flex: 1, color: "#e8eef9", fontSize: 16, paddingVertical: 10 },
  rightIcon: { marginLeft: 8, color: "#c7cfe0", fontSize: 16 },

  linkRight: { alignSelf: "flex-end", marginTop: 10 },
  linkText: { color: "#b8c1ff" },

  primaryBtn: {
    marginTop: 18,
    backgroundColor: "#7a5cff",
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  primaryText: { color: "white", fontSize: 17, fontWeight: "700" },

  dividerText: {
    textAlign: "center",
    color: "#9aa4b3",
    marginTop: 18,
    marginBottom: 8,
  },

  socialRow: { flexDirection: "row", justifyContent: "center", gap: 14, marginTop: 4 },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2f3646",
    alignItems: "center",
    justifyContent: "center",
  },
  socialTxt: { color: "#e8eef9", fontWeight: "700" },

  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#c9d1de" },
});