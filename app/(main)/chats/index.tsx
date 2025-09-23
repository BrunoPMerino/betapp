import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
}

export default function Users() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);

  // 📌 Cargar usuarios desde Supabase
  useEffect(() => {
    const loadUsers = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, name, avatar_url")
        .neq("id", user.id);

      if (!error && data) setUsers(data as Profile[]);
    };

    loadUsers();
  }, [user]);

  // 📌 Iniciar chat con un usuario
  const startChat = async (otherUserId: string) => {
    if (!user?.id) return;

    try {
      // 1. Buscar si ya existe el chat
      const { data: existingChat } = await supabase
        .from("chats")
        .select("id")
        .or(
          `and(user_id.eq.${user.id},user_id2.eq.${otherUserId}),and(user_id.eq.${otherUserId},user_id2.eq.${user.id})`
        )
        .maybeSingle();

      let chatId = existingChat?.id;

      // 2. Crear chat si no existe
      if (!chatId) {
        const { data, error: insertError } = await supabase
          .from("chats")
          .insert([{ user_id: user.id, user_id2: otherUserId }])
          .select("id")
          .single();

        if (insertError) throw insertError;
        chatId = data.id;
      }

      // 3. Redirigir al chat
      router.push({ pathname: "/chats/[id]", params: { id: chatId } });
    } catch (err) {
      console.error("❌ Error iniciando chat:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => startChat(item.id)}
          >
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0f1522" },
  title: { color: "#fff", fontSize: 20, marginBottom: 20, fontWeight: "bold" },
  userCard: {
    backgroundColor: "#1a2131",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  userName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  userEmail: { color: "#bbb", fontSize: 12 },
});
