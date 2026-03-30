import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useResetPasswordMutation } from '../store/authApi'
import toast from 'react-hot-toast'

const mono = "'JetBrains Mono', monospace"

const inputSx = {
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
}

const labelSx = {
  fontSize: '9px',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#3D4A5A',
  mb: '6px',
  fontFamily: mono,
}

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const resetToken = (location.state as { resetToken?: string })?.resetToken
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!resetToken) {
      setError('Invalid reset token. Please request a new reset link.')
      return
    }
    setError('')
    try {
      await resetPassword({ token: resetToken, newPassword }).unwrap()
      toast.success('Password reset successfully')
      setSubmitted(true)
    } catch {
      setError('Failed to reset password. Please try again.')
      toast.error('Failed to reset password')
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
          Reset Password
        </Typography>

        {submitted ? (
          <Box
            sx={{
              background: '#111520',
              border: '1px solid #1A3D28',
              borderRadius: '8px',
              padding: '1.25rem',
            }}
          >
            <Typography
              sx={{
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#3D4A5A',
                mb: '8px',
                fontFamily: mono,
              }}
            >
              Status
            </Typography>
            <Typography
              sx={{
                fontSize: '12.5px',
                color: '#00C47A',
                lineHeight: 1.6,
              }}
            >
              Password reset successfully.
            </Typography>

            <Box
              component="button"
              onClick={() => navigate('/login')}
              sx={{
                mt: '1rem',
                width: '100%',
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #00C47A',
                background: '#0D1F16',
                color: '#00C47A',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: mono,
                cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { background: '#142A1E' },
              }}
            >
              Go to login
            </Box>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: '1.25rem' }}>
              <Typography sx={labelSx}>New Password</Typography>
              <Box
                component="input"
                type="password"
                required
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewPassword(e.target.value)
                  setError('')
                }}
                placeholder="Enter new password"
                sx={inputSx}
              />
            </Box>

            <Box sx={{ mb: '1.5rem' }}>
              <Typography sx={labelSx}>Confirm New Password</Typography>
              <Box
                component="input"
                type="password"
                required
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setConfirmPassword(e.target.value)
                  setError('')
                }}
                placeholder="Confirm new password"
                sx={inputSx}
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
              {isLoading ? 'Resetting...' : 'Reset password'}
            </Box>
          </Box>
        )}

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
      </Box>
    </Box>
  )
}
