import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid2 as Grid, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import TableShell from '../components/TableShell';
import { getDefaultPageSize, gridPageSizeOptions } from '../utils/gridPagination';

const initialForm = { firstName: '', lastName: '', email: '', password: '' };

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [created, setCreated] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const load = async () => {
    const { data } = await api.get('/admins');
    setAdmins(data.admins);
  };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    setPaginationModel({ page: 0, pageSize: getDefaultPageSize(admins.length) });
  }, [admins.length]);
  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/admins', form);
      setCreated(data.admin);
      setForm(initialForm);
      toast.success('Admin created');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin creation failed');
    }
  };
  const toggle = async (admin) => {
    await api.patch(`/admins/${admin._id}/status`, { isActive: !admin.isActive });
    load();
  };
  return (
    <>
      <PageHeader title="Admin Management" />
      <Card sx={{ mb: 2 }}><CardContent component="form" onSubmit={submit}>
        <Grid container spacing={2}>
          {['firstName', 'lastName', 'email', 'password'].map((field) => <Grid key={field} size={{ xs: 12, md: 2.4 }}><TextField fullWidth type={field === 'password' ? 'password' : 'text'} label={field.replace(/([A-Z])/g, ' $1')} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required /></Grid>)}
          <Grid size={{ xs: 12, md: 2.4 }}><Button type="submit" fullWidth sx={{ height: '100%' }}>Create Admin</Button></Grid>
        </Grid>
        {created?.qrCode && <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}><img src={created.qrCode} width="140" height="140" alt="TOTP QR code" /><Typography variant="body2">Manual setup key: {created.manualSetupKey}</Typography></Box>}
      </CardContent></Card>
      <Card><CardContent>
        <TableShell minWidth={900}>
        <DataGrid autoHeight rows={admins} getRowId={(row) => row._id} columns={[
          { field: 'firstName', headerName: 'Name', flex: 1, valueGetter: (_value, row) => `${row.firstName} ${row.lastName}` },
          { field: 'email', headerName: 'Email', flex: 1.4 },
          { field: 'isActive', headerName: 'Status', flex: 0.8, valueGetter: (value) => value ? 'Active' : 'Disabled' },
          { field: 'lastLogin', headerName: 'Last Login', flex: 1, valueGetter: (value) => value ? new Date(value).toLocaleString() : '-' },
          { field: 'createdAt', headerName: 'Created Date', flex: 1, valueGetter: (value) => value ? new Date(value).toLocaleDateString() : '-' },
          { field: 'actions', headerName: 'Action', flex: 1, renderCell: (params) => <Button size="small" onClick={() => toggle(params.row)}>{params.row.isActive ? 'Disable' : 'Enable'}</Button> },
        ]} pageSizeOptions={gridPageSizeOptions} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} />
        </TableShell>
      </CardContent></Card>
    </>
  );
}
