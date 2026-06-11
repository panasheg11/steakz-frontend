import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { User, Branch, Role } from '../types/types'
import { useAuth } from '../context/AuthContext'

export default function Users() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'WAITER' as Role, branchId: ''
  })

  useEffect(() => {
    fetchUsers()
    fetchBranches()
  }, [])

  const fetchUsers = async () => {
    try {
      let res
      if (currentUser?.role === 'BRANCH_MANAGER') {
        res = await api.get(`/users/branch/${currentUser.branchId}`)
      } else {
        res = await api.get('/users')
      }
      setUsers(res.data)
    } catch {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const fetchBranches = async () => {
    try {
      const res = await api.get('/branches')
      setBranches(res.data)
    } catch {}
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/users', {
        ...form,
        branchId: form.branchId ? parseInt(form.branchId) : null
      })
      setForm({ name: '', email: '', password: '', role: 'WAITER', branchId: '' })
      setShowForm(false)
      fetchUsers()
    } catch {
      setError('Failed to create user')
    }
  }

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    try {
      await api.put(`/users/${userId}`, { isActive: !isActive })
      fetchUsers()
    } catch {
      setError('Failed to update user')
    }
  }

  const roleColors: Record<string, string> = {
    ADMIN: '#e63946',
    HQ_MANAGER: '#f4a261',
    BRANCH_MANAGER: '#2a9d8f',
    CHIEF: '#e9c46a',
    WAITER: '#4cc9f0',
    CASHIER: '#7209b7',
    DELIVERY_GUY: '#3a86ff',
    CUSTOMER: '#888'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff' }}>
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
            backgroundColor: 'transparent', color: '#888', border: 'none', cursor: 'pointer', fontSize: '14px'
          }}>← Back</button>
          <h1 style={{ color: '#e63946', margin: 0 }}>👥 Users</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          backgroundColor: '#e63946', color: '#fff', border: 'none',
          borderRadius: '8px', padding: '8px 16px', cursor: 'pointer'
        }}>+ Add User</button>
      </div>

      <div style={{ padding: '32px' }}>
        {error && <div style={{ color: '#ff6b6b', marginBottom: '16px' }}>{error}</div>}

        {showForm && (
          <div style={{
            backgroundColor: '#2a2a2a', border: '1px solid #333',
            borderRadius: '12px', padding: '24px', marginBottom: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px', color: '#ccc' }}>New User</h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { field: 'name', label: 'NAME', type: 'text' },
                  { field: 'email', label: 'EMAIL', type: 'email' },
                  { field: 'password', label: 'PASSWORD', type: 'password' }
                ].map(({ field, label, type }) => (
                  <div key={field}>
                    <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>{label}</label>
                    <input
                      type={type}
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                      required
                      style={{
                        width: '100%', padding: '10px', backgroundColor: '#3a3a3a',
                        border: '1px solid #444', borderRadius: '8px', color: '#fff', boxSizing: 'border-box'
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>ROLE</label>
                  <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value as Role })}
                    style={{
                      width: '100%', padding: '10px', backgroundColor: '#3a3a3a',
                      border: '1px solid #444', borderRadius: '8px', color: '#fff', boxSizing: 'border-box'
                    }}
                  >
                    {['WAITER', 'CASHIER', 'CHIEF', 'DELIVERY_GUY', 'BRANCH_MANAGER', 'HQ_MANAGER', 'ADMIN'].map(r => (
                      <option key={r} value={r}>{r.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>BRANCH</label>
                  <select
                    value={form.branchId}
                    onChange={e => setForm({ ...form, branchId: e.target.value })}
                    style={{
                      width: '100%', padding: '10px', backgroundColor: '#3a3a3a',
                      border: '1px solid #444', borderRadius: '8px', color: '#fff', boxSizing: 'border-box'
                    }}
                  >
                    <option value=''>No Branch</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button type="submit" style={{
                  backgroundColor: '#e63946', color: '#fff', border: 'none',
                  borderRadius: '8px', padding: '10px 20px', cursor: 'pointer'
                }}>Create User</button>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  backgroundColor: '#333', color: '#ccc', border: 'none',
                  borderRadius: '8px', padding: '10px 20px', cursor: 'pointer'
                }}>Cancel</button>
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
                  {['Name', 'Email', 'Role', 'Branch', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#888', fontSize: '12px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px 16px', color: '#fff' }}>{user.name}</td>
                    <td style={{ padding: '12px 16px', color: '#888', fontSize: '14px' }}>{user.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        backgroundColor: `${roleColors[user.role]}20`,
                        color: roleColors[user.role],
                        border: `1px solid ${roleColors[user.role]}`,
                        borderRadius: '4px', padding: '2px 8px', fontSize: '11px'
                      }}>{user.role.replace('_', ' ')}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#888', fontSize: '14px' }}>
                      {user.branch?.name || '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        color: user.isActive ? '#2a9d8f' : '#888',
                        fontSize: '14px'
                      }}>{user.isActive ? '● Active' : '○ Inactive'}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        style={{
                          backgroundColor: user.isActive ? '#33333380' : '#2a9d8f20',
                          color: user.isActive ? '#888' : '#2a9d8f',
                          border: `1px solid ${user.isActive ? '#444' : '#2a9d8f'}`,
                          borderRadius: '6px', padding: '4px 12px',
                          cursor: 'pointer', fontSize: '12px'
                        }}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
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