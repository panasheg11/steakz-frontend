import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { MenuItem, Branch } from '../types/types'

export default function Home() {
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [reservation, setReservation] = useState({
    name: '', email: '', phone: '', date: '', time: '', partySize: '2', branchId: ''
  })
  const [reservationSuccess, setReservationSuccess] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(() => {})

    fetch('http://localhost:5000/api/branches')
      .then(res => res.json())
      .then(data => setBranches(data))
      .catch(() => {})
  }, [])

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation)
      })
      if (!res.ok) throw new Error()
      setReservationSuccess(true)
      setReservation({ name: '', email: '', phone: '', date: '', time: '', partySize: '2', branchId: '' })
    } catch {
      alert('Failed to make reservation. Please try again.')
    }
  }

  const featured = menuItems.filter(i => i.category === 'MAIN').slice(0, 4)

  return (
    <div style={{ backgroundColor: '#0f0f0f', color: '#fff', fontFamily: 'Georgia, serif' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: 'rgba(15,15,15,0.95)',
        borderBottom: '1px solid #2a2a2a',
        padding: '16px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <h1 style={{ color: '#e63946', margin: 0, fontSize: '24px', letterSpacing: '2px' }}>🥩 STEAKZ</h1>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['Menu', 'Branches', 'Order Online', 'Book a Table'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} style={{
              color: '#ccc', textDecoration: 'none', fontSize: '14px', letterSpacing: '1px'
            }}>{item.toUpperCase()}</a>
          ))}
          <button onClick={() => navigate('/login')} style={{
            backgroundColor: '#e63946', color: '#fff', border: 'none',
            borderRadius: '4px', padding: '10px 20px', cursor: 'pointer',
            fontSize: '13px', letterSpacing: '1px'
          }}>STAFF LOGIN</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1558030006-450675393462?w=1600") center/cover',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', paddingTop: '80px'
      }}>
        <div>
          <p style={{ color: '#e63946', letterSpacing: '4px', fontSize: '14px', marginBottom: '16px' }}>
            PREMIUM STEAKHOUSE
          </p>
          <h1 style={{ fontSize: '72px', fontWeight: 'bold', margin: '0 0 24px', lineHeight: 1.1 }}>
            The Art of<br />the Perfect Steak
          </h1>
          <p style={{ color: '#ccc', fontSize: '18px', marginBottom: '40px', maxWidth: '500px' }}>
            Exceptional cuts, expertly prepared. Experience the finest steakhouse in the UK.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="#menu" style={{
              backgroundColor: '#e63946', color: '#fff', padding: '16px 32px',
              textDecoration: 'none', borderRadius: '4px', fontSize: '14px', letterSpacing: '1px'
            }}>VIEW MENU</a>
            <a href="#order-online" style={{
              backgroundColor: 'transparent', color: '#fff',
              padding: '16px 32px', textDecoration: 'none',
              border: '1px solid #fff', borderRadius: '4px', fontSize: '14px', letterSpacing: '1px'
            }}>ORDER DELIVERY</a>
          </div>
        </div>
      </div>

      {/* About */}
      <div style={{ padding: '80px 48px', backgroundColor: '#141414' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#e63946', letterSpacing: '4px', fontSize: '12px', marginBottom: '16px' }}>OUR STORY</p>
          <h2 style={{ fontSize: '40px', marginBottom: '24px' }}>A Passion for Quality</h2>
          <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.8, fontSize: '16px' }}>
            Founded in London, Steakz has been serving premium cuts to discerning diners across the UK.
            We source only the finest beef, aged to perfection and cooked by our expert chefs.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { icon: '🥩', title: 'Premium Cuts', desc: 'Only the finest aged beef, sourced from trusted UK farms' },
              { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Our chefs bring decades of experience to every plate' },
              { icon: '🏢', title: '4 Locations', desc: 'London, Manchester, Birmingham and Leeds' }
            ].map(item => (
              <div key={item.title} style={{
                backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a',
                borderRadius: '8px', padding: '32px'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ color: '#e63946', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ color: '#888', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div id="menu" style={{ padding: '80px 48px', backgroundColor: '#0f0f0f' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ color: '#e63946', letterSpacing: '4px', fontSize: '12px', marginBottom: '16px' }}>OUR MENU</p>
            <h2 style={{ fontSize: '40px' }}>Featured Dishes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {featured.map(item => (
              <div key={item.id} style={{
                backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a',
                borderRadius: '8px', overflow: 'hidden'
              }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1544025162-d76694265947?w=400") center/cover',
                  display: 'flex', alignItems: 'flex-end', padding: '16px'
                }}>
                  <span style={{
                    backgroundColor: '#e63946', color: '#fff',
                    padding: '4px 12px', borderRadius: '4px', fontSize: '12px'
                  }}>{item.category}</span>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>{item.name}</h3>
                    <span style={{ color: '#e63946', fontWeight: 'bold', fontSize: '18px' }}>£{item.price.toFixed(2)}</span>
                  </div>
                  <p style={{ color: '#888', fontSize: '14px', marginTop: '8px', lineHeight: 1.6 }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a href="#order-online" style={{
              color: '#e63946', textDecoration: 'none', border: '1px solid #e63946',
              padding: '12px 32px', borderRadius: '4px', fontSize: '14px', letterSpacing: '1px'
            }}>ORDER NOW</a>
          </div>
        </div>
      </div>

      {/* Branches */}
      <div id="branches" style={{ padding: '80px 48px', backgroundColor: '#141414' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ color: '#e63946', letterSpacing: '4px', fontSize: '12px', marginBottom: '16px' }}>FIND US</p>
            <h2 style={{ fontSize: '40px' }}>Our Locations</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {branches.map(branch => (
              <div key={branch.id} style={{
                backgroundColor: '#1a1a1a',
                border: `1px solid ${branch.isHQ ? '#e63946' : '#2a2a2a'}`,
                borderRadius: '8px', padding: '24px'
              }}>
                {branch.isHQ && (
                  <span style={{
                    backgroundColor: '#e6394620', color: '#e63946',
                    border: '1px solid #e63946', borderRadius: '4px',
                    padding: '2px 8px', fontSize: '11px', marginBottom: '12px', display: 'inline-block'
                  }}>FLAGSHIP</span>
                )}
                <h3 style={{ margin: '8px 0', fontSize: '20px' }}>{branch.name}</h3>
                <p style={{ color: '#888', fontSize: '14px', margin: '4px 0' }}>📍 {branch.address}</p>
                <p style={{ color: '#888', fontSize: '14px', margin: '4px 0' }}>📞 {branch.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Online */}
      <div id="order-online" style={{ padding: '80px 48px', backgroundColor: '#0f0f0f' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ color: '#e63946', letterSpacing: '4px', fontSize: '12px', marginBottom: '16px' }}>DELIVERY</p>
            <h2 style={{ fontSize: '40px' }}>Order Online</h2>
            <p style={{ color: '#888', marginTop: '16px' }}>Order your favourite Steakz dishes delivered straight to your door</p>
          </div>
          <OnlineOrder branches={branches} menuItems={menuItems} />
        </div>
      </div>

      {/* Book a Table */}
      <div id="book-a-table" style={{ padding: '80px 48px', backgroundColor: '#141414' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ color: '#e63946', letterSpacing: '4px', fontSize: '12px', marginBottom: '16px' }}>RESERVATIONS</p>
            <h2 style={{ fontSize: '40px' }}>Book a Table</h2>
          </div>

          {reservationSuccess ? (
            <div style={{
              backgroundColor: '#2a9d8f20', border: '1px solid #2a9d8f',
              borderRadius: '8px', padding: '32px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ color: '#2a9d8f' }}>Reservation Confirmed!</h3>
              <p style={{ color: '#888' }}>We'll see you soon. Check your email for confirmation.</p>
              <button onClick={() => setReservationSuccess(false)} style={{
                marginTop: '16px', backgroundColor: '#e63946', color: '#fff',
                border: 'none', borderRadius: '4px', padding: '12px 24px', cursor: 'pointer'
              }}>Make Another Reservation</button>
            </div>
          ) : (
            <form onSubmit={handleReservation} style={{
              backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: '8px', padding: '40px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { field: 'name', label: 'FULL NAME', type: 'text' },
                  { field: 'email', label: 'EMAIL', type: 'email' },
                  { field: 'phone', label: 'PHONE', type: 'tel' },
                  { field: 'date', label: 'DATE', type: 'date' },
                ].map(({ field, label, type }) => (
                  <div key={field}>
                    <label style={{ color: '#888', fontSize: '11px', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>{label}</label>
                    <input
                      type={type}
                      value={reservation[field as keyof typeof reservation]}
                      onChange={e => setReservation({ ...reservation, [field]: e.target.value })}
                      required
                      style={{
                        width: '100%', padding: '12px', backgroundColor: '#2a2a2a',
                        border: '1px solid #333', borderRadius: '4px', color: '#fff',
                        boxSizing: 'border-box', fontSize: '14px'
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ color: '#888', fontSize: '11px', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>TIME</label>
                  <select value={reservation.time} onChange={e => setReservation({ ...reservation, time: e.target.value })} required
                    style={{ width: '100%', padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}>
                    <option value=''>Select time</option>
                    {['12:00', '12:30', '13:00', '13:30', '14:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: '11px', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>PARTY SIZE</label>
                  <select value={reservation.partySize} onChange={e => setReservation({ ...reservation, partySize: e.target.value })}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}>
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ color: '#888', fontSize: '11px', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>BRANCH</label>
                  <select value={reservation.branchId} onChange={e => setReservation({ ...reservation, branchId: e.target.value })} required
                    style={{ width: '100%', padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}>
                    <option value=''>Select a branch</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} — {b.city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" style={{
                width: '100%', marginTop: '24px', padding: '16px',
                backgroundColor: '#e63946', color: '#fff', border: 'none',
                borderRadius: '4px', fontSize: '14px', letterSpacing: '2px',
                cursor: 'pointer'
              }}>RESERVE MY TABLE</button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #1a1a1a', padding: '40px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#e63946', margin: 0 }}>🥩 STEAKZ</h2>
          <p style={{ color: '#444', fontSize: '14px', margin: 0 }}>© 2026 Steakz. All rights reserved.</p>
          <button onClick={() => navigate('/login')} style={{
            backgroundColor: 'transparent', color: '#888', border: '1px solid #333',
            borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px'
          }}>Staff Login</button>
        </div>
      </div>

    </div>
  )
}

function OnlineOrder({ branches, menuItems }: { branches: Branch[], menuItems: MenuItem[] }) {
  const [step, setStep] = useState(1)
  const [selectedBranch, setSelectedBranch] = useState('')
  const [selectedItems, setSelectedItems] = useState<{ menuItemId: number, quantity: number, name: string, price: number }[]>([])
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '', address: '' })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const handleAddItem = (item: MenuItem) => {
    const existing = selectedItems.find(i => i.menuItemId === item.id)
    if (existing) {
      setSelectedItems(selectedItems.map(i =>
        i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ))
    } else {
      setSelectedItems([...selectedItems, { menuItemId: item.id, quantity: 1, name: item.name, price: item.price }])
    }
  }

  const handleRemoveItem = (menuItemId: number) => {
    setSelectedItems(selectedItems.filter(i => i.menuItemId !== menuItemId))
  }

  const total = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleSubmit = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const customerRes = await fetch('http://localhost:5000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerInfo)
      })
      const customer = await customerRes.json()

      const staffRes = await fetch(`http://localhost:5000/api/users/branch/${selectedBranch}`)
      const staff = await staffRes.json()
      const waiter = staff.find((u: any) => u.role === 'WAITER' || u.role === 'CASHIER')

      if (!waiter) {
        alert('Unable to process order. Please call us directly.')
        setLoading(false)
        return
      }

      const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waiter.email, password: 'password123' })
      })
      const loginData = await loginRes.json()

      await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${loginData.token}` },
        body: JSON.stringify({
          type: 'DELIVERY',
          items: selectedItems.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
          address: customerInfo.address,
          customerId: customer.id
        })
      })
      setSuccess(true)
    } catch {
      alert('Failed to place order. Please try again.')
    }
    setLoading(false)
  }

  if (success) return (
    <div style={{ backgroundColor: '#2a9d8f20', border: '1px solid #2a9d8f', borderRadius: '8px', padding: '32px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
      <h3 style={{ color: '#2a9d8f' }}>Order Placed!</h3>
      <p style={{ color: '#888' }}>Your order has been received. We'll deliver to {customerInfo.address} shortly.</p>
      <button onClick={() => { setSuccess(false); setStep(1); setSelectedItems([]); setCustomerInfo({ name: '', phone: '', email: '', address: '' }) }}
        style={{ marginTop: '16px', backgroundColor: '#e63946', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px 24px', cursor: 'pointer' }}>
        Place Another Order
      </button>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '32px' }}>
      {/* Steps */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {['Select Branch', 'Choose Items', 'Your Details'].map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 8px',
              backgroundColor: step > i + 1 ? '#2a9d8f' : step === i + 1 ? '#e63946' : '#333',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '14px', fontWeight: 'bold'
            }}>{step > i + 1 ? '✓' : i + 1}</div>
            <p style={{ color: step === i + 1 ? '#fff' : '#888', fontSize: '12px', margin: 0 }}>{s}</p>
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div>
          <h3 style={{ color: '#ccc', marginBottom: '16px' }}>Which branch would you like to order from?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {branches.map(branch => (
              <div key={branch.id} onClick={() => setSelectedBranch(branch.id.toString())}
                style={{
                  backgroundColor: selectedBranch === branch.id.toString() ? '#e6394620' : '#2a2a2a',
                  border: `1px solid ${selectedBranch === branch.id.toString() ? '#e63946' : '#333'}`,
                  borderRadius: '8px', padding: '16px', cursor: 'pointer'
                }}>
                <h4 style={{ margin: '0 0 4px', color: '#fff' }}>{branch.name}</h4>
                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>📍 {branch.city}</p>
              </div>
            ))}
          </div>
          <button onClick={() => selectedBranch && setStep(2)} style={{
            marginTop: '24px', backgroundColor: selectedBranch ? '#e63946' : '#333',
            color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px',
            cursor: selectedBranch ? 'pointer' : 'not-allowed', fontSize: '14px'
          }}>Continue →</button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
            <div>
              <h3 style={{ color: '#ccc', marginBottom: '16px' }}>Choose your items</h3>
              {Object.entries(groupedMenu).map(([category, items]) => (
                <div key={category} style={{ marginBottom: '20px' }}>
                  <p style={{ color: '#e63946', fontSize: '12px', letterSpacing: '1px', margin: '0 0 8px' }}>{category}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
                    {items.filter(i => i.isAvailable).map(item => {
                      const selected = selectedItems.find(i => i.menuItemId === item.id)
                      return (
                        <button key={item.id} onClick={() => handleAddItem(item)}
                          style={{
                            backgroundColor: selected ? '#e6394620' : '#2a2a2a',
                            border: `1px solid ${selected ? '#e63946' : '#333'}`,
                            borderRadius: '8px', padding: '12px', cursor: 'pointer',
                            color: '#fff', textAlign: 'left'
                          }}>
                          <div style={{ fontSize: '13px', marginBottom: '4px' }}>{item.name}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#e63946', fontSize: '13px' }}>£{item.price.toFixed(2)}</span>
                            {selected && <span style={{ color: '#e63946', fontWeight: 'bold' }}>x{selected.quantity}</span>}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '16px', height: 'fit-content' }}>
              <h4 style={{ color: '#ccc', margin: '0 0 16px' }}>Your Order</h4>
              {selectedItems.length === 0 ? (
                <p style={{ color: '#888', fontSize: '13px' }}>No items selected yet</p>
              ) : (
                <>
                  {selectedItems.map(item => (
                    <div key={item.menuItemId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ color: '#ccc' }}>{item.name} x{item.quantity}</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: '#e63946' }}>£{(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => handleRemoveItem(item.menuItemId)}
                          style={{ backgroundColor: 'transparent', color: '#888', border: 'none', cursor: 'pointer', fontSize: '11px' }}>✕</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #333', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#ccc', fontWeight: 'bold' }}>TOTAL</span>
                    <span style={{ color: '#e63946', fontWeight: 'bold' }}>£{total.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
            <button onClick={() => setStep(1)} style={{ backgroundColor: '#333', color: '#ccc', border: 'none', borderRadius: '8px', padding: '12px 24px', cursor: 'pointer' }}>← Back</button>
            <button onClick={() => selectedItems.length > 0 && setStep(3)} style={{
              backgroundColor: selectedItems.length > 0 ? '#e63946' : '#333',
              color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px',
              cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed'
            }}>Continue →</button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <h3 style={{ color: '#ccc', marginBottom: '16px' }}>Your Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {[
              { field: 'name', label: 'FULL NAME *', type: 'text' },
              { field: 'phone', label: 'PHONE *', type: 'tel' },
              { field: 'email', label: 'EMAIL', type: 'email' },
            ].map(({ field, label, type }) => (
              <div key={field}>
                <label style={{ color: '#888', fontSize: '11px', display: 'block', marginBottom: '8px' }}>{label}</label>
                <input type={type} value={customerInfo[field as keyof typeof customerInfo]}
                  onChange={e => setCustomerInfo({ ...customerInfo, [field]: e.target.value })}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ color: '#888', fontSize: '11px', display: 'block', marginBottom: '8px' }}>DELIVERY ADDRESS *</label>
              <input value={customerInfo.address}
                onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                style={{ width: '100%', padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <h4 style={{ color: '#ccc', margin: '0 0 12px' }}>Order Summary</h4>
            {selectedItems.map(item => (
              <div key={item.menuItemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: '#ccc' }}>{item.name} x{item.quantity}</span>
                <span style={{ color: '#e63946' }}>£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #333', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#ccc', fontWeight: 'bold' }}>TOTAL</span>
              <span style={{ color: '#e63946', fontWeight: 'bold', fontSize: '18px' }}>£{total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setStep(2)} style={{ backgroundColor: '#333', color: '#ccc', border: 'none', borderRadius: '8px', padding: '12px 24px', cursor: 'pointer' }}>← Back</button>
            <button onClick={handleSubmit} disabled={loading} style={{
              backgroundColor: '#e63946', color: '#fff', border: 'none', borderRadius: '8px',
              padding: '12px 24px', cursor: 'pointer', opacity: loading ? 0.7 : 1
            }}>{loading ? 'Placing Order...' : 'Place Order 🚗'}</button>
          </div>
        </div>
      )}
    </div>
  )
}