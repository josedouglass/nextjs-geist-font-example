'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTrips } from '@/context/TripContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateTripData, validateFinishTripData } from '@/lib/calculations';
import { Trip } from '@/types';

interface TripFormProps {
  onTripAdded?: () => void;
}

export default function TripForm({ onTripAdded }: TripFormProps) {
  const { user } = useAuth();
  const { trips, addTrip, finishTrip } = useTrips();
  
  const [formData, setFormData] = useState({
    cidade: '',
    tipo: '' as 'PLANTAO' | 'VIAGEM' | '',
    hospital: '',
    tipoViagem: '' as 'ALTA' | 'TRANSFERENCIA' | 'VIAGEM_PROGRAMADA' | 'PLANTAO' | '',
    tipoVeiculo: '' as 'AMBULANCIA' | 'CARRO' | 'VAN' | 'MICRO_ONIBUS' | 'ONIBUS' | '',
    placaVeiculo: '',
    kmSaida: '',
    dataSaida: '',
    horaSaida: '',
    observacoes: '',
  });

  const [finishData, setFinishData] = useState({
    kmChegada: '',
    dataChegada: '',
    horaChegada: '',
    resultadoPaciente: '' as 'FICOU' | 'VOLTOU' | 'PRONTO_FINALIZOU' | '',
  });

  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Detectar viagem em andamento ao carregar o componente
  useEffect(() => {
    if (user && trips && !currentTrip) {
      const activeTrip = trips.find(trip => 
        trip.status === 'EM_ANDAMENTO' && trip.driverName === user.name
      );
      if (activeTrip) {
        setCurrentTrip(activeTrip);
        setSuccess('Viagem em andamento detectada! Complete os dados para finalizar.');
      }
    }
  }, [user, trips, currentTrip]);

  const resetForm = () => {
    setFormData({
      cidade: '',
      tipo: '' as 'PLANTAO' | 'VIAGEM' | '',
      hospital: '',
      tipoViagem: '' as 'ALTA' | 'TRANSFERENCIA' | 'VIAGEM_PROGRAMADA' | 'PLANTAO' | '',
      tipoVeiculo: '' as 'AMBULANCIA' | 'CARRO' | 'VAN' | 'MICRO_ONIBUS' | 'ONIBUS' | '',
      placaVeiculo: '',
      kmSaida: '',
      dataSaida: '',
      horaSaida: '',
      observacoes: '',
    });
    setFinishData({
      kmChegada: '',
      dataChegada: '',
      horaChegada: '',
      resultadoPaciente: '' as 'FICOU' | 'VOLTOU' | 'PRONTO_FINALIZOU' | '',
    });
    setCurrentTrip(null);
    setError('');
    setSuccess('');
  };

  const handleStartTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      // Validar se todos os campos obrigatórios estão preenchidos
      if (!formData.tipo || !formData.tipoViagem || !formData.tipoVeiculo) {
        setError('Todos os campos obrigatórios devem ser preenchidos');
        return;
      }

      const tripData = {
        ...formData,
        tipo: formData.tipo as 'PLANTAO' | 'VIAGEM',
        tipoViagem: formData.tipoViagem as 'ALTA' | 'TRANSFERENCIA' | 'VIAGEM_PROGRAMADA' | 'PLANTAO',
        tipoVeiculo: formData.tipoVeiculo as 'AMBULANCIA' | 'CARRO' | 'VAN' | 'MICRO_ONIBUS' | 'ONIBUS',
        kmSaida: parseFloat(formData.kmSaida),
        driverName: user.name,
      };

      const validationErrors = validateTripData(tripData);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return;
      }

      addTrip(tripData);
      
      const newTrip: Trip = {
        ...tripData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'EM_ANDAMENTO',
      };
      
      setCurrentTrip(newTrip);
      setSuccess('Viagem iniciada com sucesso! Agora você pode finalizar quando chegar ao destino.');
      onTripAdded?.();
    } catch (error) {
      setError('Erro ao iniciar viagem. Tente novamente.');
      console.error('Erro ao iniciar viagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!currentTrip) {
        setError('Nenhuma viagem em andamento');
        return;
      }

      const finishTripData = {
        kmChegada: parseFloat(finishData.kmChegada),
        dataChegada: finishData.dataChegada,
        horaChegada: finishData.horaChegada,
        resultadoPaciente: finishData.resultadoPaciente || undefined,
      };

      const validationErrors = validateFinishTripData(finishTripData, currentTrip.kmSaida);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return;
      }

      // Validar resultado do paciente para transferências
      if (currentTrip.tipoViagem === 'TRANSFERENCIA' && !finishData.resultadoPaciente) {
        setError('Para transferências, é obrigatório informar o resultado do paciente');
        return;
      }

      finishTrip(currentTrip.id, finishTripData);
      setSuccess('Viagem finalizada com sucesso!');
      resetForm();
      onTripAdded?.();
    } catch (error) {
      setError('Erro ao finalizar viagem. Tente novamente.');
      console.error('Erro ao finalizar viagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/95 backdrop-blur">
      <CardHeader className="bg-gradient-to-r from-yellow-100 to-red-100 rounded-t-lg">
        <CardTitle className="text-xl font-bold text-gray-800">
          {currentTrip ? 'Finalizar Viagem' : 'Nova Viagem'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {!currentTrip ? (
          <form onSubmit={handleStartTrip} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade" className="text-gray-700 font-medium">
                  Cidade *
                </Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                  placeholder="Digite a cidade"
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-gray-700 font-medium">
                  Tipo *
                </Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value: 'PLANTAO' | 'VIAGEM') => 
                    setFormData(prev => ({ ...prev, tipo: value }))
                  }
                  disabled={isLoading}
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANTAO">Plantão</SelectItem>
                    <SelectItem value="VIAGEM">Viagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital" className="text-gray-700 font-medium">
                  Hospital *
                </Label>
                <Input
                  id="hospital"
                  value={formData.hospital}
                  onChange={(e) => setFormData(prev => ({ ...prev, hospital: e.target.value }))}
                  placeholder="Digite o hospital"
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoViagem" className="text-gray-700 font-medium">
                  Tipo de Viagem *
                </Label>
                <Select
                  value={formData.tipoViagem}
                  onValueChange={(value: 'ALTA' | 'TRANSFERENCIA' | 'VIAGEM_PROGRAMADA' | 'PLANTAO') => 
                    setFormData(prev => ({ ...prev, tipoViagem: value }))
                  }
                  disabled={isLoading}
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                    <SelectValue placeholder="Selecione o tipo de viagem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALTA">Alta</SelectItem>
                    <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                    <SelectItem value="VIAGEM_PROGRAMADA">Viagem Programada</SelectItem>
                    <SelectItem value="PLANTAO">Plantão</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoVeiculo" className="text-gray-700 font-medium">
                  Tipo de Veículo *
                </Label>
                <Select
                  value={formData.tipoVeiculo}
                  onValueChange={(value: 'AMBULANCIA' | 'CARRO' | 'VAN' | 'MICRO_ONIBUS' | 'ONIBUS') => 
                    setFormData(prev => ({ ...prev, tipoVeiculo: value }))
                  }
                  disabled={isLoading}
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                    <SelectValue placeholder="Selecione o tipo de veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AMBULANCIA">Ambulância</SelectItem>
                    <SelectItem value="CARRO">Carro</SelectItem>
                    <SelectItem value="VAN">Van</SelectItem>
                    <SelectItem value="MICRO_ONIBUS">Micro-ônibus</SelectItem>
                    <SelectItem value="ONIBUS">Ônibus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="placaVeiculo" className="text-gray-700 font-medium">
                  Placa do Veículo *
                </Label>
                <Input
                  id="placaVeiculo"
                  value={formData.placaVeiculo}
                  onChange={(e) => setFormData(prev => ({ ...prev, placaVeiculo: e.target.value.toUpperCase() }))}
                  placeholder="ABC-1234"
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kmSaida" className="text-gray-700 font-medium">
                  KM de Saída *
                </Label>
                <Input
                  id="kmSaida"
                  type="number"
                  value={formData.kmSaida}
                  onChange={(e) => setFormData(prev => ({ ...prev, kmSaida: e.target.value }))}
                  placeholder="0"
                  min="0"
                  step="0.1"
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataSaida" className="text-gray-700 font-medium">
                  Data de Saída *
                </Label>
                <Input
                  id="dataSaida"
                  type="date"
                  value={formData.dataSaida}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataSaida: e.target.value }))}
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horaSaida" className="text-gray-700 font-medium">
                  Hora de Saída *
                </Label>
                <Input
                  id="horaSaida"
                  type="time"
                  value={formData.horaSaida}
                  onChange={(e) => setFormData(prev => ({ ...prev, horaSaida: e.target.value }))}
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes" className="text-gray-700 font-medium">
                Observações
              </Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Digite observações sobre a viagem (opcional)"
                className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 min-h-[80px]"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-medium py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando Viagem...
                </div>
              ) : (
                'INICIAR VIAGEM'
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleFinishTrip} className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Viagem em Andamento:</h3>
              <p className="text-sm text-yellow-700">
                <strong>Destino:</strong> {currentTrip.cidade} - {currentTrip.hospital}<br />
                <strong>Saída:</strong> {currentTrip.dataSaida} às {currentTrip.horaSaida}<br />
                <strong>KM Inicial:</strong> {currentTrip.kmSaida}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kmChegada" className="text-gray-700 font-medium">
                  KM de Chegada *
                </Label>
                <Input
                  id="kmChegada"
                  type="number"
                  value={finishData.kmChegada}
                  onChange={(e) => setFinishData(prev => ({ ...prev, kmChegada: e.target.value }))}
                  placeholder="0"
                  min={currentTrip.kmSaida}
                  step="0.1"
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataChegada" className="text-gray-700 font-medium">
                  Data de Chegada *
                </Label>
                <Input
                  id="dataChegada"
                  type="date"
                  value={finishData.dataChegada}
                  onChange={(e) => setFinishData(prev => ({ ...prev, dataChegada: e.target.value }))}
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horaChegada" className="text-gray-700 font-medium">
                  Hora de Chegada *
                </Label>
                <Input
                  id="horaChegada"
                  type="time"
                  value={finishData.horaChegada}
                  onChange={(e) => setFinishData(prev => ({ ...prev, horaChegada: e.target.value }))}
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  disabled={isLoading}
                  required
                />
              </div>

              {currentTrip.tipoViagem === 'TRANSFERENCIA' && (
                <div className="space-y-2">
                  <Label htmlFor="resultadoPaciente" className="text-gray-700 font-medium">
                    Resultado do Paciente *
                  </Label>
                  <Select
                    value={finishData.resultadoPaciente}
                    onValueChange={(value: 'FICOU' | 'VOLTOU' | 'PRONTO_FINALIZOU') => 
                      setFinishData(prev => ({ ...prev, resultadoPaciente: value }))
                    }
                    disabled={isLoading}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                      <SelectValue placeholder="Selecione o resultado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FICOU">Ficou</SelectItem>
                      <SelectItem value="VOLTOU">Voltou</SelectItem>
                      <SelectItem value="PRONTO_FINALIZOU">Pronto - Finalizou</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Finalizando...
                  </div>
                ) : (
                  'FINALIZAR VIAGEM'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
