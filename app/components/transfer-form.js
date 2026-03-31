'use client'

import { useState } from 'react'
import { api } from '../lib/api'

export default function TransferForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [receiver, setReceiver] = useState(null)
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const lookupUser = async () => {
    if (!email) return
    setSearching(true)
    setError('')
    setReceiver(null)
    try {
      const res = await api.findUserByEmail(email)
      setReceiver(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setSearching(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!receiver) {
      setError('Busque o destinatário pelo email antes de continuar.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.transfer({ receiver_id: receiver.id, amount: parseFloat(amount) })
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email do destinatário
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setReceiver(null) }}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="destinatario@email.com"
          />
          <button
            type="button"
            onClick={lookupUser}
            disabled={searching || !email}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            {searching ? '...' : 'Buscar'}
          </button>
        </div>
        {receiver && (
          <div className="mt-2 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {receiver.name}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Valor da transferência
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
            R$
          </span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="0,00"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !receiver}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processando...' : 'Confirmar Transferência'}
      </button>
    </form>
  )
}
