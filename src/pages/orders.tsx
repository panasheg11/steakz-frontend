import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Order, MenuItem, OrderStatus } from '../types/types'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedItems, setSelectedItems] = useState<{ menuItemId: number, quantity: number }[]>([])
  const [orderType, setOrderType] = useState<'DINE_IN' | 'DELIVERY'>('DINE_IN')
  const [address, setAddress] = useState('')
  const [tableId, setTableId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '' })
  const [showNewCustomer, setShowNewCustomer] = useState(false)

  const canCreate = ['WAITER', 'CASHIER'].includes(user?.role || '')
  const canUpdateStatus = ['CHIEF', 'CASHIER', 'DELIVERY_GUY', 'BRANCH_MANAGER'].includes(user?.role || '')

  useEffect(() => {
    fetchOrders()
    fetchMenu()
    fetchCustomers()
  }, [])

  const fetchOrders = async () => {
    try {
      let res
      if (user?.role === 'ADMIN' || user?.role === 'HQ_MANAGER') {
        res = await api.get('/orders')
      } else if (user?.role === 'DELIVERY_GUY') {
        res = await api.get('/orders/my-deliveries')
      } else {
        res = await api.get(`/orders/branch/${user?.branchId}`)
      }
      setOrders(res.data)
    } catch {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const fetchMenu = async () => {
    try {
      const res = await api.get('/menu')
      setMenuItems(res.data.filter((item: MenuItem) => item.isAvailable))
    } catch {}
  }

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers')
      setCustomers(res.data)
    } catch {}
  }

  const handleAddItem = (menuItemId: number) => {
    const existing = selectedItems.find(i => i.menuItemId === menuItemId)
    if (existing) {
      setSelectedItems(selectedItems.map(i =>
        i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i
      ))
    } else {
      setSelectedItems([...selectedItems, { menuItemId, quantity: 1 }])
    }
  }

  const handleRemoveItem = (menuItemId: number) => {
    setSelectedItems(selectedItems.filter(i => i.menuItemId !== menuItemId))
  }

  const handleCreateCustomer = async () => {
    try {
      const res = await api.post('/customers', newCustomer)
      setCustomers([...customers, res.data])
      setCustomerId(res.data.id.toString())
      setShowNewCustomer(false)
      setNewCustomer({ name: '', phone: '', email: '', address: '' })
    } catch {
      setError('Failed to create customer')
    }
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedItems.length === 0) {
      setError('Please add at least one item')
      return
    }
    try {
      await api.post('/orders', {
        type: orderType,
        items: selectedItems,
        address: orderType === 'DELIVERY' ? address : null,
        tableId: orderType === 'DINE_IN' && tableId && parseInt(tableId) > 0 ? parseInt(tableId) : null,
        customerId: customerId ? parseInt(customerId) : null
      })
      setSelectedItems([])
      setShowForm(false)
      setCustomerId('')
      setAddress('')
      setTableId('')
      fetchOrders()
    } catch {
      setError('Failed to create order')
    }
  }

  const handleUpdateStatus = async (orderId: number, status: OrderStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status })
      fetchOrders()
    } catch {
      setError('Failed to update order status')
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: '#f4a261',
    PREPARING: '#4cc9f0',
    READY: '#2a9d8f',
    DELIVERED: '#3a86ff',
    PAID: '#2a9d8f',
    CANCELLED: '#888'
  }

  const nextStatus: Record<string, OrderStatus> = {
    PENDING: 'PREPARING',
    PREPARING: 'READY',
    READY: 'DELIVERED',
    DELIVERED: 'PAID'
  }

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

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
          <h1 style={{ color: '#e63946', margin: 0 }}>📋 Orders</h1>
        </div>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)} style={{
            backgroundColor: '#e63946', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '8px 16px', cursor: 'pointer'
          }}>+ New Order</button>
        )}
      </div>

      <div style={{ padding: '32px' }}>
        {error && <div style={{ color: '#ff6b6b', marginBottom: '16px' }}>{error}</div>}

        {showForm && canCreate && (
          <div style={{
            backgroundColor: '#2a2a2a', border: '1px solid #333',
            borderRadius: '12px', padding: '24px', marginBottom: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px', color: '#ccc' }}>New Order</h3>
            <form onSubmit={handleCreateOrder}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {['DINE_IN', 'DELIVERY'].map(type => (
                  <button key={type} type="button"
                    onClick={() => setOrderType(type as 'DINE_IN' | 'DELIVERY')}
                    style={{
                      backgroundColor: orderType === type ? '#e63946' : '#333',
                      color: orderType === type ? '#fff' : '#888',
                      border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer'
                    }}>{type.replace('_', ' ')}</button>
                ))}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '8px' }}>CUSTOMER (OPTIONAL)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select value={customerId} onChange={e => setCustomerId(e.target.value)}
                    style={{ flex: 1, padding: '10px', backgroundColor: '#3a3a3a', border: '1px solid #444', borderRadius: '8px', color: '#fff' }}>
                    <option value=''>Walk-in / No customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} {c.phone ? `— ${c.phone}` : ''}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => setShowNewCustomer(!showNewCustomer)}
                    style={{ backgroundColor: '#333', color: '#ccc', border: '1px solid #444', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontSize: '13px' }}>
                    + New
                  </button>
                </div>
              </div>

              {showNewCustomer && (
                <div style={{ backgroundColor: '#3a3a3a', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                  <p style={{ color: '#888', fontSize: '12px', margin: '0 0 12px' }}>NEW CUSTOMER</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { field: 'name', label: 'Name' },
                      { field: 'phone', label: 'Phone' },
                      { field: 'email', label: 'Email' },
                      { field: 'address', label: 'Address' }
                    ].map(({ field, label }) => (
                      <div key={field}>
                        <label style={{ color: '#888', fontSize: '11px', display: 'block', marginBottom: '4px' }}>{label.toUpperCase()}</label>
                        <input
                          value={newCustomer[field as keyof typeof newCustomer]}
                          onChange={e => setNewCustomer({ ...newCustomer, [field]: e.target.value })}
                          style={{ width: '100%', padding: '8px', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
                        />
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={handleCreateCustomer}
                    style={{ marginTop: '12px', backgroundColor: '#e63946', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}>
                    Save Customer
                  </button>
                </div>
              )}

              {orderType === 'DELIVERY' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>DELIVERY ADDRESS</label>
                  <input value={address} onChange={e => setAddress(e.target.value)} required
                    style={{ width: '100%', padding: '10px', backgroundColor: '#3a3a3a', border: '1px solid #444', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                </div>
              )}

              {orderType === 'DINE_IN' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>TABLE NUMBER</label>
                  <input type="number" value={tableId} onChange={e => setTableId(e.target.value)}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#3a3a3a', border: '1px solid #444', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '8px' }}>ADD ITEMS</label>
                {Object.entries(groupedMenu).map(([category, items]) => (
                  <div key={category} style={{ marginBottom: '12px' }}>
                    <p style={{ color: '#e63946', fontSize: '11px', letterSpacing: '1px', margin: '0 0 8px' }}>{category}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '6px' }}>
                      {items.map(item => {
                        const selected = selectedItems.find(i => i.menuItemId === item.id)
                        return (
                          <button key={item.id} type="button" onClick={() => handleAddItem(item.id)}
                            style={{
                              backgroundColor: selected ? '#e6394620' : '#3a3a3a',
                              border: `1px solid ${selected ? '#e63946' : '#444'}`,
                              borderRadius: '8px', padding: '8px 12px', cursor: 'pointer',
                              color: '#fff', textAlign: 'left', fontSize: '13px'
                            }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{item.name}</span>
                              {selected && <span style={{ color: '#e63946', fontWeight: 'bold' }}>x{selected.quantity}</span>}
                            </div>
                            <div style={{ color: '#e63946', fontSize: '12px' }}>£{item.price.toFixed(2)}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {selectedItems.length > 0 && (
                <div style={{ backgroundColor: '#3a3a3a', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                  <p style={{ color: '#888', fontSize: '12px', margin: '0 0 8px' }}>ORDER SUMMARY</p>
                  {selectedItems.map(si => {
                    const item = menuItems.find(m => m.id === si.menuItemId)
                    return (
                      <div key={si.menuItemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ color: '#fff', fontSize: '14px' }}>{item?.name} x{si.quantity}</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ color: '#e63946' }}>£{((item?.price || 0) * si.quantity).toFixed(2)}</span>
                          <button type="button" onClick={() => handleRemoveItem(si.menuItemId)}
                            style={{ backgroundColor: 'transparent', color: '#888', border: 'none', cursor: 'pointer' }}>✕</button>
                        </div>
                      </div>
                    )
                  })}
                  <div style={{ borderTop: '1px solid #444', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#ccc', fontWeight: 'bold' }}>TOTAL</span>
                    <span style={{ color: '#e63946', fontWeight: 'bold', fontSize: '16px' }}>
                      £{selectedItems.reduce((sum, si) => {
                        const item = menuItems.find(m => m.id === si.menuItemId)
                        return sum + (item?.price || 0) * si.quantity
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ backgroundColor: '#e63946', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>
                  Create Order
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
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <p>No orders yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {orders.map(order => (
              <div key={order.id} style={{
                backgroundColor: '#2a2a2a', border: '1px solid #333',
                borderRadius: '12px', padding: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>Order #{order.id}</span>
                    <span style={{ color: '#888', fontSize: '13px', marginLeft: '8px' }}>{order.type.replace('_', ' ')}</span>
                    {order.table && <span style={{ color: '#888', fontSize: '13px', marginLeft: '8px' }}>Table {order.table.number}</span>}
                  </div>
                  <span style={{
                    backgroundColor: `${statusColors[order.status]}20`,
                    color: statusColors[order.status],
                    border: `1px solid ${statusColors[order.status]}`,
                    borderRadius: '4px', padding: '2px 8px', fontSize: '11px'
                  }}>{order.status}</span>
                </div>

                {order.customer && (
                  <p style={{ color: '#888', fontSize: '13px', margin: '0 0 8px' }}>👤 {order.customer.name}</p>
                )}

                <div style={{ marginBottom: '12px' }}>
                  {order.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span style={{ color: '#ccc' }}>{item.menuItem.name} x{item.quantity}</span>
                      <span style={{ color: '#888' }}>£{(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #333', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#e63946', fontWeight: 'bold' }}>£{order.totalPrice.toFixed(2)}</span>
                    {canUpdateStatus && nextStatus[order.status] && (
                      <button onClick={() => handleUpdateStatus(order.id, nextStatus[order.status])}
                        style={{
                          backgroundColor: '#e6394620', color: '#e63946',
                          border: '1px solid #e63946', borderRadius: '6px',
                          padding: '4px 12px', cursor: 'pointer', fontSize: '12px'
                        }}>
                        → {nextStatus[order.status]}
                      </button>
                    )}
                  </div>
                  {user?.role === 'BRANCH_MANAGER' && order.type === 'DELIVERY' && order.status === 'READY' && !order.deliveryGuy && (
                    <AssignDelivery orderId={order.id} branchId={user.branchId!} onAssigned={fetchOrders} />
                  )}
                  {order.deliveryGuy && (
                    <p style={{ color: '#888', fontSize: '12px', margin: '4px 0' }}>
                      🚗 Assigned to: {(order.deliveryGuy as any).name}
                    </p>
                  )}
                </div>

                {order.branch && (
                  <div style={{ marginTop: '8px', color: '#888', fontSize: '12px' }}>
                    📍 {order.branch.name}
                  </div>
                )}

                <div style={{ marginTop: '4px', color: '#555', fontSize: '11px' }}>
                  {new Date(order.createdAt).toLocaleString('en-GB')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AssignDelivery({ orderId, branchId, onAssigned }: { orderId: number, branchId: number, onAssigned: () => void }) {
  const [drivers, setDrivers] = useState<any[]>([])
  const [selectedDriver, setSelectedDriver] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (show) {
      api.get(`/users/branch/${branchId}`)
        .then(res => setDrivers(res.data.filter((u: any) => u.role === 'DELIVERY_GUY')))
        .catch(() => {})
    }
  }, [show, branchId])

  const handleAssign = async () => {
    if (!selectedDriver) return
    try {
      await api.patch(`/orders/${orderId}/assign-delivery`, { deliveryGuyId: parseInt(selectedDriver) })
      setShow(false)
      onAssigned()
    } catch {}
  }

  if (!show) return (
    <button onClick={() => setShow(true)} style={{
      width: '100%', backgroundColor: '#3a86ff20', color: '#3a86ff',
      border: '1px solid #3a86ff', borderRadius: '6px',
      padding: '6px', cursor: 'pointer', fontSize: '12px', marginTop: '4px'
    }}>Assign Delivery Driver</button>
  )

  return (
    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
      <select value={selectedDriver} onChange={e => setSelectedDriver(e.target.value)}
        style={{ flex: 1, padding: '6px', backgroundColor: '#3a3a3a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '12px' }}>
        <option value=''>Select driver</option>
        {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>
      <button onClick={handleAssign} style={{
        backgroundColor: '#3a86ff', color: '#fff', border: 'none',
        borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px'
      }}>Assign</button>
      <button onClick={() => setShow(false)} style={{
        backgroundColor: '#333', color: '#888', border: 'none',
        borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px'
      }}>Cancel</button>
    </div>
  )
}