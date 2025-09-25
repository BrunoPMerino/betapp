import { supabase } from "@/utils/supabase";
import { createContext, useContext, useState } from "react";

interface Profile {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar_url?: string | null;
  bio?: string;
  birth_date?: string;
  phone?: string;
  gender?: string;
  updated_at?: string;
}

interface AuthContextProps {
  user: Profile | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: { email: string; name: string }, password: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<Profile>) => Promise<Profile | null>;
  setUser: (user: Profile | null) => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<Profile | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data.user) {
        console.error("Login error:", error?.message);
        return false;
      }

      const userId = data.user.id;
      console.log("ID del usuario autenticado:", userId);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError.message);
      }

      if (!profile) {
        console.warn("Perfil no encontrado para el ID:", userId);
        const fallbackProfile: Profile = {
          id: userId,
          email: data.user.email ?? "",
          name: data.user.user_metadata?.name ?? data.user.email?.split("@")[0] ?? "Usuario",
        };
        setUser(fallbackProfile);
      } else {
        setUser(profile);
      }

      return true;
    } catch (err) {
      console.error("Login error (catch):", err);
      return false;
    }
  };

  const register = async (
    user: { email: string; name: string },
    password: string
  ): Promise<boolean> => {
    try {
      // Registrar sin necesidad de confirmación por correo
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password,
        options: {
          data: {
            name: user.name,
          },
          emailRedirectTo: undefined, // 🔑 evita el flujo de confirmación
        },
      });

      if (error) {
        console.error("Registration error:", error.message);
        return false;
      }

      // ⚡ Si no hay sesión creada automáticamente, forzar login
      let userId = data.user?.id;

      if (!data.session && data.user) {
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email: user.email,
            password,
          });

        if (loginError) {
          console.error("Auto login error:", loginError.message);
          return false;
        }

        userId = loginData.user.id;
      }

      if (userId) {
        // Crear perfil en tabla "profiles"
        const { error: profileError } = await supabase.from("profiles").insert({
          id: userId,
          email: user.email,
          name: user.name,
        });

        if (profileError) {
          console.error("Profile creation error:", profileError.message);
          return false;
        }

        setUser({
          id: userId,
          email: user.email,
          name: user.name,
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error("Registration error (catch):", error);
      return false;
    }
  };

  const updateProfile = async (profile: Partial<Profile>) => {
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      const user = authUser?.user;

      if (authError || !user) throw new Error("No user logged in");

      const fullProfile: Partial<Profile> = {
        id: user.id,
        email: user.email ?? "",
        ...profile,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("profiles")
        .upsert(fullProfile);

      if (updateError) throw updateError;

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError || !data) {
        console.warn("Perfil no encontrado luego del update.");
        return null;
      }

      setUser(data);
      return data;
    } catch (error) {
      console.error("Fetch updated profile error:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        updateProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};