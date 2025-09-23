import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Message {
  id: string;
  text: string;
  sent_by: string;
  chat_id: string;
  created_at: string;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams(); // chatId
  const navigation = useNavigation();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatUser, setChatUser] = useState("Chat");

  // 📌 Cargar mensajes iniciales
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", id)
        .order("created_at", { ascending: true });

      if (!error && data) setMessages(data as Message[]);
    };

    loadMessages();
  }, [id]);

  // 📌 Suscribirse a mensajes en tiempo real
  useEffect(() => {
    const channel = supabase
      .channel(`messages:chat:${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // 📌 Obtener nombre del otro usuario y cambiar título del header
  useEffect(() => {
    const fetchOtherUser = async () => {
      if (!id || !user?.id) return;

      const { data: chat } = await supabase
        .from("chats")
        .select("user_id, user_id2")
        .eq("id", id)
        .single();

      if (chat) {
        const otherUserId = chat.user_id === user.id ? chat.user_id2 : chat.user_id;

        const { data: otherProfile } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", otherUserId)
          .single();

        if (otherProfile) {
          setChatUser(otherProfile.name);
          navigation.setOptions({
            title: otherProfile.name,
            headerStyle: { backgroundColor: "#0f1522" },
            headerTintColor: "#fff",
          });
        }
      }
    };

    fetchOtherUser();
  }, [id, user]);

  // 📌 Enviar mensaje con optimistic update
  const sendMessage = async () => {
    if (!input.trim() || !user?.id) return;

    // Mensaje temporal
    const tempMessage: Message = {
      id: Date.now().toString(), // ✅ ID temporal con timestamp
      text: input.trim(),
      sent_by: user.id,
      chat_id: id as string,
      created_at: new Date().toISOString(),
    };

    // Agregarlo al estado de inmediato
    setMessages((prev) => [...prev, tempMessage]);
    setInput("");

    // Guardar en Supabase
    const { error } = await supabase.from("messages").insert([
      {
        text: tempMessage.text,
        sent_by: user.id,
        chat_id: id,
      },
    ]);

    if (error) {
      console.error("❌ Error enviando mensaje:", error);
      // Si falla, quitamos el mensaje temporal
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f1522" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sent_by === user?.id
                  ? styles.myMessage
                  : styles.otherMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 12 }}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 12,
  },
  myMessage: { backgroundColor: "#7a5cff", alignSelf: "flex-end" },
  otherMessage: { backgroundColor: "#1a2131", alignSelf: "flex-start" },
  messageText: { color: "#fff", fontSize: 16 },
  timestamp: {
    color: "#ccc",
    fontSize: 10,
    textAlign: "right",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#1a2131",
    borderRadius: 24,
    padding: 8,
    margin: 8,
    alignItems: "center",
  },
  input: { flex: 1, color: "#fff", paddingHorizontal: 12 },
  sendButton: {
    backgroundColor: "#7a5cff",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: { color: "#fff", fontWeight: "600" },
});
