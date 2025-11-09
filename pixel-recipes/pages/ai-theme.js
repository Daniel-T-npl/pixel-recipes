import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function AITheme() {
  const [theme, setTheme] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!theme.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/ai-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: theme.trim() }),
      });
      if (!res.ok) throw new Error((await res.text()) || 'API Error');
      const json = await res.json();
      setResult(json.result || 'No result');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080808] to-[#0b1220] text-white">
      <Navbar isDynamicHome={false} darkData={true} />
      <Head>
        <title>AI Theme Help — image.raw</title>
      </Head>
      <main className="max-w-3xl mx-auto pt-28 pb-20 px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold">AI Theme Help</h1>
          
        </div>

        <p className="text-gray-300 mb-6">Give a one-sentence theme and get a concise Lightroom specification to achieve that look.</p>

        <form onSubmit={submit} className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-300">Theme (one sentence)</label>
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g. Moody teal and orange portrait with low highlights"
            className="w-full rounded-lg bg-[#0b0b0b]/60 border border-white/6 px-4 py-3 text-white placeholder:text-gray-400 mb-3"
          />
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg shadow" disabled={loading}>
              {loading ? 'Generating…' : 'Generate'}
            </button>
            <button type="button" className="px-4 py-2 bg-white/6 rounded-lg" onClick={() => { setTheme(''); setResult(null); setError(null); }}>
              Clear
            </button>
          </div>
        </form>

        {error && <div className="mb-4 p-4 bg-red-700/30 rounded">Error: {error}</div>}

        {result && (
          <section className="bg-white/5 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Suggested Lightroom Specification</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-100">{result}</pre>
          </section>
        )}

        {!result && !loading && <div className="mt-6 text-sm text-gray-400">Tip: Be specific about mood/lighting/camera type for a more useful preset.</div>}
      </main>
    </div>
  );
}
