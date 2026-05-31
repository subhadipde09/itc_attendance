import { Box, Card, CardContent, Typography } from '@mui/material';

export default function MetricCard({ label, value, tone = 'primary' }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h4" color={`${tone}.main`} sx={{ mt: 1 }}>{value ?? 0}</Typography>
        </Box>
        <Box sx={{ width: 44, height: 44, borderRadius: 1, bgcolor: `${tone}.light`, display: { xs: 'none', sm: 'block' } }} />
      </CardContent>
    </Card>
  );
}
