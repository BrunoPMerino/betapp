import React from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.profileCard}>
          <Image
            source={require("../../assets/images/logo-betapp2.png")}
            style={s.avatar}
          />
          <Text style={s.name}>Bruno Pérez</Text>
          <Text style={s.email}>bruno.perez@example.com</Text>

          <View style={s.section}>
            <Text style={s.label}>Balance:</Text>
            <Text style={s.value}>$12,450.00</Text>
          </View>

          <View style={s.section}>
            <Text style={s.label}>Juegos Ganados:</Text>
            <Text style={s.value}>87</Text>
          </View>

          <View style={s.section}>
            <Text style={s.label}>Juegos de Poker:</Text>
            <Text style={s.value}>134</Text>
          </View>

          <View style={s.section}>
            <Text style={s.label}>Juegos de Blackjack:</Text>
            <Text style={s.value}>102</Text>
          </View>

          <View style={s.section}>
            <Text style={s.label}>Mayor Ganancia:</Text>
            <Text style={s.value}>$4,000.00</Text>
          </View>

          <TouchableOpacity style={s.addBalanceBtn} activeOpacity={0.85}>
            <Text style={s.addBalanceText}>Agregar Saldo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginBottom: 4,
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#c9d1de",
    fontSize: 16,
    fontWeight: "500",
  },
  value: {
    color: "#e8eef9",
    fontSize: 16,
    fontWeight: "700",
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