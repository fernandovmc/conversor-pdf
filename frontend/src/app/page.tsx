'use client';

import { useState } from 'react';

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

    const res = await fetch(`${apiUrl}/upload`, {
      method: 'POST',
      body: formData
    });

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Conversor DOCX para PDF</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center gap-4 w-full max-w-md"
      >
        <input
          type="file"
          accept=".docx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Convertendo...' : 'Converter'}
        </button>
      </form>
    </main>
  );
}
