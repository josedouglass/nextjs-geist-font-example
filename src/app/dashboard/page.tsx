'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTrips } from '@/context/TripContext';
import TripForm from '@/components/TripForm';
import TripList from '@/components/TripList';
import ReportGenerator from '@/components/ReportGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { user } = useAuth();
  const { trips } = useTrips();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTripUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Estatísticas gerais
  const totalTrips = trips.length;
  const inProgressTrips = trips.filter(t => t.status === 'EM_ANDAMENTO').length;
  const finishedTrips = trips.filter(t => t.status === 'FINALIZADA').length;
  const totalKm = trips
    .filter(t => t.status === 'FINALIZADA' && t.kmRodados)
    .reduce((total, trip) => total + (trip.kmRodados || 0), 0);

  // Estatísticas do mês atual
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  const monthlyTrips = trips.filter(trip => {
    const tripDate = new Date(trip.dataSaida);
    return tripDate.getMonth() + 1 === currentMonth && tripDate.getFullYear() === currentYear;
  });

  const monthlyKm = monthlyTrips
    .filter(t => t.status === 'FINALIZADA' && t.kmRodados)
    .reduce((total, trip) => total + (trip.kmRodados || 0), 0);

  return (
    <div className="space-y-6">
      {/* Boas-vindas */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Sistema de Controle de Viagens - Prefeitura de Tabira
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalTrips}</div>
            <div className="text-sm text-blue-700">Total de Viagens</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{inProgressTrips}</div>
            <div className="text-sm text-yellow-700">Em Andamento</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{finishedTrips}</div>
            <div className="text-sm text-green-700">Finalizadas</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{totalKm}</div>
            <div className="text-sm text-red-700">KM Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas do Mês Atual */}
      <Card className="bg-gradient-to-r from-yellow-100 to-red-100 border-0">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Estatísticas do Mês Atual
            <Badge variant="outline" className="bg-white">
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-gray-800">{monthlyTrips.length}</div>
              <div className="text-sm text-gray-600">Viagens do Mês</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">
                {monthlyTrips.filter(t => t.status === 'FINALIZADA').length}
              </div>
              <div className="text-sm text-gray-600">Finalizadas</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">{monthlyKm}</div>
              <div className="text-sm text-gray-600">KM Rodados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs principais */}
      <Tabs defaultValue="nova-viagem" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
          <TabsTrigger 
            value="nova-viagem" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            Nova Viagem
          </TabsTrigger>
          <TabsTrigger 
            value="historico"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            Histórico
            {inProgressTrips > 0 && (
              <Badge className="ml-2 bg-yellow-500 text-white text-xs">
                {inProgressTrips}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="relatorios"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nova-viagem" className="mt-6">
          <TripForm onTripAdded={handleTripUpdate} />
        </TabsContent>

        <TabsContent value="historico" className="mt-6">
          <TripList refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent value="relatorios" className="mt-6">
          <ReportGenerator />
        </TabsContent>
      </Tabs>

      {/* Informações importantes */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Informações Importantes:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Suas viagens ficam salvas automaticamente, mesmo se você sair do sistema</li>
            <li>• Você pode finalizar viagens em andamento a qualquer momento</li>
            <li>• Os relatórios mensais incluem todas as informações e observações</li>
            <li>• Apenas viagens finalizadas podem ser excluídas</li>
            <li>• Seu nome como condutor é salvo automaticamente em todas as viagens</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
