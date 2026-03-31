import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-indigo-600">404</p>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">Página não encontrada</h1>
        <p className="mt-2 text-sm text-gray-500">O endereço que você acessou não existe.</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
