#!/bin/bash

# Script de Verificação de Status - Controle de Viagens Tabira
# Este script verifica se o sistema está funcionando corretamente

echo "🔍 VERIFICAÇÃO DE STATUS - CONTROLE DE VIAGENS TABIRA"
echo "=================================================="
echo "Data/Hora: $(date)"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar status
check_status() {
    local service=$1
    local command=$2
    local expected=$3
    
    echo -n "🔍 Verificando $service... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FALHA${NC}"
        return 1
    fi
}

# Função para verificar URL
check_url() {
    local url=$1
    local description=$2
    
    echo -n "🌐 Testando $description ($url)... "
    
    if curl -s -f "$url" > /dev/null; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FALHA${NC}"
        return 1
    fi
}

# Verificações do Sistema
echo -e "${BLUE}📋 VERIFICAÇÕES DO SISTEMA${NC}"
echo "================================"

# 1. Verificar se Node.js está instalado
check_status "Node.js" "node --version"

# 2. Verificar se NPM está instalado
check_status "NPM" "npm --version"

# 3. Verificar se o diretório do projeto existe
check_status "Diretório do projeto" "test -f package.json"

# 4. Verificar se node_modules existe
check_status "Dependências instaladas" "test -d node_modules"

echo ""
echo -e "${BLUE}🌐 VERIFICAÇÕES DO SERVIDOR${NC}"
echo "================================"

# 5. Verificar se a porta 8000 está em uso
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null; then
    echo -e "🔍 Porta 8000... ${GREEN}✅ EM USO${NC}"
    PORT_STATUS=1
else
    echo -e "🔍 Porta 8000... ${RED}❌ LIVRE${NC}"
    PORT_STATUS=0
fi

# 6. Verificar processo Next.js
if pgrep -f "next dev" > /dev/null; then
    echo -e "🔍 Processo Next.js... ${GREEN}✅ RODANDO${NC}"
    PROCESS_STATUS=1
else
    echo -e "🔍 Processo Next.js... ${RED}❌ PARADO${NC}"
    PROCESS_STATUS=0
fi

echo ""
echo -e "${BLUE}🌍 VERIFICAÇÕES DE CONECTIVIDADE${NC}"
echo "===================================="

# 7. Testar URLs principais
check_url "http://localhost:8000" "Página Principal"
check_url "http://localhost:8000/login" "Página de Login"
check_url "http://localhost:8000/register" "Página de Cadastro"

echo ""
echo -e "${BLUE}📊 INFORMAÇÕES DO SISTEMA${NC}"
echo "=============================="

# Informações adicionais
echo "🖥️  Sistema: $(uname -s)"
echo "💾 Memória livre: $(free -h | grep Mem | awk '{print $7}')"
echo "💿 Espaço em disco: $(df -h . | tail -1 | awk '{print $4}')"
echo "⏰ Uptime: $(uptime | awk '{print $3,$4}' | sed 's/,//')"

# Verificar logs se existirem
if [ -d "logs" ]; then
    echo "📝 Logs disponíveis:"
    ls -la logs/ 2>/dev/null | grep -v "^total" | awk '{print "   " $9 " (" $5 " bytes)"}'
fi

echo ""
echo -e "${BLUE}🎯 RESUMO FINAL${NC}"
echo "==============="

# Calcular score geral
TOTAL_CHECKS=7
PASSED_CHECKS=0

# Contar verificações que passaram
if command -v node >/dev/null 2>&1; then ((PASSED_CHECKS++)); fi
if command -v npm >/dev/null 2>&1; then ((PASSED_CHECKS++)); fi
if [ -f package.json ]; then ((PASSED_CHECKS++)); fi
if [ -d node_modules ]; then ((PASSED_CHECKS++)); fi
if [ $PORT_STATUS -eq 1 ]; then ((PASSED_CHECKS++)); fi
if [ $PROCESS_STATUS -eq 1 ]; then ((PASSED_CHECKS++)); fi
if curl -s -f "http://localhost:8000" > /dev/null; then ((PASSED_CHECKS++)); fi

# Calcular porcentagem
PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo "📈 Score: $PASSED_CHECKS/$TOTAL_CHECKS ($PERCENTAGE%)"

if [ $PERCENTAGE -eq 100 ]; then
    echo -e "${GREEN}🎉 SISTEMA FUNCIONANDO PERFEITAMENTE!${NC}"
    echo -e "${GREEN}✅ Todos os testes passaram${NC}"
    echo -e "${GREEN}🌐 Site disponível em: http://localhost:8000${NC}"
elif [ $PERCENTAGE -ge 80 ]; then
    echo -e "${YELLOW}⚠️  SISTEMA FUNCIONANDO COM PEQUENOS PROBLEMAS${NC}"
    echo -e "${YELLOW}🔧 Algumas verificações falharam, mas o site deve estar acessível${NC}"
elif [ $PERCENTAGE -ge 50 ]; then
    echo -e "${RED}❌ SISTEMA COM PROBLEMAS SIGNIFICATIVOS${NC}"
    echo -e "${RED}🚨 Várias verificações falharam, o site pode não estar funcionando${NC}"
else
    echo -e "${RED}🚨 SISTEMA COM FALHAS CRÍTICAS${NC}"
    echo -e "${RED}💥 A maioria das verificações falhou, o sistema precisa ser reiniciado${NC}"
fi

echo ""
echo -e "${BLUE}🛠️  AÇÕES RECOMENDADAS${NC}"
echo "======================"

if [ $PERCENTAGE -lt 100 ]; then
    echo "Para resolver problemas:"
    echo "1. Execute: ./start-server.sh"
    echo "2. Verifique logs: tail -f logs/combined.log"
    echo "3. Reinstale dependências: npm install"
    echo "4. Reinicie completamente: fuser -k 8000/tcp && npm run dev"
fi

echo ""
echo "📚 Para mais informações, consulte: README-SERVIDOR.md"
echo "🔄 Execute este script novamente: ./check-status.sh"
echo ""
echo "=================================================="
echo "Verificação concluída em $(date)"
