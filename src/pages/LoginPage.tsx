import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Box, Typography } from '@mui/material'
import { useLoginMutation } from '../store/authApi'
import { setCredentials } from '../store/authSlice'
import toast from 'react-hot-toast'

const mono = "'JetBrains Mono', monospace"

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    try {
      const result = await login({ email, password }).unwrap()
      if (result.user.role !== 'admin') {
        setError('Access denied. Only admin users can login here.')
        return
      }
      dispatch(setCredentials({ token: result.accessToken, user: result.user }))
      toast.success('Login successful')
      navigate('/reviews')
    } catch (err) {
      const apiErr = err as { data?: { message?: string } }
      const msg = apiErr.data?.message || 'Login failed. Please try again.'
      setError(msg)
      toast.error(msg)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0C0E11',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          background: '#0C0E11',
          borderRadius: '12px',
          border: '1px solid #1E2530',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,150,0.015) 2px, rgba(0,255,150,0.015) 4px)',
            pointerEvents: 'none',
            zIndex: 0,
          },
          '& *': { position: 'relative', zIndex: 1 },
        }}
      >
        <Typography
          sx={{ fontSize: '24px', fontWeight: 600, color: '#C8D8E8', mb: '0.5rem', textAlign: 'center' }}
        >
          Admin Login
        </Typography>
        <Typography
          sx={{ fontSize: '11px', color: '#3D4A5A', fontFamily: mono, mb: '1.75rem', textAlign: 'center' }}
        >
          // sniffer admin portal
        </Typography>

        <Box component="form" onSubmit={handleLogin}>
          <Box sx={{ mb: '1rem' }}>
            <Typography
              sx={{
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#3D4A5A',
                mb: '6px',
                fontFamily: mono,
              }}
            >
              Email
            </Typography>
            <Box
              component="input"
              type="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="admin@sniffer.io"
              sx={{
                width: '100%',
                background: '#111520',
                border: '1px solid #1E2530',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '13px',
                color: '#C8D8E8',
                fontFamily: "'Space Grotesk', sans-serif",
                outline: 'none',
                transition: 'border-color 0.2s',
                '&:focus': { borderColor: '#00C47A' },
                '&::placeholder': { color: '#2A3A50' },
              }}
            />
          </Box>

          <Box sx={{ mb: '0.75rem' }}>
            <Typography
              sx={{
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#3D4A5A',
                mb: '6px',
                fontFamily: mono,
              }}
            >
              Password
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="••••••••"
                sx={{
                  width: '100%',
                  background: '#111520',
                  border: '1px solid #1E2530',
                  borderRadius: '8px',
                  padding: '10px 36px 10px 12px',
                  fontSize: '13px',
                  color: '#C8D8E8',
                  fontFamily: "'Space Grotesk', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  '&:focus': { borderColor: '#00C47A' },
                  '&::placeholder': { color: '#2A3A50' },
                }}
              />
              <Box
                component="button"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                sx={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#3D4A5A',
                  padding: 0,
                  lineHeight: 1,
                  transition: 'color 0.15s',
                  '&:hover': { color: '#C8D8E8' },
                }}
              >
                {showPassword ? '\u25E1' : '\u2299'}
              </Box>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right', mb: '1.5rem' }}>
            <Box
              component={Link}
              to="/forgot-password"
              sx={{
                fontSize: '10px',
                color: '#00C47A',
                fontFamily: mono,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Forgot password?
            </Box>
          </Box>

          {error && (
            <Typography
              sx={{
                fontSize: '12px',
                color: '#FF6B6B',
                fontFamily: mono,
                mb: '1rem',
                textAlign: 'center',
              }}
            >
              {error}
            </Typography>
          )}

          <Box
            component="button"
            type="submit"
            disabled={isLoading}
            sx={{
              width: '100%',
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #00C47A',
              background: '#0D1F16',
              color: '#00C47A',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: mono,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.15s',
              '&:hover': { background: isLoading ? '#0D1F16' : '#142A1E' },
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mt: '1.25rem' }}>
          <Typography
            sx={{ fontSize: '11px', color: '#3D4A5A', fontFamily: mono }}
          >
            Don't have an account?{' '}
            <Box
              component={Link}
              to="/register"
              sx={{
                color: '#00C47A',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Register
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
