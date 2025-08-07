export interface User {
  id: string;
  name: string;
  password: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  driverName: string;
  cidade: string;
  tipo: 'PLANTAO' | 'VIAGEM';
  hospital: string;
  tipoViagem: 'ALTA' | 'TRANSFERENCIA' | 'VIAGEM_PROGRAMADA' | 'PLANTAO';
  tipoVeiculo: 'AMBULANCIA' | 'CARRO' | 'VAN' | 'MICRO_ONIBUS' | 'ONIBUS';
  placaVeiculo: string;
  kmSaida: number;
  dataSaida: string;
  horaSaida: string;
  observacoes: string;
  
  // Campos de finalização
  kmChegada?: number;
  dataChegada?: string;
  horaChegada?: string;
  resultadoPaciente?: 'FICOU' | 'VOLTOU' | 'PRONTO_FINALIZOU';
  
  // Status e cálculos
  status: 'EM_ANDAMENTO' | 'FINALIZADA';
  kmRodados?: number;
  createdAt: string;
  finishedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (name: string, password: string) => Promise<boolean>;
  register: (name: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface TripContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'status'>) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  finishTrip: (id: string, finishData: {
    kmChegada: number;
    dataChegada: string;
    horaChegada: string;
    resultadoPaciente?: 'FICOU' | 'VOLTOU' | 'PRONTO_FINALIZOU';
  }) => void;
  getTripsByMonth: (month: number, year: number) => Trip[];
  getMonthlyKm: (month: number, year: number) => number;
}
