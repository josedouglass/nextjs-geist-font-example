import jsPDF from 'jspdf';
import { Trip } from '@/types';
import { formatDate, formatTime, getMonthName, getTripsByMonth } from './calculations';

export interface PDFReportData {
  trips: Trip[];
  month: number;
  year: number;
  totalKm: number;
  driverName: string;
}

export const generateMonthlyReport = (data: PDFReportData): void => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 6;
    let currentY = margin;

    // Função para adicionar nova página se necessário
    const checkPageBreak = (neededSpace: number = 20) => {
      if (currentY + neededSpace > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
        addHeader();
      }
    };

    // Função para adicionar cabeçalho
    const addHeader = () => {
      // Cabeçalho principal
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('PREFEITURA DE TABIRA', pageWidth / 2, currentY, { align: 'center' });
      currentY += lineHeight + 2;

      doc.setFontSize(14);
      doc.text('SECRETARIA DE SAÚDE', pageWidth / 2, currentY, { align: 'center' });
      currentY += lineHeight + 2;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('COORDENADOR DE TRANSPORTE: HELDER AMARAL', pageWidth / 2, currentY, { align: 'center' });
      currentY += lineHeight;

      doc.text('DESENVOLVEDOR DE SISTEMA: DOUGLAS SILVA', pageWidth / 2, currentY, { align: 'center' });
      currentY += lineHeight + 5;

      // Título do relatório
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`RELATÓRIO MENSAL DE VIAGENS - ${getMonthName(data.month).toUpperCase()}/${data.year}`, pageWidth / 2, currentY, { align: 'center' });
      currentY += lineHeight + 5;

      // Informações do condutor
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Condutor: ${data.driverName}`, margin, currentY);
      currentY += lineHeight + 3;

      // Linha separadora
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 8;
    };

    // Adicionar cabeçalho inicial
    addHeader();

    // Resumo do mês
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMO DO MÊS:', margin, currentY);
    currentY += lineHeight + 2;

    doc.setFont('helvetica', 'normal');
    doc.text(`Total de Viagens: ${data.trips.length}`, margin, currentY);
    currentY += lineHeight;

    const finishedTrips = data.trips.filter(t => t.status === 'FINALIZADA').length;
    doc.text(`Viagens Finalizadas: ${finishedTrips}`, margin, currentY);
    currentY += lineHeight;

    const inProgressTrips = data.trips.filter(t => t.status === 'EM_ANDAMENTO').length;
    doc.text(`Viagens em Andamento: ${inProgressTrips}`, margin, currentY);
    currentY += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text(`Total de KM Rodados: ${data.totalKm} km`, margin, currentY);
    currentY += lineHeight + 8;

    // Estatísticas por tipo
    const tripsByType = {
      PLANTAO: data.trips.filter(t => t.tipo === 'PLANTAO').length,
      VIAGEM: data.trips.filter(t => t.tipo === 'VIAGEM').length,
    };

    doc.setFont('helvetica', 'bold');
    doc.text('ESTATÍSTICAS POR TIPO:', margin, currentY);
    currentY += lineHeight + 2;

    doc.setFont('helvetica', 'normal');
    doc.text(`Plantões: ${tripsByType.PLANTAO}`, margin, currentY);
    currentY += lineHeight;
    doc.text(`Viagens: ${tripsByType.VIAGEM}`, margin, currentY);
    currentY += lineHeight + 8;

    // Verificar se precisa de nova página
    checkPageBreak(40);

    // Lista detalhada de viagens
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALHAMENTO DAS VIAGENS:', margin, currentY);
    currentY += lineHeight + 5;

    if (data.trips.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.text('Nenhuma viagem registrada neste mês.', margin, currentY);
    } else {
      // Ordenar viagens por data
      const sortedTrips = [...data.trips].sort((a, b) => 
        new Date(a.dataSaida).getTime() - new Date(b.dataSaida).getTime()
      );

      sortedTrips.forEach((trip, index) => {
        // Verificar se precisa de nova página (espaço para uma viagem completa)
        checkPageBreak(35);

        // Número da viagem
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`${index + 1}. VIAGEM - ${trip.status === 'FINALIZADA' ? 'FINALIZADA' : 'EM ANDAMENTO'}`, margin, currentY);
        currentY += lineHeight + 1;

        // Informações básicas
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        doc.text(`Destino: ${trip.cidade} - ${trip.hospital}`, margin + 5, currentY);
        currentY += lineHeight;

        doc.text(`Tipo: ${trip.tipo} | Tipo de Viagem: ${getTipoViagemLabel(trip.tipoViagem)}`, margin + 5, currentY);
        currentY += lineHeight;

        doc.text(`Veículo: ${getVeiculoLabel(trip.tipoVeiculo)} | Placa: ${trip.placaVeiculo}`, margin + 5, currentY);
        currentY += lineHeight;

        doc.text(`Saída: ${formatDate(trip.dataSaida)} às ${formatTime(trip.horaSaida)} | KM: ${trip.kmSaida}`, margin + 5, currentY);
        currentY += lineHeight;

        if (trip.status === 'FINALIZADA') {
          doc.text(`Chegada: ${trip.dataChegada ? formatDate(trip.dataChegada) : ''} às ${trip.horaChegada} | KM: ${trip.kmChegada}`, margin + 5, currentY);
          currentY += lineHeight;

          if (trip.kmRodados) {
            doc.setFont('helvetica', 'bold');
            doc.text(`KM Rodados: ${trip.kmRodados} km`, margin + 5, currentY);
            doc.setFont('helvetica', 'normal');
            currentY += lineHeight;
          }

          if (trip.resultadoPaciente) {
            doc.text(`Resultado do Paciente: ${getResultadoPacienteLabel(trip.resultadoPaciente)}`, margin + 5, currentY);
            currentY += lineHeight;
          }
        }

        if (trip.observacoes) {
          doc.text('Observações:', margin + 5, currentY);
          currentY += lineHeight;
          
          // Quebrar texto das observações se for muito longo
          const observacoes = doc.splitTextToSize(trip.observacoes, pageWidth - margin - 15);
          doc.text(observacoes, margin + 10, currentY);
          currentY += (observacoes.length * lineHeight);
        }

        currentY += 3; // Espaço entre viagens

        // Linha separadora entre viagens
        if (index < sortedTrips.length - 1) {
          doc.setDrawColor(230, 230, 230);
          doc.line(margin + 5, currentY, pageWidth - margin - 5, currentY);
          currentY += 5;
        }
      });
    }

    // Rodapé
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Página ${i} de ${totalPages} - Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Salvar o PDF
    const fileName = `Relatorio_Viagens_${getMonthName(data.month)}_${data.year}_${data.driverName.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Erro ao gerar relatório PDF');
  }
};

// Funções auxiliares para labels
const getTipoViagemLabel = (tipoViagem: Trip['tipoViagem']): string => {
  const labels = {
    ALTA: 'Alta',
    TRANSFERENCIA: 'Transferência',
    VIAGEM_PROGRAMADA: 'Viagem Programada',
    PLANTAO: 'Plantão',
  };
  return labels[tipoViagem];
};

const getVeiculoLabel = (tipoVeiculo: Trip['tipoVeiculo']): string => {
  const labels = {
    AMBULANCIA: 'Ambulância',
    CARRO: 'Carro',
    VAN: 'Van',
    MICRO_ONIBUS: 'Micro-ônibus',
    ONIBUS: 'Ônibus',
  };
  return labels[tipoVeiculo];
};

const getResultadoPacienteLabel = (resultado: Trip['resultadoPaciente']): string => {
  if (!resultado) return '';
  
  const labels = {
    FICOU: 'Ficou',
    VOLTOU: 'Voltou',
    PRONTO_FINALIZOU: 'Pronto - Finalizou',
  };
  return labels[resultado];
};
