'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, TripContextType } from '@/types';
import { getTrips, saveTrips, addTrip as addTripToStorage, updateTrip as updateTripInStorage, deleteTrip as deleteTripFromStorage } from '@/lib/storage';
import { calculateTripKm, getTripsByMonth, getMonthlyKm } from '@/lib/calculations';

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTrips = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrips deve ser usado dentro de um TripProvider');
  }
  return context;
};

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    try {
      const storedTrips = getTrips();
      setTrips(storedTrips);
    } catch (error) {
      console.error('Erro ao carregar viagens:', error);
    }
  }, []);

  const addTrip = (tripData: Omit<Trip, 'id' | 'createdAt' | 'status'>) => {
    try {
      // Verificar se já existe uma viagem em andamento para este usuário
      const existingActiveTrip = trips.find(trip => 
        trip.status === 'EM_ANDAMENTO' && trip.driverName === tripData.driverName
      );
      
      if (existingActiveTrip) {
        throw new Error('Já existe uma viagem em andamento para este usuário. Finalize a viagem atual antes de iniciar uma nova.');
      }

      const newTrip: Trip = {
        ...tripData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'EM_ANDAMENTO',
      };

      addTripToStorage(newTrip);
      setTrips(prev => [...prev, newTrip]);
    } catch (error) {
      console.error('Erro ao adicionar viagem:', error);
      throw new Error(error instanceof Error ? error.message : 'Erro ao adicionar viagem');
    }
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    try {
      updateTripInStorage(id, updates);
      setTrips(prev => 
        prev.map(trip => 
          trip.id === id ? { ...trip, ...updates } : trip
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar viagem:', error);
      throw new Error('Erro ao atualizar viagem');
    }
  };

  const deleteTrip = (id: string) => {
    try {
      deleteTripFromStorage(id);
      setTrips(prev => prev.filter(trip => trip.id !== id));
    } catch (error) {
      console.error('Erro ao excluir viagem:', error);
      throw new Error('Erro ao excluir viagem');
    }
  };

  const finishTrip = (id: string, finishData: {
    kmChegada: number;
    dataChegada: string;
    horaChegada: string;
    resultadoPaciente?: 'FICOU' | 'VOLTOU' | 'PRONTO_FINALIZOU';
  }) => {
    try {
      const trip = trips.find(t => t.id === id);
      if (!trip) {
        throw new Error('Viagem não encontrada');
      }

      const kmRodados = calculateTripKm(trip.kmSaida, finishData.kmChegada);
      
      const updates: Partial<Trip> = {
        ...finishData,
        kmRodados,
        status: 'FINALIZADA',
        finishedAt: new Date().toISOString(),
      };

      updateTrip(id, updates);
    } catch (error) {
      console.error('Erro ao finalizar viagem:', error);
      throw new Error('Erro ao finalizar viagem');
    }
  };

  const getTripsByMonthWrapper = (month: number, year: number): Trip[] => {
    return getTripsByMonth(trips, month, year);
  };

  const getMonthlyKmWrapper = (month: number, year: number): number => {
    return getMonthlyKm(trips, month, year);
  };

  const value: TripContextType = {
    trips,
    addTrip,
    updateTrip,
    deleteTrip,
    finishTrip,
    getTripsByMonth: getTripsByMonthWrapper,
    getMonthlyKm: getMonthlyKmWrapper,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};
