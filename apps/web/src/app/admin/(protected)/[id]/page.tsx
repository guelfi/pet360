'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BusinessDetail {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string;
  businessTypes: string[];
  address: string | null;
  city: string | null;
  state: string | null;
  createdAt: string;
  users: Array<{ id: string; name: string; email: string; role: string; isActive: boolean }>;
  _count: { users: number; appointments: number; tutors: number; pets: number; sales: number };
}

export default function AdminBusinessDetailPage() {
  const params = useParams<{ id: string }>();
  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .get(`/admin/businesses/${params.id}`)
      .then((res) => setBusiness(res.data))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) return <p className="text-gray-500">Carregando...</p>;
  if (!business) return <p className="text-gray-500">Negocio nao encontrado.</p>;

  return (
    <div>
      <Link href="/admin" className="text-sm text-primary hover:underline mb-4 inline-block">
        &larr; Voltar
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{business.name}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do negocio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-gray-500">Slug:</span> {business.slug}</p>
            <p><span className="text-gray-500">Email:</span> {business.email || '-'}</p>
            <p><span className="text-gray-500">Telefone:</span> {business.phone}</p>
            <p><span className="text-gray-500">Tipos:</span> {business.businessTypes.join(', ') || '-'}</p>
            <p><span className="text-gray-500">Cidade:</span> {business.city || '-'} / {business.state || '-'}</p>
            <p><span className="text-gray-500">Criado em:</span> {new Date(business.createdAt).toLocaleDateString('pt-BR')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volumetria</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500 block">Usuarios</span>{business._count.users}</div>
            <div><span className="text-gray-500 block">Tutores</span>{business._count.tutors}</div>
            <div><span className="text-gray-500 block">Pets</span>{business._count.pets}</div>
            <div><span className="text-gray-500 block">Agendamentos</span>{business._count.appointments}</div>
            <div><span className="text-gray-500 block">Vendas</span>{business._count.sales}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Usuarios ({business.users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 pr-4">Nome</th>
                <th className="pb-2 pr-4">Email</th>
                <th className="pb-2 pr-4">Papel</th>
                <th className="pb-2 pr-4">Ativo</th>
              </tr>
            </thead>
            <tbody>
              {business.users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{u.name}</td>
                  <td className="py-2 pr-4 text-gray-500">{u.email}</td>
                  <td className="py-2 pr-4">{u.role}</td>
                  <td className="py-2 pr-4">{u.isActive ? 'Sim' : 'Nao'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
