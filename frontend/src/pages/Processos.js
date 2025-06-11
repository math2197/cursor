import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, IconButton, Chip, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LabelIcon from '@mui/icons-material/Label';
import { useNavigate } from 'react-router-dom';

const mockProcessos = [
  { id: 1, numero: '0001234-56.2024.8.26.0000', titulo: 'Ação de Cobrança', cliente: 'João Silva', status: 'PENDENTE', etiquetas: [{ label: 'ABMT', color: 'warning' }, { label: 'DRA. RAYLLA CASTRO', color: 'secondary' }] },
  { id: 2, numero: '0005678-90.2024.8.26.0000', titulo: 'Inventário', cliente: 'Maria Souza', status: 'EM ANDAMENTO', etiquetas: [{ label: 'FAMÍLIA', color: 'info' }] },
];

function Processos() {
  const [processos, setProcessos] = useState(mockProcessos);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ numero: '', titulo: '', cliente: '', status: '', etiquetas: [] });
  const [editId, setEditId] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const navigate = useNavigate();

  const handleOpen = () => {
    setForm({ numero: '', titulo: '', cliente: '', status: '', etiquetas: [] });
    setEditId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editId) {
      setProcessos(processos.map(p => p.id === editId ? { ...form, id: editId } : p));
    } else {
      setProcessos([...processos, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  const handleEdit = (id) => {
    const proc = processos.find(p => p.id === id);
    setForm(proc);
    setEditId(id);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setProcessos(processos.filter(p => p.id !== id));
  };

  const handleRowClick = (params) => {
    navigate(`/processos/${params.id}`);
  };

  const columns = [
    {
      field: 'titulo',
      headerName: 'Título',
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Link
            component="button"
            variant="body1"
            underline="hover"
            sx={{ fontWeight: 600, textAlign: 'left' }}
            onClick={() => navigate(`/processos/${params.row.id}`)}
          >
            {params.value}
          </Link>
          <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5 }}>
            {params.row.etiquetas && params.row.etiquetas.map((et, i) => (
              <Chip key={i} label={et.label} color={et.color} size="small" />
            ))}
          </Box>
        </Box>
      ),
    },
    { field: 'numero', headerName: 'Número', flex: 1 },
    { field: 'cliente', headerName: 'Cliente', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: hoveredRow === params.row.id ? 'flex' : 'none', gap: 1 }}>
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}><EditIcon /></IconButton>
          <IconButton color="secondary"><LabelIcon /></IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Processos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Novo Processo
        </Button>
      </Box>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={processos}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8]}
          disableSelectionOnClick
          onRowMouseEnter={(params) => setHoveredRow(params.id)}
          onRowMouseLeave={() => setHoveredRow(null)}
          onRowClick={handleRowClick}
        />
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Editar Processo' : 'Novo Processo'}</DialogTitle>
        <DialogContent>
          <TextField label="Número" name="numero" value={form.numero} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Título" name="titulo" value={form.titulo} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Cliente" name="cliente" value={form.cliente} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Status" name="status" value={form.status} onChange={handleChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Processos; 