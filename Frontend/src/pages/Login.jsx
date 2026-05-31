import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Divider, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import BadgeOutlined from '@mui/icons-material/BadgeOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import MailOutline from '@mui/icons-material/MailOutline';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import { toast } from 'react-toastify';
import api from '../services/api';
import { setCredentials, setTotpPending } from '../redux/slices/authSlice';
import { useThemeMode } from '../context/ThemeModeContext.jsx';
import itcLogo from '../assets/ITC_Limited_Logo.svg.png';

const schema = yup.object({ email: yup.string().email().required(), password: yup.string().required() });

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      if (data.requiresTotp) {
        dispatch(setTotpPending({ tempToken: data.tempToken }));
        navigate('/verify-totp');
      } else {
        dispatch(setCredentials(data));
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: { xs: 2, md: 4 },
        py: 3,
        bgcolor: 'background.default',
        backgroundImage: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(109,183,227,0.12), rgba(104,197,178,0.08) 42%, rgba(14,23,34,0) 42%)'
          : 'linear-gradient(135deg, rgba(21,92,139,0.10), rgba(33,122,104,0.06) 42%, rgba(255,255,255,0) 42%), radial-gradient(circle at 82% 18%, rgba(184,107,0,0.10), transparent 28%)',
      }}
    >
      <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
        <IconButton
          onClick={toggleMode}
          sx={{ position: 'fixed', top: 18, right: 18, bgcolor: 'background.paper', border: 1, borderColor: 'divider', '&:hover': { bgcolor: 'background.paper' } }}
        >
          {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton>
      </Tooltip>
      <Card
        sx={{
          width: '100%',
          maxWidth: 980,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' },
          overflow: 'hidden',
          border: '1px solid rgba(225,231,238,0.95)',
        }}
      >
        <Box
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? '#08111C' : '#0B3554',
            color: 'white',
            p: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: { xs: 260, md: 540 },
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 64, height: 64, borderRadius: 1, bgcolor: 'white', display: 'grid', placeItems: 'center', p: 0.85 }}>
                <Box
                  component="img"
                  src={itcLogo}
                  alt="ITC Limited"
                  sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </Box>
              <Box>
                <Typography variant="h6">ITC Workforce Command</Typography>
                <Typography variant="body2" sx={{ opacity: 0.78 }}>Shift and attendance operations</Typography>
              </Box>
            </Stack>

            <Typography variant="h4" sx={{ mt: 5, maxWidth: 360, lineHeight: 1.12 }}>
              Smart shift control for plant teams
            </Typography>
            <Typography sx={{ mt: 2, maxWidth: 390, color: 'rgba(255,255,255,0.78)' }}>
              Monitor attendance, roster coverage, replacements, and workforce compliance from one secure console.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gap: 1.25 }}>
            {[
              ['Live Shift', 'IST aware'],
              ['Replacement Engine', 'Auto suggestions'],
              ['Admin Access', 'TOTP protected'],
            ].map(([label, value]) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.35, borderRadius: 1, border: '1px solid rgba(255,255,255,0.16)', bgcolor: 'rgba(255,255,255,0.08)' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>{label}</Typography>
                <Typography variant="body2" fontWeight={800}>{value}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 3, sm: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'background.paper' }}>
          <Chip icon={<ShieldOutlined />} label="Secure workforce access" sx={{ alignSelf: 'flex-start', mb: 2, bgcolor: 'primary.light', color: 'primary.main', fontWeight: 800 }} />
          <Typography variant="h4">Sign in</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75, mb: 3 }}>
            Use your ITC workforce credentials to continue.
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2.25 }}>
            <TextField
              label="Email address"
              autoComplete="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{ startAdornment: <InputAdornment position="start"><MailOutline fontSize="small" /></InputAdornment> }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlined fontSize="small" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={showPassword ? 'Hide password' : 'Show password'}>
                      <IconButton edge="end" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" disabled={isSubmitting} size="large" startIcon={<BadgeOutlined />} sx={{ py: 1.35, mt: 0.5 }}>
              {isSubmitting ? 'Signing in...' : 'Sign in to dashboard'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
