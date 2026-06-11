import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { MenuItem, MenuCategory } from '../types/types'
import { useAuth } from '../context/AuthContext'

export default function Menu() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'MAIN' as MenuCategory
  })

  const canEdit = ['ADMIN', 'BRANCH_MANAGER'].includes(user?.role || '')

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const res = await api.get('/menu')
      setMenuItems(res.data)
    } catch {
      setError('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/menu', { ...form, price: parseFloat(form.price) })
      setForm({ name: '', description: '', price: '', category: 'MAIN' })
      setShowForm(false)
      fetchMenu()
    } catch {
      setError('Failed to create menu item')
    }
  }

  const handleToggleAvailable = async (id: number, isAvailable: boolean) => {
    try {
      await api.put(`/menu/${id}`, { isAvailable: !isAvailable })
      fetchMenu()
    } catch {
      setError('Failed to update menu item')
    }
  }

  const categories = ['ALL', 'STARTER', 'MAIN', 'DESSERT', 'DRINK']
  const categoryIcons: Record<string, string> = {
    ALL: '🍽️', STARTER: '🥗', MAIN: '🥩', DESSERT: '🍰', DRINK: '🥤'
  }

  const filteredItems = selectedCategory === 'ALL'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory)

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
          <h1 style={{ color: '#e63946', margin: 0 }}>🍽️ Menu</h1>
        </div>
        {canEdit && (
          <button onClick={() => setShowForm(!showForm)} style={{
            backgroundColor: '#e63946', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '8px 16px', cursor: 'pointer'
          }}>+ Add Item</button>
        )}
      </div>

      <div style={{ padding: '32px' }}>
        {error && <div style={{ color: '#ff6b6b', marginBottom: '16px' }}>{error}</div>}

        {showForm && canEdit && (
          <div style={{
            backgroundColor: '#2a2a2a', border: '1px solid #333',
            borderRadius: '12px', padding: '24px', marginBottom: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px', color: '#ccc' }}>New Menu Item</h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>NAME</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                    style={{ width: '100%', padding: '10px', backgroundColor: '#3a3a3a', border: '1px solid #444', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>PRICE (£)</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required
                    style={{ width: '100%', padding: '10px', backgroundColor: '#3a3a3a', border: '1px solid #444', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>DESCRIPTION</label>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required
                    style={{ width: '100%', padding: '10px', backgroundColor: '#3a3a3a', border: '1px solid #444', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>CATEGORY</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as MenuCategory })}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#3a3a3a', border: '1px solid #444', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}>
                    {['STARTER', 'MAIN', 'DESSERT', 'DRINK'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ backgroundColor: '#e63946', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>Create Item</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ backgroundColor: '#333', color: '#ccc', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
              backgroundColor: selectedCategory === cat ? '#e63946' : '#2a2a2a',
              color: selectedCategory === cat ? '#fff' : '#888',
              border: `1px solid ${selectedCategory === cat ? '#e63946' : '#333'}`,
              borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px'
            }}>
              {categoryIcons[cat]} {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ color: '#888' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredItems.map(item => (
              <div key={item.id} style={{
                backgroundColor: '#2a2a2a',
                border: `1px solid ${item.isAvailable ? '#333' : '#ff000030'}`,
                borderRadius: '12px', padding: '20px',
                opacity: item.isAvailable ? 1 : 0.6
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: '16px' }}>{item.name}</h3>
                  <span style={{ color: '#e63946', fontWeight: 'bold', fontSize: '16px' }}>£{item.price.toFixed(2)}</span>
                </div>
                <p style={{ color: '#888', fontSize: '13px', margin: '0 0 12px' }}>{item.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    backgroundColor: '#33333380', color: '#888',
                    borderRadius: '4px', padding: '2px 8px', fontSize: '11px'
                  }}>{categoryIcons[item.category]} {item.category}</span>
                  {canEdit && (
                    <button onClick={() => handleToggleAvailable(item.id, item.isAvailable)} style={{
                      backgroundColor: item.isAvailable ? '#33333380' : '#2a9d8f20',
                      color: item.isAvailable ? '#888' : '#2a9d8f',
                      border: `1px solid ${item.isAvailable ? '#444' : '#2a9d8f'}`,
                      borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', fontSize: '12px'
                    }}>
                      {item.isAvailable ? 'Disable' : 'Enable'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}