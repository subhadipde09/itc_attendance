import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import TableShell from '../components/TableShell';
import { getDefaultPageSize, gridPageSizeOptions } from '../utils/gridPagination';

export default function Replacements() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const load = async () => {
    const { data } = await api.get('/replacements/suggestions');
    setRows(data.suggestions.map((row, index) => ({ ...row, id: index })));
  };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    setPaginationModel({ page: 0, pageSize: getDefaultPageSize(rows.length) });
  }, [rows.length]);
  const assign = async (row) => {
    if (!row.suggestedReplacement) return toast.error('No eligible replacement found');
    await api.post('/replacements/assign', {
      absentEmployeeId: row.absentEmployee._id,
      replacementEmployeeId: row.suggestedReplacement._id,
      date: row.date,
    });
    toast.success('Replacement assigned');
    load();
  };
  return (
    <>
      <PageHeader title="Replacements" action={<Button onClick={load}>Refresh Suggestions</Button>} />
      <Card><CardContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>Suggestions are created from the latest saved attendance.</Typography>
        <TableShell minWidth={720}>
        <DataGrid autoHeight rows={rows} columns={[
          { field: 'absentEmployee', headerName: 'Absent Employee', flex: 1.4, valueGetter: (value) => value?.name },
          { field: 'suggestedReplacement', headerName: 'Suggested Replacement', flex: 1.4, valueGetter: (value) => value?.name || 'No eligible employee' },
          { field: 'shift', headerName: 'Shift', flex: 1 },
          { field: 'actions', headerName: 'Action', flex: 1, renderCell: (params) => <Button size="small" onClick={() => assign(params.row)}>Assign Replacement</Button> },
        ]} pageSizeOptions={gridPageSizeOptions} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} />
        </TableShell>
      </CardContent></Card>
    </>
  );
}
