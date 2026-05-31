import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import TableShell from '../components/TableShell';
import { getDefaultPageSize, gridPageSizeOptions } from '../utils/gridPagination';

const initialForm = { employeeId: '', name: '', email: '', phone: '', team: 'Team A', shift: 'Morning', weeklyOffDay: 'Sunday' };
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const teams = ['Team A', 'Team B', 'Team C'];
const shifts = ['Morning', 'Evening', 'Night'];

export default function Employees() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editForm, setEditForm] = useState(initialForm);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [filters, setFilters] = useState({ search: '', team: '', shift: '' });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  const load = async () => {
    const { data } = await api.get('/employees', { params: { ...filters, limit: 500 } });
    setRows(data.employees);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    setPaginationModel({ page: 0, pageSize: getDefaultPageSize(rows.length) });
  }, [rows.length]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/employees', form);
      setForm(initialForm);
      toast.success('Employee added');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save employee');
    }
  };

  const openEdit = (employee) => {
    setEditingEmployee(employee);
    setEditForm({
      employeeId: employee.employeeId || '',
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      team: employee.team || 'Team A',
      shift: employee.shift || 'Morning',
      weeklyOffDay: employee.weeklyOffDay || 'Sunday',
    });
  };

  const updateEmployee = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/employees/${editingEmployee._id}`, editForm);
      setEditingEmployee(null);
      toast.success('Employee updated');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update employee');
    }
  };

  const deleteEmployee = async () => {
    try {
      await api.delete(`/employees/${deletingEmployee._id}`);
      setDeletingEmployee(null);
      toast.success('Employee deleted');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete employee');
    }
  };

  const renderEmployeeFields = (state, setState) => (
    <>
      <Grid size={{ xs: 12, md: 2 }}><TextField fullWidth label="Employee ID" value={state.employeeId} onChange={(e) => setState({ ...state, employeeId: e.target.value })} required /></Grid>
      <Grid size={{ xs: 12, md: 2 }}><TextField fullWidth label="Name" value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} required /></Grid>
      <Grid size={{ xs: 12, md: 2 }}><TextField fullWidth type="email" label="Email" value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} required /></Grid>
      <Grid size={{ xs: 12, md: 2 }}><TextField fullWidth label="Phone" value={state.phone} onChange={(e) => setState({ ...state, phone: e.target.value })} required /></Grid>
      <Grid size={{ xs: 12, md: 2 }}><TextField select fullWidth label="Team" value={state.team} onChange={(e) => setState({ ...state, team: e.target.value })}>{teams.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}</TextField></Grid>
      <Grid size={{ xs: 12, md: 2 }}><TextField select fullWidth label="Shift" value={state.shift} onChange={(e) => setState({ ...state, shift: e.target.value })}>{shifts.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}</TextField></Grid>
      <Grid size={{ xs: 12, md: 2 }}><TextField select fullWidth label="Weekly Off" value={state.weeklyOffDay} onChange={(e) => setState({ ...state, weeklyOffDay: e.target.value })}>{days.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}</TextField></Grid>
    </>
  );

  return (
    <>
      <PageHeader title="Employees" />
      <Card sx={{ mb: 2 }}><CardContent component="form" onSubmit={submit}>
        <Grid container spacing={2}>
          {renderEmployeeFields(form, setForm)}
          <Grid size={{ xs: 12, md: 2 }}><Button type="submit" fullWidth sx={{ height: '100%' }}>Add Employee</Button></Grid>
        </Grid>
      </CardContent></Card>
      <Card><CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', '& > *': { flex: { xs: '1 1 100%', sm: '0 1 auto' } } }}>
          <TextField size="small" label="Search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <TextField size="small" select label="Team" value={filters.team} onChange={(e) => setFilters({ ...filters, team: e.target.value })} sx={{ minWidth: { sm: 140 } }}><MenuItem value="">All</MenuItem>{teams.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}</TextField>
          <TextField size="small" select label="Shift" value={filters.shift} onChange={(e) => setFilters({ ...filters, shift: e.target.value })} sx={{ minWidth: { sm: 140 } }}><MenuItem value="">All</MenuItem>{shifts.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}</TextField>
          <Button onClick={load}>Apply</Button>
        </Box>
        <TableShell>
        <DataGrid autoHeight rows={rows} getRowId={(row) => row._id} columns={[
          { field: 'employeeId', headerName: 'Employee ID', flex: 1, minWidth: 130 },
          { field: 'name', headerName: 'Name', flex: 1.3, minWidth: 170 },
          { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 210 },
          { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 150 },
          { field: 'team', headerName: 'Team', flex: 0.8, minWidth: 110 },
          { field: 'shift', headerName: 'Shift', flex: 0.8, minWidth: 110 },
          { field: 'attendanceStatus', headerName: 'Attendance Status', flex: 1, minWidth: 150 },
          {
            field: 'actions',
            headerName: 'Action',
            flex: 0.8,
            minWidth: 120,
            sortable: false,
            renderCell: (params) => (
              <Stack direction="row" spacing={0.75}>
                <Tooltip title="Edit Employee">
                  <IconButton size="small" onClick={() => openEdit(params.row)}><EditOutlined fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Delete Employee">
                  <IconButton size="small" color="error" onClick={() => setDeletingEmployee(params.row)}><DeleteOutline fontSize="small" /></IconButton>
                </Tooltip>
              </Stack>
            ),
          },
        ]} pageSizeOptions={gridPageSizeOptions} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} />
        </TableShell>
      </CardContent></Card>

      <Dialog open={Boolean(editingEmployee)} onClose={() => setEditingEmployee(null)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Employee</DialogTitle>
        <Box component="form" onSubmit={updateEmployee}>
          <DialogContent>
            <Grid container spacing={2}>
              {renderEmployeeFields(editForm, setEditForm)}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setEditingEmployee(null)}>Cancel</Button>
            <Button type="submit">Update Employee</Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(deletingEmployee)} onClose={() => setDeletingEmployee(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <Typography>
            Delete {deletingEmployee?.employeeId} - {deletingEmployee?.name}? This employee will be removed from active employee lists.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeletingEmployee(null)}>Cancel</Button>
          <Button color="error" onClick={deleteEmployee}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
