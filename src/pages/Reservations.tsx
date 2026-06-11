import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Reservations() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      let res
      if (user?.role === 'ADMIN' || user?.role === 'HQ_MANAGER') {
        res = await api.get('/reservations')
      } else {
        res = await api.get(`/reservations/branch/${user?.branchId}`)
      }
      setReservations(res.data)
    } catch {
      setError('Failed to load reservations')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status })
      fetchReservations()
    } catch {
      setError('Failed to update reservation')
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: '#f4a261',
    CONFIRMED: '#2a9d8f',
    CANCELLED: '#888'
  }

  const filtered = filter === 'ALL' ? reservations : reservations.filter(r => r.status === filter)

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
          <h1 style={{ color: '#e63946', margin: 0 }}>📅 Reservations</h1>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        {error && <div style={{ color: '#ff6b6b', marginBottom: '16px' }}>{error}</div>}

        {/* Summary */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map(status => (
            <button key={status} onClick={() => setFilter(status)} style={{
              backgroundColor: filter === status ? '#e63946' : '#2a2a2a',
              color: filter === status ? '#fff' : '#888',
              border: `1px solid ${filter === status ? '#e63946' : '#333'}`,
              borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px'
            }}>
              {status} ({status === 'ALL' ? reservations.length : reservations.filter(r => r.status === status).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ color: '#888' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
            <p>No reservations found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filtered.map(reservation => (
              <div key={reservation.id} style={{
                backgroundColor: '#2a2a2a',
                border: `1px solid ${statusColors[reservation.status]}`,
                borderRadius: '12px', padding: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, color: '#fff' }}>{reservation.name}</h3>
                  <span style={{
                    backgroundColor: `${statusColors[reservation.status]}20`,
                    color: statusColors[reservation.status],
                    border: `1px solid ${statusColors[reservation.status]}`,
                    borderRadius: '4px', padding: '2px 8px', fontSize: '11px'
                  }}>{reservation.status}</span>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <p style={{ color: '#888', fontSize: '14px', margin: '4px 0' }}>📧 {reservation.email}</p>
                  <p style={{ color: '#888', fontSize: '14px', margin: '4px 0' }}>📞 {reservation.phone}</p>
                  <p style={{ color: '#ccc', fontSize: '14px', margin: '4px 0' }}>
                    📅 {new Date(reservation.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p style={{ color: '#ccc', fontSize: '14px', margin: '4px 0' }}>🕐 {reservation.time}</p>
                  <p style={{ color: '#ccc', fontSize: '14px', margin: '4px 0' }}>👥 {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}</p>
                  {reservation.branch && (
                    <p style={{ color: '#888', fontSize: '14px', margin: '4px 0' }}>🏢 {reservation.branch.name}</p>
                  )}
                </div>

                {reservation.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleUpdateStatus(reservation.id, 'CONFIRMED')} style={{
                      flex: 1, backgroundColor: '#2a9d8f20', color: '#2a9d8f',
                      border: '1px solid #2a9d8f', borderRadius: '6px',
                      padding: '8px', cursor: 'pointer', fontSize: '13px'
                    }}>✓ Confirm</button>
                    <button onClick={() => handleUpdateStatus(reservation.id, 'CANCELLED')} style={{
                      flex: 1, backgroundColor: '#ff000020', color: '#ff6b6b',
                      border: '1px solid #ff6b6b', borderRadius: '6px',
                      padding: '8px', cursor: 'pointer', fontSize: '13px'
                    }}>✗ Cancel</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}