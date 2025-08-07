import { User, Trip } from '@/types';

const USERS_KEY = 'tabira_users';
const TRIPS_KEY = 'tabira_trips';
const CURRENT_USER_KEY = 'tabira_current_user';

// Funções para usuários
export const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};

export const saveUser = (user: User): void => {
  try {
    const users = getUsers();
    const existingUserIndex = users.findIndex(u => u.name === user.name);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    throw new Error('Erro ao salvar usuário');
  }
};

export const findUser = (name: string, password: string): User | null => {
  try {
    const users = getUsers();
    return users.find(u => u.name === name && u.password === password) || null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
};

export const userExists = (name: string): boolean => {
  try {
    const users = getUsers();
    return users.some(u => u.name === name);
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return false;
  }
};

// Funções para usuário atual
export const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    return null;
  }
};

export const setCurrentUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error('Erro ao definir usuário atual:', error);
  }
};

// Funções para viagens
export const getTrips = (): Trip[] => {
  try {
    const trips = localStorage.getItem(TRIPS_KEY);
    return trips ? JSON.parse(trips) : [];
  } catch (error) {
    console.error('Erro ao buscar viagens:', error);
    return [];
  }
};

export const saveTrips = (trips: Trip[]): void => {
  try {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error('Erro ao salvar viagens:', error);
    throw new Error('Erro ao salvar viagens');
  }
};

export const addTrip = (trip: Trip): void => {
  try {
    const trips = getTrips();
    trips.push(trip);
    saveTrips(trips);
  } catch (error) {
    console.error('Erro ao adicionar viagem:', error);
    throw new Error('Erro ao adicionar viagem');
  }
};

export const updateTrip = (id: string, updates: Partial<Trip>): void => {
  try {
    const trips = getTrips();
    const tripIndex = trips.findIndex(t => t.id === id);
    
    if (tripIndex >= 0) {
      trips[tripIndex] = { ...trips[tripIndex], ...updates };
      saveTrips(trips);
    } else {
      throw new Error('Viagem não encontrada');
    }
  } catch (error) {
    console.error('Erro ao atualizar viagem:', error);
    throw new Error('Erro ao atualizar viagem');
  }
};

export const deleteTrip = (id: string): void => {
  try {
    const trips = getTrips();
    const filteredTrips = trips.filter(t => t.id !== id);
    saveTrips(filteredTrips);
  } catch (error) {
    console.error('Erro ao excluir viagem:', error);
    throw new Error('Erro ao excluir viagem');
  }
};

// Função para limpar todos os dados (útil para desenvolvimento)
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(TRIPS_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
  }
};
