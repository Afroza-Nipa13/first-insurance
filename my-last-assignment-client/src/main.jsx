import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import { router } from './routes/router.jsx'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './Provider/AuthProvider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'aos/dist/aos.css';
import { HelmetProvider } from 'react-helmet-async'



const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider> 
    <div className='font-playfair mx-auto'>
      
      <RouterProvider router={router} />

    </div>
    <Toaster position='top-right' reverseOrder={false} />
    </HelmetProvider> 
    </AuthProvider>
   </QueryClientProvider>
  </StrictMode>,
)
