import { createContext, useContext, useReducer, useCallback } from 'react'

const CartCtx = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.findIndex(i => i.id === action.item.id)
      if (existing >= 0) {
        const items = [...state.items]
        items[existing] = { ...items[existing], qty: items[existing].qty + 1 }
        return { ...state, items }
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY': {
      const items = state.items.map(i =>
        i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i
      )
      return { ...state, items }
    }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'TOGGLE_DRAWER':
      return { ...state, open: !state.open }
    case 'OPEN_DRAWER':
      return { ...state, open: true }
    case 'CLOSE_DRAWER':
      return { ...state, open: false }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [], open: false })

  const addItem    = useCallback(item => { dispatch({ type: 'ADD',    item }) }, [])
  const removeItem = useCallback(id   => { dispatch({ type: 'REMOVE', id   }) }, [])
  const updateQty  = useCallback((id, qty) => { dispatch({ type: 'UPDATE_QTY', id, qty }) }, [])
  const clearCart  = useCallback(()   => { dispatch({ type: 'CLEAR'         }) }, [])
  const toggleCart = useCallback(()   => { dispatch({ type: 'TOGGLE_DRAWER' }) }, [])
  const openCart   = useCallback(()   => { dispatch({ type: 'OPEN_DRAWER'   }) }, [])
  const closeCart  = useCallback(()   => { dispatch({ type: 'CLOSE_DRAWER'  }) }, [])

  const count = state.items.reduce((sum, i) => sum + i.qty, 0)
  const total = state.items.reduce((sum, i) => {
    const num = parseFloat(i.price.replace(/[^0-9.]/g, ''))
    return sum + (isNaN(num) ? 0 : num * i.qty)
  }, 0)

  return (
    <CartCtx.Provider value={{ items: state.items, open: state.open, count, total, addItem, removeItem, updateQty, clearCart, toggleCart, openCart, closeCart }}>
      {children}
    </CartCtx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
