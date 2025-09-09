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

export default function ResetPasswordScreen() {
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

          <Text style={s.titleText}>Reset your password</Text>
          <Text style={s.descText}>
            Enter your email and set a new password.
          </Text>

          <View style={s.form}>
            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                placeholder="Email"
                placeholderTextColor="#98a0ab"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
              />
            </View>

            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                placeholder="New Password"
                placeholderTextColor="#98a0ab"
                secureTextEntry
                editable={false}
              />
            </View>

            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                placeholder="Confirm New Password"
                placeholderTextColor="#98a0ab"
                secureTextEntry
                editable={false}
              />
            </View>

            <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85}>
              <Text style={s.primaryText}>Change Password</Text>
            </TouchableOpacity>

            <View style={s.footerRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/login")}
              >
                <Text style={[s.footerText, { textDecorationLine: "underline" }]}>
                  Back to Sign In
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
    marginBottom: 16,
  },
  logo: { width: 144, height: 144, marginBottom: 8 },
  titleText: {
    color: "#e8eef9",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  descText: {
    color: "#b0b8c8",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
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

  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#c9d1de" },
});