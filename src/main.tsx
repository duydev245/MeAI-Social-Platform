import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import { TooltipProvider } from '@/components/ui/tooltip.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Toaster richColors theme='system' position='top-right' duration={3000} />
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
)
