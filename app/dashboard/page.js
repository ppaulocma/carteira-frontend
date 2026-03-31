'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../providers/auth-provider'
import { api } from '../lib/api'
import DepositForm from '../components/deposit-form'
import TransferForm from '../components/transfer-form'
import TransactionList from '../components/transaction-list'

const BRL = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, loading: authLoading, logout, refreshUser } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loadingTx, setLoadingTx] = useState(true)
  const [modal, setModal] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [user, authLoading, router])

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await api.getTransactions()
      setTransactions(res.data)
    } catch {
    } finally {
      setLoadingTx(false)
    }
  }, [])

  useEffect(() => {
    if (user) fetchTransactions()
  }, [user, fetchTransactions])

  const handleSuccess = async () => {
    setModal(null)
    await refreshUser()
    setLoadingTx(true)
    await fetchTransactions()
  }

  const handleReverse = async (id) => {
    await api.reverseTransaction(id)
    await refreshUser()
    setLoadingTx(true)
    await fetchTransactions()
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm">Carteira Digital</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{user.name.split(' ')[0]}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-gray-700 transition font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm">
          <p className="text-indigo-200 text-xs font-medium uppercase tracking-wide">
            Saldo disponível
          </p>
          <p className="text-4xl font-bold mt-2 tracking-tight">
            {BRL(user.balance)}
          </p>
          <p className="text-indigo-300 text-xs mt-3 truncate">{user.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setModal('deposit')}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-indigo-200 hover:shadow-sm transition group"
          >
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="font-semibold text-gray-900 text-sm">Depositar</p>
            <p className="text-xs text-gray-400 mt-0.5">Adicionar saldo</p>
          </button>

          <button
            onClick={() => setModal('transfer')}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-indigo-200 hover:shadow-sm transition group"
          >
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <p className="font-semibold text-gray-900 text-sm">Transferir</p>
            <p className="text-xs text-gray-400 mt-0.5">Enviar para alguém</p>
          </button>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2 px-1">Histórico</h2>
          <TransactionList
            transactions={transactions}
            userId={user.id}
            loading={loadingTx}
            onReverse={handleReverse}
          />
        </div>
      </main>

      {modal === 'deposit' && (
        <Modal title="Depositar" onClose={() => setModal(null)}>
          <DepositForm onSuccess={handleSuccess} />
        </Modal>
      )}
      {modal === 'transfer' && (
        <Modal title="Transferir" onClose={() => setModal(null)}>
          <TransferForm onSuccess={handleSuccess} />
        </Modal>
      )}
    </div>
  )
}
