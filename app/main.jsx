import { StrictMode } from 'react'
import { createRoot }  from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import Home        from './routes/_index.jsx'
import Collections from './routes/collections.jsx'
import Lookbook    from './routes/lookbook.jsx'
import About       from './routes/about.jsx'

import './app.css'

const router = createBrowserRouter([
  { path: '/',             element: <Home />        },
  { path: '/collections',  element: <Collections /> },
  { path: '/lookbook',     element: <Lookbook />    },
  { path: '/about',        element: <About />       },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
