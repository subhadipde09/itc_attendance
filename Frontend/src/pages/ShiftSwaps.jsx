import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Grid2 as Grid, MenuItem, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import TableShell from '../components/TableShell';
import { todayKey } from '../utils/date';
import { getDefaultPageSize, gridPageSizeOptions } from '../utils/gridPagination';

export default function ShiftSwaps() {
  const [employees, setEmployees] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [form, setForm] = useState({ date: todayKey(), employeeAId: '', employeeBId: '' });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const load = async () => {
    const [employeeRes, swapRes] = await Promise.all([api.get('/employees', { params: { limit: 200 } }), api.get('/swaps/history')]);
    setEmployees(employeeRes.data.employees);
    setSwaps(swapRes.data.swaps);
  };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    setPaginationModel({ page: 0, pageSize: getDefaultPageSize(swaps.length) });
  }, [swaps.length]);
  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/swaps/create', form);
      toast.success('Shift swap completed');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Swap failed');
    }
  };
  return (
    <>
      <PageHeader title="Shift Swaps" />
      <Card sx={{ mb: 2 }}><CardContent component="form" onSubmit={submit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth type="date" label="Date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Grid>
          {['employeeAId', 'employeeBId'].map((field, index) => <Grid key={field} size={{ xs: 12, md: 3 }}><TextField select fullWidth label={`Employee ${index + 1}`} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}>{employees.map((employee) => <MenuItem key={employee._id} value={employee._id}>{employee.employeeId} - {employee.name}</MenuItem>)}</TextField></Grid>)}
          <Grid size={{ xs: 12, md: 3 }}><Button type="submit" fullWidth sx={{ height: '100%' }}>Create Swap</Button></Grid>
        </Grid>
      </CardContent></Card>
      <Card><CardContent>
        <TableShell>
        <DataGrid autoHeight rows={swaps} getRowId={(row) => row._id} columns={[
          { field: 'date', headerName: 'Date', flex: 1 },
          { field: 'employeeA', headerName: 'Employee A', flex: 1.4, valueGetter: (value) => value?.name },
          { field: 'employeeB', headerName: 'Employee B', flex: 1.4, valueGetter: (value) => value?.name },
          { field: 'fromShift', headerName: 'From Shift', flex: 1 },
          { field: 'toShift', headerName: 'To Shift', flex: 1 },
        ]} pageSizeOptions={gridPageSizeOptions} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} />
        </TableShell>
      </CardContent></Card>
    </>
  );
}
