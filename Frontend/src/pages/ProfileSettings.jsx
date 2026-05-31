import { useSelector } from 'react-redux';
import { Box, Button, Card, CardContent, Chip, Divider, Grid2 as Grid, Stack, Typography } from '@mui/material';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import SecurityOutlined from '@mui/icons-material/SecurityOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import PageHeader from '../components/PageHeader';
import { useThemeMode } from '../context/ThemeModeContext.jsx';

export default function ProfileSettings() {
  const { user } = useSelector((state) => state.auth);
  const { mode, toggleMode } = useThemeMode();

  return (
    <>
      <PageHeader title="Profile Settings" />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ width: 64, height: 64, borderRadius: 1, bgcolor: 'primary.light', color: 'primary.main', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 24 }}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6">{user?.firstName} {user?.lastName}</Typography>
                  <Typography color="text.secondary" sx={{ wordBreak: 'break-word' }}>{user?.email}</Typography>
                  <Chip size="small" label={user?.role} sx={{ mt: 1, fontWeight: 800 }} />
                </Box>
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Account Status</Typography>
                  <Typography fontWeight={800}>Active</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Access Type</Typography>
                  <Typography fontWeight={800}>{user?.role === 'SUPER_ADMIN' ? 'Full platform access' : 'Operations access'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <SettingsOutlined color="primary" />
                <Typography variant="h6">Display Preferences</Typography>
              </Stack>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box>
                  <Typography fontWeight={800}>Screen Mode</Typography>
                  <Typography color="text.secondary">Current mode: {mode === 'dark' ? 'Dark' : 'Light'}</Typography>
                </Box>
                <Button onClick={toggleMode} startIcon={mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}>
                  Switch to {mode === 'dark' ? 'Light' : 'Dark'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <SecurityOutlined color="primary" />
                <Typography variant="h6">Security</Typography>
              </Stack>
              <Typography color="text.secondary">
                Super Admin accounts use password login. Admin accounts are protected with mandatory authenticator verification.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
