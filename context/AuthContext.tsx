"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LOGIN_MUTATION } from "@/lib/mutations";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/@types/types";
import { getGraphqlClient } from "@/lib/graphqlClient";

type Role = "admin" | "student";

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  role: Role | null;
  userId: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole as Role);

      try {
        const decoded: any = jwtDecode(savedToken);
        setUserId(decoded?.id);
      } catch {
        setUserId(null);
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    const data: LoginResponse = await getGraphqlClient().request(LOGIN_MUTATION, {
      username,
      password
    });
  
    const { token, role } = data.login;
  
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  
    setToken(token);
    setRole(role);
  
    try {
      const decoded: { id: string } = jwtDecode(token);
      setUserId(decoded?.id);
      localStorage.setItem("userId", decoded?.id);
    } catch {
      setUserId(null);
    }
  
    router.push(role === "admin" ? "/admin" : "/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setUserId(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token, role, userId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
function jwtDecode(savedToken: string): any {
    throw new Error("Function not implemented.");
}

