import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Toaster } from 'react-hot-toast'
import { store } from './store'
import theme from './theme'
import router from './routes'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111520',
              color: '#C8D8E8',
              border: '1px solid #1E2530',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#00C47A', secondary: '#111520' } },
            error: { iconTheme: { primary: '#FF6B6B', secondary: '#111520' } },
          }}
        />
      </ThemeProvider>
    </Provider>
  )
}

export default App
