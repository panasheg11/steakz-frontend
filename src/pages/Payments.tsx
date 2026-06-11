import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Payment } from '../types/types'
import { useAuth } from '../context/AuthContext'

export default function Payments() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [method, setMethod] = useState<'CASH' | 'CARD'>('CASH')

  const canProcess = user?.role === 'CASHIER'

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      let res
      if (user?.role === 'ADMIN' || user?.role === 'HQ_MANAGER') {
        res = await api.get('/payments')
      } else {
        res = await api.get(`/payments/branch/${user?.branchId}`)
      }
      setPayments(res.data)
    } catch {
      setError('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/payments', {
        orderId: parseInt(orderId),
        method
      })
      setOrderId('')
      setShowForm(false)
      fetchPayments()
    } catch {
      setError('Failed to process payment')
    }
  }

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff' }}>
      <div style={{
        backgroundColor: '#2a2a2a', padding: '16px 32px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: '1px solid #333'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/dashboard')} style={{
            backgroundColor: 'transparent', color: '#888', border: 'none', cursor: 'pointer', fontSize: '14px'
          }}>← Back</button>
          <h1 style={{ color: '#e63946', margin: 0 }}>💳 Payments</h1>
        </div>
        {canProcess && (
          <button onClick={() => setShowForm(!showForm)} style={{
            backgroundColor: '#e63946', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '8px 16px', cursor: 'pointer'
          }}>+ Process Payment</button>
        )}
      </div>

      <div style={{ padding: '32px' }}>
        {error && <div style={{ color: '#ff6b6b', marginBottom: '16px' }}>{error}</div>}

        {/* Revenue Summary */}
        <div style={{
          backgroundColor: '#2a2a2a', border: '1px solid #333',
          borderRadius: '12px', padding: '24px', marginBottom: '24px',
          display: 'flex', gap: '32px'
        }}>
          <div>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px' }}>TOTAL REVENUE</p>
            <p style={{ color: '#e63946', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              £{totalRevenue.toFixed(2)}
            </p>
          </div>
          <div>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px' }}>TOTAL TRANSACTIONS</p>
            <p style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              {payments.length}
            </p>
          </div>
          <div>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px' }}>CASH PAYMENTS</p>
            <p style={{ color: '#2a9d8f', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              {payments.filter(p => p.method === 'CASH').length}
            </p>
          </div>
          <div>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px' }}>CARD PAYMENTS</p>
            <p style={{ color: '#4cc9f0', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              {payments.filter(p => p.method === 'CARD').length}
            </p>
          </div>
        </div>

        {showForm && canProcess && (
          <div style={{
            backgroundColor: '#2a2a2a', border: '1px solid #333',
            borderRadius: '12px', padding: '24px', marginBottom: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px', color: '#ccc' }}>Process Payment</h3>
            <form onSubmit={handleProcessPayment}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>ORDER ID</label>
                  <input
                    type="number"
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', backgroundColor: '#3a3a3a', border: '1px solid #444', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>PAYMENT METHOD</label>
                  <select value={method} onChange={e => setMethod(e.target.value as 'CASH' | 'CARD')}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#3a3a3a', border: '1px solid #444', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}>
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ backgroundColor: '#e63946', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>
                  Process Payment
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ backgroundColor: '#333', color: '#ccc', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ color: '#888' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  {['Payment ID', 'Order ID', 'Amount', 'Method', 'Processed By', 'Date'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#888', fontSize: '12px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px 16px', color: '#888' }}>#{payment.id}</td>
                    <td style={{ padding: '12px 16px', color: '#ccc' }}>#{(payment as any).orderId}</td>
                    <td style={{ padding: '12px 16px', color: '#e63946', fontWeight: 'bold' }}>£{payment.amount.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        backgroundColor: payment.method === 'CASH' ? '#2a9d8f20' : '#4cc9f020',
                        color: payment.method === 'CASH' ? '#2a9d8f' : '#4cc9f0',
                        border: `1px solid ${payment.method === 'CASH' ? '#2a9d8f' : '#4cc9f0'}`,
                        borderRadius: '4px', padding: '2px 8px', fontSize: '11px'
                      }}>{payment.method}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#888', fontSize: '14px' }}>{payment.processedBy?.name}</td>
                    <td style={{ padding: '12px 16px', color: '#888', fontSize: '14px' }}>
                      {new Date(payment.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}