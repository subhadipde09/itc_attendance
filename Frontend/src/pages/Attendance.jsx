import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Chip, MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import TableShell from '../components/TableShell';
import { todayKey } from '../utils/date';
import { getDefaultPageSize, gridPageSizeOptions } from '../utils/gridPagination';

export default function Attendance() {
  const [rows, setRows] = useState([]);
  const [date, setDate] = useState(todayKey());
  const [shift, setShift] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savingEmployeeId, setSavingEmployeeId] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  const applyAttendanceEntries = useCallback((currentRows, attendanceEntries = []) => {
    const statusByEmployee = new Map(
      attendanceEntries.map((entry) => [String(entry.employee?._id || entry.employee), entry.status])
    );

    return currentRows.map((row) => ({
      ...row,
      status: statusByEmployee.get(String(row._id)) || row.status || 'Absent',
    }));
  }, []);

  const loadAttendance = useCallback(async () => {
    try {
      setIsLoading(true);
      const [{ data: employeesData }, { data: attendanceData }] = await Promise.all([
        api.get('/employees', { params: { limit: 500, shift } }),
        api.get('/attendance', { params: { date } }),
      ]);

      const attendance = attendanceData.attendance?.[0];
      const baseRows = employeesData.employees.map((employee) => ({
        ...employee,
        status: date === todayKey() ? employee.attendanceStatus || 'Absent' : 'Absent',
      }));

      setRows(applyAttendanceEntries(baseRows, attendance?.entries));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Attendance load failed');
    } finally {
      setIsLoading(false);
    }
  }, [applyAttendanceEntries, date, shift]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  useEffect(() => {
    setPaginationModel({ page: 0, pageSize: getDefaultPageSize(rows.length) });
  }, [rows.length]);

  const updateStatus = useCallback(async (employeeId, status) => {
    const nextRows = rows.map((row) => (row._id === employeeId ? { ...row, status } : row));
    setRows(nextRows);
    setIsSaving(true);
    setSavingEmployeeId(employeeId);

    try {
      const { data } = await api.patch('/attendance/record', {
        date,
        entries: [{ employeeId, status }],
      });
      setRows((prev) => applyAttendanceEntries(prev, data.attendance?.entries));
      toast.success('Attendance updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Attendance update failed');
      loadAttendance();
    } finally {
      setIsSaving(false);
      setSavingEmployeeId('');
    }
  }, [applyAttendanceEntries, date, loadAttendance, rows]);

  const totals = useMemo(() => {
    const present = rows.filter((row) => row.status === 'Present').length;
    return { present, absent: rows.length - present };
  }, [rows]);

  const columns = useMemo(() => [
    { field: 'employeeId', headerName: 'Employee ID', flex: 1, minWidth: 130 },
    { field: 'name', headerName: 'Name', flex: 1.4, minWidth: 180 },
    { field: 'team', headerName: 'Team', flex: 1, minWidth: 120 },
    { field: 'shift', headerName: 'Shift', flex: 1, minWidth: 120 },
    {
      field: 'status',
      headerName: 'Attendance',
      flex: 1.35,
      minWidth: 230,
      sortable: false,
      renderCell: (params) => (
        <ToggleButtonGroup
          exclusive
          size="small"
          value={params.row.status}
          onChange={(_, value) => {
            if (value) updateStatus(params.row._id, value);
          }}
          onClick={(event) => event.stopPropagation()}
          sx={{
            height: 38,
            '& .MuiToggleButton-root': {
              minWidth: 92,
              borderRadius: 1,
              fontWeight: 800,
              textTransform: 'none',
            },
            '& .MuiToggleButton-root.Mui-selected[value="Present"]': {
              bgcolor: 'success.main',
              borderColor: 'success.main',
              color: 'success.contrastText',
              '&:hover': { bgcolor: 'success.dark' },
            },
            '& .MuiToggleButton-root.Mui-selected[value="Absent"]': {
              bgcolor: 'error.main',
              borderColor: 'error.main',
              color: 'error.contrastText',
              '&:hover': { bgcolor: 'error.dark' },
            },
          }}
        >
          <ToggleButton value="Present" disabled={isSaving || isLoading}>Present</ToggleButton>
          <ToggleButton value="Absent" disabled={isSaving || isLoading}>Absent</ToggleButton>
        </ToggleButtonGroup>
      ),
    },
  ], [isLoading, isSaving, updateStatus]);

  return (
    <>
      <PageHeader
        title="Attendance"
        action={(
          <>
            <TextField type="date" size="small" value={date} onChange={(e) => setDate(e.target.value)} />
            <TextField select size="small" label="Shift" value={shift} onChange={(e) => setShift(e.target.value)} sx={{ minWidth: 150 }}>
              <MenuItem value="">All Shifts</MenuItem>
              {['Morning', 'Evening', 'Night'].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
            </TextField>
          </>
        )}
      />
      <Card><CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={800}>Mark every employee</Typography>
            <Typography variant="body2" color="text.secondary">
              Choose Present or Absent in each row. Changes save automatically.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            {isSaving && <Chip label={savingEmployeeId ? 'Saving row...' : 'Saving...'} color="primary" variant="outlined" />}
            <Chip label={`Present: ${totals.present}`} color="success" variant="outlined" />
            <Chip label={`Absent: ${totals.absent}`} color="error" variant="outlined" />
          </Stack>
        </Stack>
        <TableShell>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          disableRowSelectionOnClick
          rowHeight={64}
          pageSizeOptions={gridPageSizeOptions}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
        </TableShell>
      </CardContent></Card>
    </>
  );
}
