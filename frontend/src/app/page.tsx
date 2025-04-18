"use client";

import React from 'react';
import { Upload } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Upload className='w-16 h-16 mb-10'/>
      <h1 className="text-5xl font-bold mb-8">Bem vindo ao Conversor PDF!</h1>
      <p className="text-xl text-gray-700 mb-10">
      Converta seus documentos em arquivos PDF rápido e gratuitamente.
      </p>
      <Link href="/docx">
        <Button className='text-white px-4 py-2 rounded cursor-pointer'>
          Converter WORD para PDF
        </Button>
      </Link>
    </div>
  );
};