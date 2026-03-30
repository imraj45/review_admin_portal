import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0C0E11',
      paper: '#111520',
    },
    primary: {
      main: '#00C47A',
    },
    text: {
      primary: '#C8D8E8',
      secondary: '#3D4A5A',
    },
    divider: '#1E2530',
  },
  typography: {
    fontFamily: "'Space Grotesk', sans-serif",
  },
})

export default theme
