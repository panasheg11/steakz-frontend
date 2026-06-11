export interface User {
  id: number
  name: string
  email: string
  role: Role
  isActive: boolean
  branchId: number | null
  branch: Branch | null
  createdAt: string
}

export interface Branch {
  id: number
  name: string
  city: string
  address: string
  phone: string
  isHQ: boolean
  createdAt: string
  _count?: {
    users: number
    orders: number
    tables: number
  }
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: MenuCategory
  isAvailable: boolean
}

export interface Order {
  id: number
  type: OrderType
  status: OrderStatus
  totalPrice: number
  address: string | null
  createdAt: string
  branch: Branch
  table: Table | null
  customer: Customer | null
  createdBy: Partial<User>
  deliveryGuy: Partial<User> | null
  items: OrderItem[]
  payment: Payment | null
}

export interface OrderItem {
  id: number
  quantity: number
  unitPrice: number
  menuItem: MenuItem
}

export interface Table {
  id: number
  number: number
  capacity: number
  isOccupied: boolean
  branchId: number
}

export interface Customer {
  id: number
  name: string
  phone: string | null
  email: string | null
  address: string | null
}

export interface Payment {
  id: number
  amount: number
  method: PaymentMethod
  paidAt: string
  processedBy: Partial<User>
}

export type Role =
  | 'ADMIN'
  | 'HQ_MANAGER'
  | 'BRANCH_MANAGER'
  | 'CHIEF'
  | 'CASHIER'
  | 'WAITER'
  | 'DELIVERY_GUY'
  | 'CUSTOMER'

export type OrderType = 'DINE_IN' | 'DELIVERY'

export type OrderStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'PAID'
  | 'CANCELLED'

export type MenuCategory = 'STARTER' | 'MAIN' | 'DESSERT' | 'DRINK'

export type PaymentMethod = 'CASH' | 'CARD'