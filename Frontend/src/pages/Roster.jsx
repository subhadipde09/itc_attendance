import { useEffect, useState } from 'react';
import { Button, Card, CardContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import TableShell from '../components/TableShell';
import { getDefaultPageSize, gridPageSizeOptions } from '../utils/gridPagination';

export default function Roster() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const load = async () => {
    const { data } = await api.get('/roster');
    setRows(data.roster);
  };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    setPaginationModel({ page: 0, pageSize: getDefaultPageSize(rows.length) });
  }, [rows.length]);
  const generate = async () => {
    await api.post('/roster/generate', {});
    toast.success('4 week roster generated');
    load();
  };
  return (
    <>
      <PageHeader title="Roster" action={<><Button onClick={generate}>Generate Roster</Button><Button variant="outlined" onClick={() => window.print()}>Export PDF</Button></>} />
      <Card><CardContent>
        <TableShell minWidth={680}>
        <DataGrid autoHeight rows={rows} getRowId={(row) => row._id} columns={[
          { field: 'cycleStartDate', headerName: 'Cycle Start', flex: 1 },
          { field: 'weekNumber', headerName: 'Week', flex: 0.7 },
          { field: 'team', headerName: 'Team', flex: 1 },
          { field: 'shift', headerName: 'Shift', flex: 1 },
          { field: 'weeklyOffDay', headerName: 'Weekly Off', flex: 1 },
        ]} pageSizeOptions={gridPageSizeOptions} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} />
        </TableShell>
      </CardContent></Card>
    </>
  );
}
