'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { getCurrentUser, setCurrentUser, saveUser, findUser, userExists } from '@/lib/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (name: string, password: string): Promise<boolean> => {
    try {
      if (!name.trim() || !password.trim()) {
        return false;
      }

      const foundUser = findUser(name.trim(), password);
      if (foundUser) {
        setUser(foundUser);
        setCurrentUser(foundUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (name: string, password: string): Promise<boolean> => {
    try {
      if (!name.trim() || !password.trim()) {
        return false;
      }

      const trimmedName = name.trim();
      
      if (userExists(trimmedName)) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: trimmedName,
        password: password,
        createdAt: new Date().toISOString(),
      };

      saveUser(newUser);
      setUser(newUser);
      setCurrentUser(newUser);
      return true;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setCurrentUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
