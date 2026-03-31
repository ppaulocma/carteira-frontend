'use client'

import { useState } from 'react'

const BRL = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

const dateFormat = (str) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(str))

const TYPE_ICONS = {
  deposit: (
    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </div>
  ),
  transfer_sent: (
    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
      <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </div>
  ),
  transfer_received: (
    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  ),
  reverse: (
    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    </div>
  ),
}

function TransactionItem({ tx, userId, onReverse }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isSent = tx.type === 'transfer' && tx.sender_id === userId
  const iconKey = tx.type === 'transfer' ? (isSent ? 'transfer_sent' : 'transfer_received') : tx.type

  const label = {
    deposit: 'Depósito',
    transfer: isSent ? `Enviado para ${tx.receiver?.name ?? '—'}` : `Recebido de ${tx.sender?.name ?? '—'}`,
    reverse: 'Estorno',
  }[tx.type]

  const isPositive = !isSent
  const amountColor = isPositive ? 'text-emerald-600' : 'text-gray-800'
  const sign = isPositive ? '+' : '-'
  const canReverse = tx.status === 'completed' && tx.type !== 'reverse'

  const handleReverse = async () => {
    setError('')
    setLoading(true)
    try {
      await onReverse(tx.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      {TYPE_ICONS[iconKey] ?? TYPE_ICONS.reverse}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{dateFormat(tx.created_at)}</p>
        {tx.status === 'reversed' && (
          <span className="text-xs text-orange-500 font-medium">Revertida</span>
        )}
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={`text-sm font-semibold ${amountColor} ${tx.status === 'reversed' ? 'line-through opacity-40' : ''}`}
        >
          {sign} {BRL(tx.amount)}
        </span>

        {canReverse && (
          <button
            onClick={handleReverse}
            disabled={loading}
            title="Reverter transação"
            className="text-gray-300 hover:text-red-400 transition disabled:opacity-40"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default function TransactionList({ transactions, userId, loading, onReverse }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 flex justify-center">
        <svg className="w-6 h-6 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <p className="text-gray-400 text-sm">Nenhuma transação ainda</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-4">
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} tx={tx} userId={userId} onReverse={onReverse} />
      ))}
    </div>
  )
}
