'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validações
      if (!name.trim()) {
        setError('Nome do condutor é obrigatório');
        return;
      }

      if (name.trim().length < 2) {
        setError('Nome deve ter pelo menos 2 caracteres');
        return;
      }

      if (!password) {
        setError('Senha é obrigatória');
        return;
      }

      if (password.length < 4) {
        setError('Senha deve ter pelo menos 4 caracteres');
        return;
      }

      if (password !== confirmPassword) {
        setError('Senhas não coincidem');
        return;
      }

      const success = await register(name.trim(), password);
      
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Já existe um condutor cadastrado com este nome');
      }
    } catch (error) {
      setError('Erro ao realizar cadastro. Tente novamente.');
      console.error('Erro no cadastro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Cadastro de Condutor
          </CardTitle>
          <CardDescription className="text-gray-600">
            Cadastre-se para acessar o sistema de controle de viagens
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Nome do Condutor
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome completo"
                className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                Confirmar Senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-medium py-2.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cadastrando...
                </div>
              ) : (
                'Cadastrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já possui cadastro?{' '}
              <Link 
                href="/login" 
                className="text-red-600 hover:text-red-700 font-medium hover:underline"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
