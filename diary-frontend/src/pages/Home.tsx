import { useState, useEffect } from 'react';
import axios from 'axios';

interface Catatan {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function Home() {
  const [catatan, setCatatan] = useState<Catatan[]>([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  // tambahan untuk edit
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/diary_notes');
      setCatatan(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      if (editMode && editId !== null) {
        // ===== UPDATE catatan =====
        const res = await axios.put(
          `http://localhost:5000/diary_notes/${editId}`,
          { title: formData.title, content: formData.content }
        );
        // update state lokal
        setCatatan(prev =>
          prev.map(c => (c.id === editId ? { ...c, ...res.data } : c))
        );
      } else {
        // ===== TAMBAH catatan =====
        const res = await axios.post('http://localhost:5000/diary_notes', formData);
        setCatatan(prev => [res.data, ...prev]);
      }

      // reset form
      setFormData({ title: '', content: '' });
      setEditMode(false);
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/diary_notes/${id}`);
      setCatatan(prev => prev.filter(c => c.id !== id));
      // jika sedang edit catatan yang dihapus
      if (editId === id) {
        setEditMode(false);
        setFormData({ title: '', content: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: Catatan) => {
    setEditMode(true);
    setEditId(item.id);
    setFormData({ title: item.title, content: item.content });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setFormData({ title: '', content: '' });
  };

  const formatTanggal = (t: string) =>
    new Date(t).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Buku Harian Ku</h1>

        {/* Form tambah / edit catatan */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-8 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Judul Catatan</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Isi Catatan</label>
            <textarea
              rows={4}
              className="w-full border rounded p-2"
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              {editMode ? 'Perbarui' : 'Simpan'}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        {/* Daftar catatan */}
        <div className="space-y-4">
          {loading && <p className="text-center text-gray-500">Memuat data...</p>}
          {catatan.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mt-2 whitespace-pre-wrap">{item.content}</p>
              <p className="text-gray-500 text-sm mt-2">{formatTanggal(item.created_at)}</p>
            </div>
          ))}
          {catatan.length === 0 && !loading && (
            <p className="text-center text-gray-600">Belum ada catatan.</p>
          )}
        </div>
      </div>
    </div>
  );
}
