import { createContext, useState } from "react";
import { supabase } from '../utils/supabase';

interface AuthContextProps {
    user: any,
    isLoading: boolean,
    login: (email: string, password: string) => Promise<void>,
    register: () => void, // To fix
    logout: () => void
}

const fakeDataSource = [
    {
        email: "test@test.com",
        password: "12345678",
        name: "TEST"
    },
    {
        email: "test1@test.com",
        password: "12345678",
        name: "TEST"
    },
    {
        email: "test2@test.com",
        password: "12345678",
        name: "TEST"
    }
]

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {

    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
        setIsLoading(true);

        const foundUser = fakeDataSource.find(
            (u) => u.email === email && u.password === password
        );

        if (foundUser) {
            setUser(foundUser);
        } else {
            alert("Credenciales incorrectas");
            setUser(null);
        }
        const response = await supabase.auth.signInWithPassword({
            email,
            password
        })

  setIsLoading(false);
    }

    const register = async () => {

    }

    const logout = async () => {
        setUser(null);
    }

    return <AuthContext.Provider
        value={{
            user,
            isLoading,
            login,
            register,
            logout
        }}
    >
        {children}
    </AuthContext.Provider>
}