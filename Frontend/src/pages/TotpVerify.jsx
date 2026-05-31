import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Container, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { setCredentials } from '../redux/slices/authSlice';

export default function TotpVerify() {
  const { tempToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  if (!tempToken) return <Navigate to="/login" replace />;

  const onSubmit = async ({ token }) => {
    try {
      const { data } = await api.post('/auth/verify-totp', { tempToken, token });
      dispatch(setCredentials(data));
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', px: 2 }}>
      <Container maxWidth="xs">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>Authenticator Code</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Enter the 6 digit code from your authenticator app.</Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2 }}>
              <TextField label="6 digit OTP" inputProps={{ maxLength: 6 }} {...register('token', { required: true })} />
              <Button type="submit" disabled={isSubmitting}>Verify</Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
