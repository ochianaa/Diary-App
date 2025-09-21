import { useState, useEffect } from 'react';

interface Catatan {
  id: number;
  judul: string;
  isi: string;
  tanggal: string;
}

export default function Home() {
  const [catatan, setCatatan] = useState<Catatan[]>([]);
  const [formData, setFormData] = useState({ judul: '', isi: '' });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.isi.trim()) return;
    setCatatan(prev => [
      { id: Date.now(), judul: formData.judul, isi: formData.isi, tanggal: new Date().toISOString() },
      ...prev,
    ]);
    setFormData({ judul: '', isi: '' });
  };

  const handleDelete = (id: number) => {
    setCatatan(prev => prev.filter(c => c.id !== id));
  };

  const formatTanggal = (t: string) =>
    new Date(t).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Buku Harian Ku</h1>

        {/* Form tambah catatan */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-8 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Judul Catatan</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={formData.judul}
              onChange={e => setFormData({ ...formData, judul: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Isi Catatan</label>
            <textarea
              rows={4}
              className="w-full border rounded p-2"
              value={formData.isi}
              onChange={e => setFormData({ ...formData, isi: e.target.value })}
            />
          </div>
          <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Simpan
          </button>
        </form>

        {/* Daftar catatan */}
        <div className="space-y-4">
          {catatan.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{item.judul}</h2>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Hapus
                </button>
              </div>
              <p className="text-gray-700 mt-2 whitespace-pre-wrap">{item.isi}</p>
              <p className="text-gray-500 text-sm mt-2">{formatTanggal(item.tanggal)}</p>
            </div>
          ))}
          {catatan.length === 0 && (
            <p className="text-center text-gray-600">Belum ada catatan.</p>
          )}
        </div>
      </div>
    </div>
  );
}
