import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TripProvider } from "@/context/TripContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Controle de Viagens Tabira",
  description: "Sistema de controle de viagens da Prefeitura de Tabira",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <TripProvider>
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50">
              {/* Header Principal */}
              <header className="bg-gradient-to-r from-yellow-600 to-red-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-6">
                  <div className="text-center">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                      CONTROLE DE VIAGENS TABIRA
                    </h1>
                    <div className="text-sm md:text-base space-y-1 opacity-90">
                      <p className="font-semibold">PREFEITURA DE TABIRA</p>
                      <p className="font-semibold">SECRETARIA DE SAÚDE</p>
                      <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8 mt-2">
                        <p className="text-xs md:text-sm">
                          <span className="font-medium">COORDENADOR DE TRANSPORTE:</span> HELDER AMARAL
                        </p>
                        <p className="text-xs md:text-sm">
                          <span className="font-medium">DESENVOLVEDOR DE SISTEMA:</span> DOUGLAS SILVA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Conteúdo Principal */}
              <main className="flex-1">
                {children}
              </main>

              {/* Footer */}
              <footer className="bg-gray-800 text-white py-4 mt-8">
                <div className="container mx-auto px-4 text-center">
                  <p className="text-sm">
                    © 2024 Prefeitura de Tabira - Sistema de Controle de Viagens
                  </p>
                </div>
              </footer>
            </div>
          </TripProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
