import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useForgotPasswordMutation } from '../store/authApi'
import toast from 'react-hot-toast'

const mono = "'JetBrains Mono', monospace"

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    try {
      const result = await forgotPassword({ email }).unwrap()
      toast.success('Reset link sent successfully')
      navigate('/reset-password', { state: { resetToken: result.resetToken } })
      setSent(true)
    } catch {
      setError('Failed to send reset link. Please try again.')
      toast.error('Failed to send reset link')
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
          sx={{ fontSize: '24px', fontWeight: 600, color: '#C8D8E8', mb: '1.75rem', textAlign: 'center' }}
        >
          Forgot Password
        </Typography>

        {sent ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{ fontSize: '13px', color: '#00C47A', fontFamily: mono, mb: '1.5rem' }}
            >
              Reset link sent to {email}
            </Typography>
            <Box
              component={Link}
              to="/login"
              sx={{
                fontSize: '11px',
                color: '#00C47A',
                fontFamily: mono,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Back to login
            </Box>
          </Box>
        ) : (
          <>
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ mb: '1.5rem' }}>
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

              {error && (
                <Typography
                  sx={{
                    fontSize: '11px',
                    color: '#FF5C5C',
                    fontFamily: mono,
                    mb: '1rem',
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
                {isLoading ? 'Sending...' : 'Send reset link'}
              </Box>
            </Box>

            <Box
              sx={{
                mt: '1.5rem',
                pt: '1rem',
                borderTop: '1px solid #1E2530',
                textAlign: 'center',
              }}
            >
              <Box
                component={Link}
                to="/login"
                sx={{
                  fontSize: '10px',
                  color: '#00C47A',
                  fontFamily: mono,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Back to login
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
