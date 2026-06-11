import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Branches from './pages/Branches'
import Users from './pages/Users'
import Menu from './pages/Menu'
import Orders from './pages/Orders'
import Payments from './pages/Payments'
import Home from './pages/Home'
import Reservations from './pages/Reservations'

const ProtectedRoute = ({ children, roles }: { children: JSX.Element, roles?: string[] }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div style={{ color: '#fff', padding: '20px' }}>Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />
  return children
}

function AppRoutes() {
  const { isLoading } = useAuth()
  
  if (isLoading) return <div style={{ 
    minHeight: '100vh', 
    backgroundColor: '#0f0f0f', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: '#e63946',
    fontSize: '24px'
  }}>🥩 Loading...</div>

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/branches" element={<ProtectedRoute roles={['ADMIN', 'HQ_MANAGER']}><Branches /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute roles={['ADMIN', 'HQ_MANAGER', 'BRANCH_MANAGER']}><Users /></ProtectedRoute>} />
      <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute roles={['ADMIN', 'HQ_MANAGER', 'BRANCH_MANAGER', 'CASHIER']}><Payments /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/reservations" element={<ProtectedRoute roles={['ADMIN', 'HQ_MANAGER', 'BRANCH_MANAGER']}><Reservations /></ProtectedRoute>} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App