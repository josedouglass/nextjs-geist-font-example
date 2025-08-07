'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTrips } from '@/context/TripContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateMonthlyReport } from '@/lib/pdfGenerator';
import { getTripsByMonth, getMonthlyKm, getMonthName, getTripStats } from '@/lib/calculations';

export default function ReportGenerator() {
  const { user } = useAuth();
  const { trips } = useTrips();
  
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Gerar lista de anos disponíveis (baseado nas viagens existentes)
  const getAvailableYears = () => {
    const years = new Set<number>();
    trips.forEach(trip => {
      const year = new Date(trip.dataSaida).getFullYear();
      years.add(year);
    });
    
    // Adicionar ano atual se não estiver na lista
    years.add(new Date().getFullYear());
    
    return Array.from(years).sort((a, b) => b - a);
  };

  // Gerar lista de meses
  const months = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  const handleGenerateReport = async () => {
    setError('');
    setSuccess('');
    setIsGenerating(true);

    try {
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      if (!selectedMonth || !selectedYear) {
        setError('Selecione o mês e ano para gerar o relatório');
        return;
      }

      const month = parseInt(selectedMonth);
      const year = parseInt(selectedYear);

      // Buscar viagens do mês selecionado
      const monthlyTrips = getTripsByMonth(trips, month, year);
      const totalKm = getMonthlyKm(trips, month, year);

      // Gerar o PDF
      await generateMonthlyReport({
        trips: monthlyTrips,
        month,
        year,
        totalKm,
        driverName: user.name,
      });

      setSuccess(`Relatório de ${getMonthName(month)}/${year} gerado com sucesso!`);
    } catch (error) {
      setError('Erro ao gerar relatório. Tente novamente.');
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Obter estatísticas do mês selecionado para preview
  const getPreviewStats = () => {
    if (!selectedMonth || !selectedYear) return null;

    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    
    return getTripStats(trips, month, year);
  };

  const previewStats = getPreviewStats();

  return (
    <Card className="w-full shadow-lg border-0 bg-white/95 backdrop-blur">
      <CardHeader className="bg-gradient-to-r from-yellow-100 to-red-100 rounded-t-lg">
        <CardTitle className="text-xl font-bold text-gray-800">
          Gerador de Relatórios
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

        <div className="space-y-6">
          {/* Seleção de período */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month" className="text-gray-700 font-medium">
                Mês *
              </Label>
              <Select
                value={selectedMonth}
                onValueChange={setSelectedMonth}
                disabled={isGenerating}
              >
                <SelectTrigger className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-gray-700 font-medium">
                Ano *
              </Label>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
                disabled={isGenerating}
              >
                <SelectTrigger className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableYears().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview das estatísticas */}
          {previewStats && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">
                Preview do Relatório - {getMonthName(parseInt(selectedMonth))} {selectedYear}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium text-gray-600">Total de Viagens</p>
                  <p className="text-2xl font-bold text-blue-600">{previewStats.totalTrips}</p>
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-gray-600">Finalizadas</p>
                  <p className="text-2xl font-bold text-green-600">{previewStats.finishedTrips}</p>
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-yellow-600">{previewStats.inProgressTrips}</p>
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-gray-600">KM Rodados</p>
                  <p className="text-2xl font-bold text-red-600">{previewStats.totalKm}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-600 mb-2">Por Tipo:</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Plantões:</span>
                      <span className="font-medium">{previewStats.tripsByType.PLANTAO}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Viagens:</span>
                      <span className="font-medium">{previewStats.tripsByType.VIAGEM}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-600 mb-2">Por Veículo:</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Ambulância:</span>
                      <span className="font-medium">{previewStats.tripsByVehicle.AMBULANCIA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carro:</span>
                      <span className="font-medium">{previewStats.tripsByVehicle.CARRO}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Van:</span>
                      <span className="font-medium">{previewStats.tripsByVehicle.VAN}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Micro-ônibus:</span>
                      <span className="font-medium">{previewStats.tripsByVehicle.MICRO_ONIBUS}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ônibus:</span>
                      <span className="font-medium">{previewStats.tripsByVehicle.ONIBUS}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botão de gerar relatório */}
          <Button
            onClick={handleGenerateReport}
            className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-medium py-3"
            disabled={isGenerating || !selectedMonth || !selectedYear}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Gerando Relatório...
              </div>
            ) : (
              'GERAR RELATÓRIO PDF'
            )}
          </Button>

          {/* Informações adicionais */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Informações sobre o Relatório:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• O relatório incluirá todas as viagens do mês selecionado</li>
              <li>• Será gerado um arquivo PDF organizado com todas as informações</li>
              <li>• O arquivo será baixado automaticamente após a geração</li>
              <li>• Inclui cabeçalho oficial da Prefeitura de Tabira</li>
              <li>• Contém estatísticas detalhadas e observações de cada viagem</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
