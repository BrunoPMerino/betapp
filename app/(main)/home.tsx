import React from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>Juegos Disponibles</Text>

        <View style={s.card}>
          <Text style={s.gameTitle}>Poker</Text>
          <Image
            source={require("../../assets/images/poker.jpg")}
            style={s.gameImage}
            resizeMode="cover"
          />
        </View>

        <View style={s.card}>
          <Text style={s.gameTitle}>Blackjack</Text>
          <Image
            source={require("../../assets/images/blackjack.png")}
            style={s.gameImage}
            resizeMode="cover"
          />
        </View>

        <View style={s.card}>
          <Text style={s.gameTitle}>Ruleta</Text>
          <Image
            source={require("../../assets/images/ruleta.jpg")}
            style={s.gameImage}
            resizeMode="cover"
          />
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
    padding: 24,
    alignItems: "center",
  },
  title: {
    color: "#e8eef9",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    marginBottom: 24,
    backgroundColor: "#1a2131",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
  },
  gameTitle: {
    color: "#b8c1ff",
    fontSize: 18,
    fontWeight: "600",
    padding: 12,
    backgroundColor: "#252c3a",
  },
  gameImage: {
    width: "100%",
    height: 180,
  },
});