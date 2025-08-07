import { Trip } from '@/types';

export const calculateTripKm = (kmSaida: number, kmChegada: number): number => {
  if (kmChegada <= kmSaida) {
    throw new Error('KM de chegada deve ser maior que KM de saída');
  }
  return kmChegada - kmSaida;
};

export const getTripsByMonth = (trips: Trip[], month: number, year: number): Trip[] => {
  return trips.filter(trip => {
    const tripDate = new Date(trip.dataSaida);
    return tripDate.getMonth() + 1 === month && tripDate.getFullYear() === year;
  });
};

export const getMonthlyKm = (trips: Trip[], month: number, year: number): number => {
  const monthlyTrips = getTripsByMonth(trips, month, year);
  return monthlyTrips
    .filter(trip => trip.status === 'FINALIZADA' && trip.kmRodados)
    .reduce((total, trip) => total + (trip.kmRodados || 0), 0);
};

export const getTripStats = (trips: Trip[], month: number, year: number) => {
  const monthlyTrips = getTripsByMonth(trips, month, year);
  
  const stats = {
    totalTrips: monthlyTrips.length,
    finishedTrips: monthlyTrips.filter(t => t.status === 'FINALIZADA').length,
    inProgressTrips: monthlyTrips.filter(t => t.status === 'EM_ANDAMENTO').length,
    totalKm: getMonthlyKm(trips, month, year),
    tripsByType: {
      PLANTAO: monthlyTrips.filter(t => t.tipo === 'PLANTAO').length,
      VIAGEM: monthlyTrips.filter(t => t.tipo === 'VIAGEM').length,
    },
    tripsByVehicle: {
      AMBULANCIA: monthlyTrips.filter(t => t.tipoVeiculo === 'AMBULANCIA').length,
      CARRO: monthlyTrips.filter(t => t.tipoVeiculo === 'CARRO').length,
      VAN: monthlyTrips.filter(t => t.tipoVeiculo === 'VAN').length,
      MICRO_ONIBUS: monthlyTrips.filter(t => t.tipoVeiculo === 'MICRO_ONIBUS').length,
      ONIBUS: monthlyTrips.filter(t => t.tipoVeiculo === 'ONIBUS').length,
    }
  };
  
  return stats;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return dateString;
  }
};

export const formatTime = (timeString: string): string => {
  return timeString;
};

export const getMonthName = (month: number): string => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month - 1] || '';
};

export const validateTripData = (trip: Partial<Trip>): string[] => {
  const errors: string[] = [];
  
  if (!trip.cidade?.trim()) {
    errors.push('Cidade é obrigatória');
  }
  
  if (!trip.hospital?.trim()) {
    errors.push('Hospital é obrigatório');
  }
  
  if (!trip.placaVeiculo?.trim()) {
    errors.push('Placa do veículo é obrigatória');
  }
  
  if (!trip.kmSaida || trip.kmSaida < 0) {
    errors.push('KM de saída deve ser um número válido');
  }
  
  if (!trip.dataSaida) {
    errors.push('Data de saída é obrigatória');
  }
  
  if (!trip.horaSaida) {
    errors.push('Hora de saída é obrigatória');
  }
  
  return errors;
};

export const validateFinishTripData = (finishData: {
  kmChegada: number;
  dataChegada: string;
  horaChegada: string;
}, kmSaida: number): string[] => {
  const errors: string[] = [];
  
  if (!finishData.kmChegada || finishData.kmChegada < 0) {
    errors.push('KM de chegada deve ser um número válido');
  }
  
  if (finishData.kmChegada <= kmSaida) {
    errors.push('KM de chegada deve ser maior que KM de saída');
  }
  
  if (!finishData.dataChegada) {
    errors.push('Data de chegada é obrigatória');
  }
  
  if (!finishData.horaChegada) {
    errors.push('Hora de chegada é obrigatória');
  }
  
  return errors;
};
