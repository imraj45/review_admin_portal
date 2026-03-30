import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material'
import { logout } from '../store/authSlice'
import {
  useGetReviewsQuery,
  useApproveReviewMutation,
  useRejectReviewMutation,
  useDeleteReviewMutation,
} from '../store/reviewApi'
import type { Review } from '../store/reviewApi'
import toast from 'react-hot-toast'

const mono = "'JetBrains Mono', monospace"

const statusColors: Record<string, { color: string; bg: string }> = {
  pending: { color: '#F0A500', bg: '#3D2E00' },
  approved: { color: '#00C47A', bg: '#0D1F16' },
  rejected: { color: '#FF6B6B', bg: '#1F1015' },
}

export default function ReviewsPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data: reviews = [], isLoading: reviewsLoading } = useGetReviewsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000,
  })
  const [approveReview, { isLoading: approving }] = useApproveReviewMutation()
  const [rejectReview, { isLoading: rejecting }] = useRejectReviewMutation()
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [comment, setComment] = useState('')

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, review: Review) => {
    setAnchorEl(e.currentTarget)
    setSelectedReview(review)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleView = () => {
    handleMenuClose()
    setComment('')
    setViewOpen(true)
  }

  const handleDeleteClick = () => {
    handleMenuClose()
    setDeleteOpen(true)
  }

  const handleApprove = async () => {
    if (!selectedReview) return
    try {
      await approveReview({ id: selectedReview.id, comment }).unwrap()
      toast.success('Review approved successfully')
      setViewOpen(false)
      setSelectedReview(null)
      setComment('')
    } catch {
      toast.error('Failed to approve review')
    }
  }

  const handleReject = async () => {
    if (!selectedReview) return
    try {
      await rejectReview({ id: selectedReview.id, comment }).unwrap()
      toast.success('Review rejected successfully')
      setViewOpen(false)
      setSelectedReview(null)
      setComment('')
    } catch {
      toast.error('Failed to reject review')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return
    try {
      await deleteReview(selectedReview.id).unwrap()
      toast.success('Review deleted successfully')
      setDeleteOpen(false)
      setSelectedReview(null)
    } catch {
      toast.error('Failed to delete review')
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0C0E11',
        padding: '1.5rem',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <Box
        sx={{
          background: '#0C0E11',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #1E2530',
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
        {/* Top Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: '1.5rem',
            pb: '1.25rem',
            borderBottom: '1px solid #1E2530',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box
              sx={{
                background: '#0D1F16',
                border: '1px solid #1A3D28',
                borderRadius: '8px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#00C47A',
                  boxShadow: '0 0 6px #00C47A',
                }}
              />
              <Typography
                sx={{ fontFamily: mono, fontSize: '13px', color: '#00C47A', fontWeight: 500 }}
              >
                admin-portal
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '11px', color: '#3D4A5A', fontFamily: mono }}>
              v1.0 · reviews
            </Typography>
          </Box>
          <Box
            component="button"
            onClick={() => {
              dispatch(logout())
              navigate('/login')
            }}
            sx={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #1E2530',
              background: '#111520',
              color: '#FF6B6B',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: mono,
              cursor: 'pointer',
              transition: 'all 0.15s',
              '&:hover': { borderColor: '#FF6B6B', background: '#1F1015' },
            }}
          >
            Logout
          </Box>
        </Box>

        {/* Title */}
        <Typography
          sx={{ fontSize: '20px', fontWeight: 600, color: '#C8D8E8', mb: '0.5rem' }}
        >
          All Reviews
        </Typography>
        <Typography
          sx={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#3D4A5A',
            mb: '1.25rem',
            fontFamily: mono,
          }}
        >
          // manage and moderate submitted reviews
        </Typography>

        {/* Table */}
        <Box
          sx={{
            background: '#111520',
            border: '1px solid #1E2530',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
              padding: '12px 16px',
              borderBottom: '1px solid #1E2530',
              background: '#0D1018',
            }}
          >
            {['Review ID', 'User Email', 'Platform', 'Status', 'Created At', 'Actions'].map((h) => (
              <Typography
                key={h}
                sx={{
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#3D4A5A',
                  fontFamily: mono,
                  textAlign: h === 'Actions' ? 'center' : 'left',
                }}
              >
                {h}
              </Typography>
            ))}
          </Box>

          {/* Loading */}
          {reviewsLoading && (
            <Box sx={{ padding: '2rem', textAlign: 'center' }}>
              <CircularProgress size={24} sx={{ color: '#00C47A' }} />
            </Box>
          )}

          {/* Rows */}
          {!reviewsLoading && reviews.map((review) => {
            const sc = statusColors[review.status] || statusColors.pending
            return (
              <Box
                key={review.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
                  padding: '12px 16px',
                  borderBottom: '1px solid #1E2530',
                  transition: 'background 0.15s',
                  alignItems: 'center',
                  '&:hover': { background: '#151A26' },
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: '#00C47A',
                    fontFamily: mono,
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    pr: '8px',
                  }}
                >
                  {review.id}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: '#C8D8E8',
                    fontFamily: mono,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    pr: '8px',
                  }}
                >
                  {review.userEmail}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#C8D8E8', fontFamily: mono }}>
                  {review.platformId}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: sc.bg,
                    width: 'fit-content',
                  }}
                >
                  <Typography sx={{ fontSize: '10px', color: sc.color, fontFamily: mono, fontWeight: 600, textTransform: 'uppercase' }}>
                    {review.status}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '12px', color: '#C8D8E8', fontFamily: mono }}>
                  {formatDate(review.createdAt)}
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    component="button"
                    onClick={(e: React.MouseEvent<HTMLElement>) => handleMenuOpen(e, review)}
                    sx={{
                      background: 'none',
                      border: '1px solid #1E2530',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#3D4A5A',
                      fontSize: '16px',
                      padding: '2px 8px',
                      letterSpacing: '2px',
                      lineHeight: 1,
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: '#00C47A', color: '#C8D8E8' },
                    }}
                  >
                    ···
                  </Box>
                </Box>
              </Box>
            )
          })}

          {!reviewsLoading && reviews.length === 0 && (
            <Box sx={{ padding: '2rem', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '12px', color: '#3D4A5A', fontFamily: mono }}>
                No reviews found
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              background: '#111520',
              border: '1px solid #1E2530',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              minWidth: 140,
            },
          },
        }}
      >
        <MenuItem
          onClick={handleView}
          sx={{
            fontSize: '12px',
            color: '#C8D8E8',
            fontFamily: mono,
            '&:hover': { background: '#0D1F16', color: '#00C47A' },
          }}
        >
          View
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            fontSize: '12px',
            color: '#FF6B6B',
            fontFamily: mono,
            '&:hover': { background: '#1F1015' },
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* View Dialog */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              background: '#0C0E11',
              border: '1px solid #1E2530',
              borderRadius: '12px',
              color: '#C8D8E8',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '18px',
            fontWeight: 600,
            color: '#C8D8E8',
            borderBottom: '1px solid #1E2530',
            pb: '1rem',
          }}
        >
          Review Details
        </DialogTitle>
        <DialogContent sx={{ mt: '1rem' }}>
          {selectedReview && [
            { label: 'User Email', value: selectedReview.userEmail },
            { label: 'Platform', value: selectedReview.platformId },
            { label: 'Status', value: selectedReview.status },
            { label: 'Mime Type', value: selectedReview.screenshotMimeType },
            { label: 'Created At', value: formatDate(selectedReview.createdAt) },
            { label: 'Updated At', value: formatDate(selectedReview.updatedAt) },
          ].map((field) => (
            <Box key={field.label} sx={{ mb: '1rem' }}>
              <Typography
                sx={{
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#3D4A5A',
                  mb: '4px',
                  fontFamily: mono,
                }}
              >
                {field.label}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#C8D8E8', fontFamily: mono }}>
                {field.value}
              </Typography>
            </Box>
          ))}

          {/* Screenshot */}
          {selectedReview?.screenshotData && (
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
                Screenshot
              </Typography>
              <Box
                component="img"
                src={`data:${selectedReview.screenshotMimeType};base64,${selectedReview.screenshotData}`}
                sx={{
                  maxWidth: '100%',
                  borderRadius: '8px',
                  border: '1px solid #1E2530',
                }}
              />
            </Box>
          )}

          {/* Admin Comment */}
          {selectedReview?.adminComment && (
            <Box sx={{ mb: '1rem' }}>
              <Typography
                sx={{
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#3D4A5A',
                  mb: '4px',
                  fontFamily: mono,
                }}
              >
                Admin Comment
              </Typography>
              <Box
                sx={{
                  background: '#111520',
                  border: '1px solid #1E2530',
                  borderRadius: '8px',
                  padding: '10px 12px',
                }}
              >
                <Typography
                  sx={{ fontSize: '12px', color: '#C8D8E8', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.6 }}
                >
                  {selectedReview.adminComment}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Comment input for approve/reject */}
          {selectedReview?.status === 'pending' && (
            <Box sx={{ mb: '0.5rem' }}>
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
                Comment
              </Typography>
              <Box
                component="textarea"
                value={comment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
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
                  resize: 'vertical',
                  transition: 'border-color 0.2s',
                  '&:focus': { borderColor: '#00C47A' },
                  '&::placeholder': { color: '#2A3A50' },
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '1rem 1.5rem', borderTop: '1px solid #1E2530', gap: '8px' }}>
          {selectedReview?.status === 'pending' ? (
            <>
              <Box
                component="button"
                onClick={handleReject}
                disabled={rejecting}
                sx={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: '1px solid #FF6B6B',
                  background: '#1F1015',
                  color: '#FF6B6B',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: mono,
                  cursor: rejecting ? 'not-allowed' : 'pointer',
                  opacity: rejecting ? 0.6 : 1,
                  transition: 'all 0.15s',
                  '&:hover': { background: rejecting ? '#1F1015' : '#2A1520' },
                }}
              >
                {rejecting ? 'Rejecting...' : 'Reject'}
              </Box>
              <Box
                component="button"
                onClick={handleApprove}
                disabled={approving}
                sx={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: '1px solid #00C47A',
                  background: '#0D1F16',
                  color: '#00C47A',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: mono,
                  cursor: approving ? 'not-allowed' : 'pointer',
                  opacity: approving ? 0.6 : 1,
                  transition: 'all 0.15s',
                  '&:hover': { background: approving ? '#0D1F16' : '#142A1E' },
                }}
              >
                {approving ? 'Approving...' : 'Approve'}
              </Box>
            </>
          ) : (
            <Box
              component="button"
              onClick={() => setViewOpen(false)}
              sx={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: '1px solid #1E2530',
                background: '#111520',
                color: '#C8D8E8',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: mono,
                cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { background: '#1A1F2E' },
              }}
            >
              Close
            </Box>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        slotProps={{
          paper: {
            sx: {
              background: '#0C0E11',
              border: '1px solid #1E2530',
              borderRadius: '12px',
              color: '#C8D8E8',
              minWidth: 380,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '18px',
            fontWeight: 600,
            color: '#C8D8E8',
            borderBottom: '1px solid #1E2530',
            pb: '1rem',
          }}
        >
          Delete Review
        </DialogTitle>
        <DialogContent sx={{ mt: '1rem' }}>
          <Typography
            sx={{ fontSize: '13px', color: '#C8D8E8', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Are you sure you want to delete review{' '}
            <Box component="span" sx={{ color: '#00C47A', fontFamily: mono, fontWeight: 600 }}>
              {selectedReview?.id.slice(0, 8)}...
            </Box>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '1rem 1.5rem', borderTop: '1px solid #1E2530', gap: '8px' }}>
          <Box
            component="button"
            onClick={() => setDeleteOpen(false)}
            sx={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: '1px solid #1E2530',
              background: '#111520',
              color: '#C8D8E8',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: mono,
              cursor: 'pointer',
              transition: 'all 0.15s',
              '&:hover': { background: '#1A1F2E' },
            }}
          >
            Cancel
          </Box>
          <Box
            component="button"
            onClick={handleDeleteConfirm}
            disabled={deleting}
            sx={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: '1px solid #FF6B6B',
              background: '#1F1015',
              color: '#FF6B6B',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: mono,
              cursor: deleting ? 'not-allowed' : 'pointer',
              opacity: deleting ? 0.6 : 1,
              transition: 'all 0.15s',
              '&:hover': { background: deleting ? '#1F1015' : '#2A1520' },
            }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
