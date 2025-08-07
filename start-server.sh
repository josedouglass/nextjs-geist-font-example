#!/bin/bash

# Script para iniciar o servidor de forma permanente
# Controle de Viagens Tabira

echo "🚀 Iniciando Servidor - Controle de Viagens Tabira"
echo "=================================================="

# Função para verificar se a porta está em uso
check_port() {
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Porta 8000 em uso. Finalizando processo..."
        fuser -k 8000/tcp
        sleep 2
    fi
}

# Função para iniciar o servidor
start_server() {
    echo "🔄 Iniciando servidor Next.js..."
    npm run dev &
    SERVER_PID=$!
    echo "✅ Servidor iniciado com PID: $SERVER_PID"
    echo "🌐 Acesse: http://localhost:8000"
}

# Função para monitorar o servidor
monitor_server() {
    echo "👀 Monitorando servidor..."
    while true; do
        if ! curl -s http://localhost:8000 > /dev/null; then
            echo "❌ Servidor não está respondendo. Reiniciando..."
            check_port
            start_server
        else
            echo "✅ Servidor funcionando - $(date)"
        fi
        sleep 30
    done
}

# Verificar dependências
if ! command -v npm &> /dev/null; then
    echo "❌ NPM não encontrado. Instale Node.js primeiro."
    exit 1
fi

if ! command -v curl &> /dev/null; then
    echo "❌ CURL não encontrado. Instale curl primeiro."
    exit 1
fi

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado. Execute este script no diretório do projeto."
    exit 1
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Iniciar processo
check_port
start_server

# Aguardar servidor inicializar
echo "⏳ Aguardando servidor inicializar..."
sleep 5

# Verificar se o servidor está funcionando
if curl -s http://localhost:8000 > /dev/null; then
    echo "🎉 Servidor iniciado com sucesso!"
    echo "🌐 Site disponível em: http://localhost:8000"
    echo "📱 Funcionalidades disponíveis:"
    echo "   - Login e Cadastro de Usuários"
    echo "   - Controle de Viagens"
    echo "   - Persistência de Dados"
    echo "   - Relatórios em PDF"
    echo ""
    echo "💡 Para parar o servidor, pressione Ctrl+C"
    
    # Manter o script rodando para monitoramento
    if [ "$1" = "--monitor" ]; then
        monitor_server
    else
        echo "🔄 Para monitoramento automático, execute: ./start-server.sh --monitor"
        wait $SERVER_PID
    fi
else
    echo "❌ Falha ao iniciar o servidor"
    exit 1
fi
