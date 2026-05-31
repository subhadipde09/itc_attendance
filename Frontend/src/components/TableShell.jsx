import { Box } from '@mui/material';

export default function TableShell({ children, minWidth = 760 }) {
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ minWidth }}>
        {children}
      </Box>
    </Box>
  );
}
