import { Box, Typography } from '@mui/material';

export default function PageHeader({ title, action }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
      <Typography variant="h5">{title}</Typography>
      {action && <Box sx={{ width: { xs: '100%', sm: 'auto' }, display: 'flex', gap: 1, flexWrap: 'wrap', '& > *': { flex: { xs: '1 1 160px', sm: 'initial' } } }}>{action}</Box>}
    </Box>
  );
}
