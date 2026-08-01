'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BusinessSummary {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string;
  businessTypes: string[];
  createdAt: string;
  _count: { users: number; appointments: number; tutors: number; pets: number };
}

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .get('/admin/businesses')
      .then((res) => setBusinesses(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Negocios da Plataforma</h1>

      {isLoading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{businesses.length} negocios cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2 pr-4">Nome</th>
                    <th className="pb-2 pr-4">Slug</th>
                    <th className="pb-2 pr-4">Usuarios</th>
                    <th className="pb-2 pr-4">Tutores</th>
                    <th className="pb-2 pr-4">Pets</th>
                    <th className="pb-2 pr-4">Agendamentos</th>
                    <th className="pb-2 pr-4">Criado em</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((b) => (
                    <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 pr-4">
                        <Link href={`/admin/${b.id}`} className="text-primary hover:underline font-medium">
                          {b.name}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-gray-500">{b.slug}</td>
                      <td className="py-3 pr-4">{b._count.users}</td>
                      <td className="py-3 pr-4">{b._count.tutors}</td>
                      <td className="py-3 pr-4">{b._count.pets}</td>
                      <td className="py-3 pr-4">{b._count.appointments}</td>
                      <td className="py-3 pr-4 text-gray-500">
                        {new Date(b.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
