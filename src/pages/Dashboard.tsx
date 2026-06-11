import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (user?.role === 'CHIEF') return <ChiefDashboard user={user} logout={logout} />
  if (user?.role === 'DELIVERY_GUY') return <DeliveryDashboard user={user} logout={logout} />
  if (user?.role === 'HQ_MANAGER') return <HQDashboard user={user} logout={logout} navigate={navigate} />

  const menuItems = [
    { label: 'Branches', path: '/branches', roles: ['ADMIN', 'HQ_MANAGER'], icon: '🏢' },
    { label: 'Users', path: '/users', roles: ['ADMIN', 'HQ_MANAGER', 'BRANCH_MANAGER'], icon: '👥' },
    { label: 'Menu', path: '/menu', roles: ['ADMIN', 'HQ_MANAGER', 'BRANCH_MANAGER', 'WAITER', 'CASHIER', 'CHIEF'], icon: '🍽️' },
    { label: 'Orders', path: '/orders', roles: ['ADMIN', 'HQ_MANAGER', 'BRANCH_MANAGER', 'WAITER', 'CASHIER', 'CHIEF', 'DELIVERY_GUY'], icon: '📋' },
    { label: 'Payments', path: '/payments', roles: ['ADMIN', 'HQ_MANAGER', 'BRANCH_MANAGER', 'CASHIER'], icon: '💳' },
    { label: 'Reservations', path: '/reservations', roles: ['ADMIN', 'HQ_MANAGER', 'BRANCH_MANAGER'], icon: '📅' },
  ]

  const allowedItems = menuItems.filter(item => item.roles.includes(user?.role || ''))

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
        <h1 style={{ color: '#e63946', margin: 0 }}>🥩 Steakz MIS</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#ccc', fontSize: '14px' }}>
            {user?.name} · <span style={{ color: '#e63946' }}>{user?.role?.replace(/_/g, ' ')}</span>
            {user?.branch && <span style={{ color: '#888' }}> · {user.branch.name}</span>}
          </span>
          <button onClick={logout} style={{
            backgroundColor: '#333', color: '#ccc', border: '1px solid #444',
            borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px'
          }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <h2 style={{ color: '#ccc', marginBottom: '8px' }}>Welcome back, {user?.name}</h2>
        <p style={{ color: '#888', marginBottom: '32px' }}>What would you like to manage today?</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {allowedItems.map(item => (
            <div key={item.path} onClick={() => navigate(item.path)}
              style={{
                backgroundColor: '#2a2a2a', border: '1px solid #333',
                borderRadius: '12px', padding: '24px', cursor: 'pointer', textAlign: 'center'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#e63946')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#333')}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChiefDashboard({ user, logout }: { user: any, logout: () => void }) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders/branch/${user.branchId}`)
      setOrders(res.data.filter((o: any) => ['PENDING', 'PREPARING'].includes(o.status)))
    } catch {}
    setLoading(false)
  }

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status })
      fetchOrders()
    } catch {}
  }

  const statusColors: Record<string, string> = {
    PENDING: '#f4a261',
    PREPARING: '#4cc9f0',
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff' }}>
      <div style={{
        backgroundColor: '#2a2a2a', padding: '16px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid #333'
      }}>
        <h1 style={{ color: '#e63946', margin: 0 }}>👨‍🍳 Kitchen — {user?.branch?.name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#888', fontSize: '14px' }}>Auto-refreshes every 10s</span>
          <span style={{ color: '#ccc', fontSize: '14px' }}>{user?.name}</span>
          <button onClick={logout} style={{
            backgroundColor: '#333', color: '#ccc', border: '1px solid #444',
            borderRadius: '8px', padding: '8px 16px', cursor: 'pointer'
          }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#f4a26120', border: '1px solid #f4a261', borderRadius: '8px', padding: '16px 24px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px' }}>PENDING</p>
            <p style={{ color: '#f4a261', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {orders.filter(o => o.status === 'PENDING').length}
            </p>
          </div>
          <div style={{ backgroundColor: '#4cc9f020', border: '1px solid #4cc9f0', borderRadius: '8px', padding: '16px 24px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px' }}>PREPARING</p>
            <p style={{ color: '#4cc9f0', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {orders.filter(o => o.status === 'PREPARING').length}
            </p>
          </div>
        </div>

        {loading ? <div style={{ color: '#888' }}>Loading orders...</div> :
          orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <p>No pending orders. Kitchen is clear!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {orders.map(order => (
                <div key={order.id} style={{
                  backgroundColor: '#2a2a2a',
                  border: `2px solid ${statusColors[order.status]}`,
                  borderRadius: '12px', padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>Order #{order.id}</span>
                    <span style={{
                      backgroundColor: `${statusColors[order.status]}20`,
                      color: statusColors[order.status],
                      border: `1px solid ${statusColors[order.status]}`,
                      borderRadius: '4px', padding: '2px 8px', fontSize: '12px'
                    }}>{order.status}</span>
                  </div>
                  <p style={{ color: '#888', fontSize: '13px', margin: '0 0 8px' }}>
                    {order.type.replace('_', ' ')} {order.table ? `— Table ${order.table.number}` : ''}
                  </p>
                  <div style={{ marginBottom: '16px' }}>
                    {order.items.map((item: any) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                        <span style={{ color: '#ccc' }}>{item.menuItem.name}</span>
                        <span style={{ color: '#e63946', fontWeight: 'bold' }}>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {order.status === 'PENDING' && (
                      <button onClick={() => updateStatus(order.id, 'PREPARING')} style={{
                        flex: 1, backgroundColor: '#4cc9f020', color: '#4cc9f0',
                        border: '1px solid #4cc9f0', borderRadius: '8px',
                        padding: '10px', cursor: 'pointer', fontSize: '13px'
                      }}>Start Preparing</button>
                    )}
                    {order.status === 'PREPARING' && (
                      <button onClick={() => updateStatus(order.id, 'READY')} style={{
                        flex: 1, backgroundColor: '#2a9d8f20', color: '#2a9d8f',
                        border: '1px solid #2a9d8f', borderRadius: '8px',
                        padding: '10px', cursor: 'pointer', fontSize: '13px'
                      }}>Mark as Ready</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

function DeliveryDashboard({ user, logout }: { user: any, logout: () => void }) {
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    try {
      const res = await api.get('/orders/my-deliveries')
      setDeliveries(res.data)
    } catch {}
    setLoading(false)
  }

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status })
      fetchDeliveries()
    } catch {}
  }

  const statusColors: Record<string, string> = {
    READY: '#2a9d8f',
    DELIVERED: '#3a86ff',
    PAID: '#888'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff' }}>
      <div style={{
        backgroundColor: '#2a2a2a', padding: '16px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid #333'
      }}>
        <h1 style={{ color: '#e63946', margin: 0 }}>🚗 My Deliveries</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#ccc', fontSize: '14px' }}>{user?.name} · {user?.branch?.name}</span>
          <button onClick={logout} style={{
            backgroundColor: '#333', color: '#ccc', border: '1px solid #444',
            borderRadius: '8px', padding: '8px 16px', cursor: 'pointer'
          }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#2a9d8f20', border: '1px solid #2a9d8f', borderRadius: '8px', padding: '16px 24px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px' }}>READY FOR PICKUP</p>
            <p style={{ color: '#2a9d8f', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {deliveries.filter(d => d.status === 'READY').length}
            </p>
          </div>
          <div style={{ backgroundColor: '#3a86ff20', border: '1px solid #3a86ff', borderRadius: '8px', padding: '16px 24px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px' }}>OUT FOR DELIVERY</p>
            <p style={{ color: '#3a86ff', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {deliveries.filter(d => d.status === 'DELIVERED').length}
            </p>
          </div>
        </div>

        {loading ? <div style={{ color: '#888' }}>Loading deliveries...</div> :
          deliveries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
              <p>No deliveries assigned to you yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {deliveries.map(order => (
                <div key={order.id} style={{
                  backgroundColor: '#2a2a2a',
                  border: `2px solid ${statusColors[order.status] || '#333'}`,
                  borderRadius: '12px', padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>Order #{order.id}</span>
                    <span style={{
                      backgroundColor: `${statusColors[order.status]}20`,
                      color: statusColors[order.status],
                      border: `1px solid ${statusColors[order.status]}`,
                      borderRadius: '4px', padding: '2px 8px', fontSize: '12px'
                    }}>{order.status}</span>
                  </div>
                  {order.customer && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ color: '#ccc', fontSize: '14px', margin: '0 0 4px' }}>👤 {order.customer.name}</p>
                      <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>📍 {order.address}</p>
                      {order.customer.phone && <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>📞 {order.customer.phone}</p>}
                    </div>
                  )}
                  <div style={{ marginBottom: '16px' }}>
                    {order.items.map((item: any) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                        <span style={{ color: '#ccc' }}>{item.menuItem.name}</span>
                        <span style={{ color: '#e63946' }}>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ color: '#e63946', fontWeight: 'bold', margin: '0 0 12px' }}>£{order.totalPrice.toFixed(2)}</p>
                  {order.status === 'READY' && (
                    <button onClick={() => updateStatus(order.id, 'DELIVERED')} style={{
                      width: '100%', backgroundColor: '#3a86ff20', color: '#3a86ff',
                      border: '1px solid #3a86ff', borderRadius: '8px',
                      padding: '10px', cursor: 'pointer', fontSize: '13px'
                    }}>Mark as Delivered</button>
                  )}
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

function HQDashboard({ user, logout, navigate }: { user: any, logout: () => void, navigate: any }) {
  const [stats, setStats] = useState({
    totalBranches: 0, totalOrders: 0, totalRevenue: 0, totalStaff: 0
  })
  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [branchRes, orderRes, paymentRes, userRes] = await Promise.all([
        api.get('/branches'),
        api.get('/orders'),
        api.get('/payments'),
        api.get('/users')
      ])
      setBranches(branchRes.data)
      const totalRevenue = paymentRes.data.reduce((sum: number, p: any) => sum + p.amount, 0)
      setStats({
        totalBranches: branchRes.data.length,
        totalOrders: orderRes.data.length,
        totalRevenue,
        totalStaff: userRes.data.length
      })
    } catch {}
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff' }}>
      <div style={{
        backgroundColor: '#2a2a2a', padding: '16px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid #333'
      }}>
        <h1 style={{ color: '#e63946', margin: 0 }}>🥩 Steakz HQ Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#ccc', fontSize: '14px' }}>{user?.name} · <span style={{ color: '#f4a261' }}>HQ MANAGER</span></span>
          <button onClick={logout} style={{
            backgroundColor: '#333', color: '#ccc', border: '1px solid #444',
            borderRadius: '8px', padding: '8px 16px', cursor: 'pointer'
          }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        {loading ? <div style={{ color: '#888' }}>Loading...</div> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'TOTAL BRANCHES', value: stats.totalBranches, color: '#e63946' },
                { label: 'TOTAL ORDERS', value: stats.totalOrders, color: '#4cc9f0' },
                { label: 'TOTAL REVENUE', value: `£${stats.totalRevenue.toFixed(2)}`, color: '#2a9d8f' },
                { label: 'TOTAL STAFF', value: stats.totalStaff, color: '#f4a261' }
              ].map(stat => (
                <div key={stat.label} style={{
                  backgroundColor: '#2a2a2a', border: '1px solid #333',
                  borderRadius: '12px', padding: '24px'
                }}>
                  <p style={{ color: '#888', fontSize: '12px', margin: '0 0 8px', letterSpacing: '1px' }}>{stat.label}</p>
                  <p style={{ color: stat.color, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <h3 style={{ color: '#ccc', marginBottom: '16px' }}>All Branches</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {branches.map(branch => (
                <div key={branch.id} style={{
                  backgroundColor: '#2a2a2a',
                  border: `1px solid ${branch.isHQ ? '#e63946' : '#333'}`,
                  borderRadius: '12px', padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, color: '#fff' }}>{branch.name}</h3>
                    {branch.isHQ && <span style={{ color: '#e63946', fontSize: '12px' }}>HQ</span>}
                  </div>
                  <p style={{ color: '#888', fontSize: '14px', margin: '4px 0' }}>📍 {branch.city}</p>
                  <p style={{ color: '#888', fontSize: '14px', margin: '4px 0' }}>📞 {branch.phone}</p>
                  {branch._count && (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '16px', borderTop: '1px solid #333', paddingTop: '12px' }}>
                      <span style={{ color: '#ccc', fontSize: '13px' }}>👥 {branch._count.users}</span>
                      <span style={{ color: '#ccc', fontSize: '13px' }}>📋 {branch._count.orders}</span>
                      <span style={{ color: '#ccc', fontSize: '13px' }}>🪑 {branch._count.tables}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { label: '📋 View All Orders', path: '/orders' },
                { label: '💳 View All Payments', path: '/payments' },
                { label: '👥 View All Users', path: '/users' }
              ].map(item => (
                <button key={item.path} onClick={() => navigate(item.path)} style={{
                  backgroundColor: '#2a2a2a', color: '#ccc',
                  border: '1px solid #333', borderRadius: '8px',
                  padding: '12px 24px', cursor: 'pointer', fontSize: '14px'
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#e63946')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#333')}
                >{item.label}</button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}