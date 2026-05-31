import { useEffect, useState } from 'react';
import { Card, CardContent, Grid2 as Grid, MenuItem, TextField, Typography, useTheme } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';
import PageHeader from '../components/PageHeader';

export default function Analytics() {
  const theme = useTheme();
  const [period, setPeriod] = useState('Daily');
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/analytics/dashboard').then((res) => setData(res.data.dashboard)); }, []);
  const attendancePie = [
    { name: 'Present', value: data?.presentEmployees || 0 },
    { name: 'Absent', value: data?.absentEmployees || 0 },
  ];
  const trends = (data?.attendanceTrends || []).map((item) => ({ date: item._id.date, status: item._id.status, count: item.count }));
  const colors = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.error.main, theme.palette.warning.main];
  const tooltip = { background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary };
  return (
    <>
      <PageHeader title="Analytics" action={<TextField select size="small" label="Filter" value={period} onChange={(e) => setPeriod(e.target.value)}><MenuItem value="Daily">Daily</MenuItem><MenuItem value="Weekly">Weekly</MenuItem><MenuItem value="Monthly">Monthly</MenuItem></TextField>} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}><Card><CardContent><Typography variant="h6" sx={{ mb: 2 }}>Attendance Mix</Typography><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={attendancePie} dataKey="value" nameKey="name" outerRadius={92} label>{attendancePie.map((_, i) => <Cell key={i} fill={colors[i]} />)}</Pie><Tooltip contentStyle={tooltip} /></PieChart></ResponsiveContainer></CardContent></Card></Grid>
        <Grid size={{ xs: 12, md: 4 }}><Card><CardContent><Typography variant="h6" sx={{ mb: 2 }}>Team Performance</Typography><ResponsiveContainer width="100%" height={280}><BarChart data={data?.teamPerformance || []}><CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} /><XAxis dataKey="team" stroke={theme.palette.text.secondary} /><YAxis allowDecimals={false} stroke={theme.palette.text.secondary} /><Tooltip contentStyle={tooltip} /><Bar dataKey="present" fill={theme.palette.secondary.main} /><Bar dataKey="absent" fill={theme.palette.error.main} /></BarChart></ResponsiveContainer></CardContent></Card></Grid>
        <Grid size={{ xs: 12, md: 4 }}><Card><CardContent><Typography variant="h6" sx={{ mb: 2 }}>Replacement Trends</Typography><ResponsiveContainer width="100%" height={280}><LineChart data={data?.replacementTrend || []}><CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} /><XAxis dataKey="_id" stroke={theme.palette.text.secondary} /><YAxis allowDecimals={false} stroke={theme.palette.text.secondary} /><Tooltip contentStyle={tooltip} /><Line dataKey="count" stroke={theme.palette.primary.main} strokeWidth={3} /></LineChart></ResponsiveContainer></CardContent></Card></Grid>
        <Grid size={{ xs: 12 }}><Card><CardContent><Typography variant="h6" sx={{ mb: 2 }}>Attendance Trends</Typography><ResponsiveContainer width="100%" height={300}><BarChart data={trends}><CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} /><XAxis dataKey="date" stroke={theme.palette.text.secondary} /><YAxis allowDecimals={false} stroke={theme.palette.text.secondary} /><Tooltip contentStyle={tooltip} /><Bar dataKey="count" fill={theme.palette.primary.main} /></BarChart></ResponsiveContainer></CardContent></Card></Grid>
      </Grid>
    </>
  );
}
