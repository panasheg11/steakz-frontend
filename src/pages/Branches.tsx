import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Branch } from '../types/types'

export default function Branches() {
  const navigate = useNavigate()
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', city: '', address: '', phone: '' })

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      const res = await api.get('/branches')
      setBranches(res.data)
    } catch {
      setError('Failed to load branches')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/branches', form)
      setForm({ name: '', city: '', address: '', phone: '' })
      setShowForm(false)
      fetchBranches()
    } catch {
      setError('Failed to create branch')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #333'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/dashboard')} style={{
            backgroundColor: 'transparent',
            color: '#888',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px'
          }}>← Back</button>
          <h1 style={{ color: '#e63946', margin: 0 }}>🏢 Branches</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: '#e63946',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          + Add Branch
        </button>
      </div>

      <div style={{ padding: '32px' }}>
        {error && <div style={{ color: '#ff6b6b', marginBottom: '16px' }}>{error}</div>}

        {/* Add Branch Form */}
        {showForm && (
          <div style={{
            backgroundColor: '#2a2a2a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px', color: '#ccc' }}>New Branch</h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {['name', 'city', 'address', 'phone'].map(field => (
                  <div key={field}>
                    <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      {field.toUpperCase()}
                    </label>
                    <input
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#3a3a3a',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        color: '#fff',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button type="submit" style={{
                  backgroundColor: '#e63946',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer'
                }}>Create Branch</button>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  backgroundColor: '#333',
                  color: '#ccc',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Branches Grid */}
        {loading ? (
          <div style={{ color: '#888' }}>Loading...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {branches.map(branch => (
              <div key={branch.id} style={{
                backgroundColor: '#2a2a2a',
                border: `1px solid ${branch.isHQ ? '#e63946' : '#333'}`,
                borderRadius: '12px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 8px', color: '#fff' }}>{branch.name}</h3>
                  {branch.isHQ && (
                    <span style={{
                      backgroundColor: '#e6394620',
                      color: '#e63946',
                      border: '1px solid #e63946',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '11px'
                    }}>HQ</span>
                  )}
                </div>
                <p style={{ color: '#888', margin: '4px 0', fontSize: '14px' }}>📍 {branch.city}</p>
                <p style={{ color: '#888', margin: '4px 0', fontSize: '14px' }}>🏠 {branch.address}</p>
                <p style={{ color: '#888', margin: '4px 0', fontSize: '14px' }}>📞 {branch.phone}</p>
                {branch._count && (
                  <div style={{
                    marginTop: '16px',
                    display: 'flex',
                    gap: '16px',
                    borderTop: '1px solid #333',
                    paddingTop: '16px'
                  }}>
                    <span style={{ color: '#ccc', fontSize: '13px' }}>👥 {branch._count.users} staff</span>
                    <span style={{ color: '#ccc', fontSize: '13px' }}>📋 {branch._count.orders} orders</span>
                    <span style={{ color: '#ccc', fontSize: '13px' }}>🪑 {branch._count.tables} tables</span>
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