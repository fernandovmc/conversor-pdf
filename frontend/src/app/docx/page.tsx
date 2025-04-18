'use client';

import { useState } from 'react';

import { File, Upload, RotateCw, ArrowRight, ArrowLeft } from 'lucide-react';

import Link from 'next/link';


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    const apiUrl = 'https://api.conversorpdf.com.br';

    console.log(`API URL: ${apiUrl}`);

    const res = await fetch(`${apiUrl}/upload`, { method: 'POST', body: formData });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'documento.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert('Erro ao converter o arquivo.');
      console.error('Erro ao converter o arquivo:', res.statusText);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-red-150 px-4">

        <Link
            href="/"
            className="flex items-center gap-2 text-gray-900 mb-4">
            <ArrowLeft className="h-5 w-5" />
            Voltar para Home
        </Link>
      <h1 className="text-3xl font-extrabold mb-8 text-black flex items-center gap-2">
        <span>Conversor DOCX para PDF</span>
        <File className="h-8 w-8 text-blue-600" />
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center gap-6 w-full max-w-lg"
      >
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        >
          <Upload className="h-10 w-10 text-gray-400" />
          <span className="text-gray-500 text-sm mt-2">
            Clique para selecionar um arquivo .docx
          </span>
          <input
            id="file-upload"
            type="file"
            accept=".docx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <RotateCw className="h-5 w-5 animate-spin" />
              Convertendo...
            </>
          ) : (
            <>
              <ArrowRight className="h-5 w-5" />
              Converter
            </>
          )}
        </button>
      </form>
    </main>
  );
}
