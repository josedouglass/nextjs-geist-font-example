'use client';

import { useState } from 'react';
import { useTrips } from '@/context/TripContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatDate, formatTime } from '@/lib/calculations';
import { Trip } from '@/types';

interface TripListProps {
  refreshTrigger?: number;
}

export default function TripList({ refreshTrigger }: TripListProps) {
  const { trips, deleteTrip } = useTrips();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDeleteTrip = async (tripId: string) => {
    try {
      setError('');
      deleteTrip(tripId);
      setSuccess('Viagem excluída com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Erro ao excluir viagem. Tente novamente.');
      console.error('Erro ao excluir viagem:', error);
    }
  };

  const getStatusBadge = (status: Trip['status']) => {
    if (status === 'EM_ANDAMENTO') {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Em Andamento</Badge>;
    }
    return <Badge className="bg-green-500 hover:bg-green-600">Finalizada</Badge>;
  };

  const getTipoBadge = (tipo: Trip['tipo']) => {
    if (tipo === 'PLANTAO') {
      return <Badge variant="outline" className="border-blue-300 text-blue-700">Plantão</Badge>;
    }
    return <Badge variant="outline" className="border-purple-300 text-purple-700">Viagem</Badge>;
  };

  const getVeiculoBadge = (veiculo: Trip['tipoVeiculo']) => {
    const colors = {
      AMBULANCIA: 'border-red-300 text-red-700',
      CARRO: 'border-gray-300 text-gray-700',
      VAN: 'border-blue-300 text-blue-700',
      MICRO_ONIBUS: 'border-green-300 text-green-700',
      ONIBUS: 'border-yellow-300 text-yellow-700',
    };

    const labels = {
      AMBULANCIA: 'Ambulância',
      CARRO: 'Carro',
      VAN: 'Van',
      MICRO_ONIBUS: 'Micro-ônibus',
      ONIBUS: 'Ônibus',
    };

    return (
      <Badge variant="outline" className={colors[veiculo]}>
        {labels[veiculo]}
      </Badge>
    );
  };

  const getTipoViagemLabel = (tipoViagem: Trip['tipoViagem']) => {
    const labels = {
      ALTA: 'Alta',
      TRANSFERENCIA: 'Transferência',
      VIAGEM_PROGRAMADA: 'Viagem Programada',
      PLANTAO: 'Plantão',
    };
    return labels[tipoViagem];
  };

  const getResultadoPacienteLabel = (resultado?: Trip['resultadoPaciente']) => {
    if (!resultado) return '';
    
    const labels = {
      FICOU: 'Ficou',
      VOLTOU: 'Voltou',
      PRONTO_FINALIZOU: 'Pronto - Finalizou',
    };
    return labels[resultado];
  };

  // Ordenar viagens: em andamento primeiro, depois por data mais recente
  const sortedTrips = [...trips].sort((a, b) => {
    if (a.status === 'EM_ANDAMENTO' && b.status === 'FINALIZADA') return -1;
    if (a.status === 'FINALIZADA' && b.status === 'EM_ANDAMENTO') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (trips.length === 0) {
    return (
      <Card className="w-full shadow-lg border-0 bg-white/95 backdrop-blur">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 text-lg">Nenhuma viagem cadastrada ainda.</p>
          <p className="text-gray-400 text-sm mt-2">
            Use o formulário acima para iniciar sua primeira viagem.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full shadow-lg border-0 bg-white/95 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-yellow-100 to-red-100 rounded-t-lg">
          <CardTitle className="text-xl font-bold text-gray-800">
            Histórico de Viagens ({trips.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            {sortedTrips.map((trip) => (
              <div
                key={trip.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Linha 1: Status, Tipo e Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(trip.status)}
                      {getTipoBadge(trip.tipo)}
                      {getVeiculoBadge(trip.tipoVeiculo)}
                    </div>

                    {/* Linha 2: Informações principais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Destino:</span>
                        <p className="text-gray-800">{trip.cidade} - {trip.hospital}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Condutor:</span>
                        <p className="text-gray-800">{trip.driverName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Tipo de Viagem:</span>
                        <p className="text-gray-800">{getTipoViagemLabel(trip.tipoViagem)}</p>
                      </div>
                    </div>

                    {/* Linha 3: Detalhes da viagem */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Placa:</span>
                        <p className="text-gray-800">{trip.placaVeiculo}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Saída:</span>
                        <p className="text-gray-800">
                          {formatDate(trip.dataSaida)} às {formatTime(trip.horaSaida)}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">KM Saída:</span>
                        <p className="text-gray-800">{trip.kmSaida}</p>
                      </div>
                      {trip.status === 'FINALIZADA' && trip.kmRodados && (
                        <div>
                          <span className="font-medium text-gray-600">KM Rodados:</span>
                          <p className="text-gray-800 font-semibold text-green-600">
                            {trip.kmRodados} km
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Linha 4: Informações de finalização (se finalizada) */}
                    {trip.status === 'FINALIZADA' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm bg-green-50 p-3 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-600">Chegada:</span>
                          <p className="text-gray-800">
                            {trip.dataChegada && formatDate(trip.dataChegada)} às {trip.horaChegada}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">KM Chegada:</span>
                          <p className="text-gray-800">{trip.kmChegada}</p>
                        </div>
                        {trip.resultadoPaciente && (
                          <div>
                            <span className="font-medium text-gray-600">Resultado:</span>
                            <p className="text-gray-800">{getResultadoPacienteLabel(trip.resultadoPaciente)}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Linha 5: Observações (se houver) */}
                    {trip.observacoes && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-600">Observações:</span>
                        <p className="text-gray-800 bg-gray-50 p-2 rounded mt-1">
                          {trip.observacoes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Botões de ação */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-32">
                    {trip.status === 'FINALIZADA' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta viagem? Esta ação não pode ser desfeita.
                              <br /><br />
                              <strong>Viagem:</strong> {trip.cidade} - {trip.hospital}
                              <br />
                              <strong>Data:</strong> {formatDate(trip.dataSaida)}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTrip(trip.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
