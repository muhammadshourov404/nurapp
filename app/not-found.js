import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-arabic text-6xl text-amber-300 mb-4">٤٠٤</p>
        <h1 className="text-white text-2xl font-bold mb-2">পেজ পাওয়া যায়নি</h1>
        <p className="text-gray-400 text-sm mb-8">Page Not Found</p>
        <Link
          href="/nurapp"
          className="inline-block px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all"
        >
          🏠 হোমে ফিরে যান
        </Link>
      </div>
    </main>
  )
}
