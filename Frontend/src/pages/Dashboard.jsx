import { useEffect, useState } from 'react';
import { Card, CardContent, Grid2 as Grid, Typography, useTheme } from '@mui/material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';
import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import { formatIST } from '../utils/date';

export default function Dashboard() {
  const theme = useTheme();
  const [dashboard, setDashboard] = useState(null);
  const [clock, setClock] = useState(formatIST());

  useEffect(() => {
    api.get('/analytics/dashboard').then(({ data }) => setDashboard(data.dashboard));
    const timer = setInterval(() => setClock(formatIST()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" action={<Typography fontWeight={700}>IST {clock}</Typography>} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><MetricCard label="Total Employees" value={dashboard?.totalEmployees} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><MetricCard label="Present" value={dashboard?.presentEmployees} tone="secondary" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><MetricCard label="Absent" value={dashboard?.absentEmployees} tone="error" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><MetricCard label="Understaffed" value={dashboard?.understaffedShifts?.length} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><MetricCard label="Replacements Today" value={dashboard?.replacementAssignmentsToday} /></Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card><CardContent><Typography variant="h6" sx={{ mb: 2 }}>Shift-wise Manpower</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboard?.shiftWiseManpower || []}><CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} /><XAxis dataKey="shift" stroke={theme.palette.text.secondary} /><YAxis allowDecimals={false} stroke={theme.palette.text.secondary} /><Tooltip contentStyle={{ background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }} /><Bar dataKey="count" fill={theme.palette.primary.main} /></BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card><CardContent><Typography variant="h6">Current Shift</Typography><Typography variant="h3" color="primary.main" sx={{ mt: 3 }}>{dashboard?.currentShift}</Typography><Typography color="text.secondary" sx={{ mt: 2 }}>Dashboard metrics update after attendance is saved.</Typography></CardContent></Card>
        </Grid>
      </Grid>
    </>
  );
}
