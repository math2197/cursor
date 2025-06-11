import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, IconButton, Chip, Link, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LabelIcon from '@mui/icons-material/Label';
import { useNavigate } from 'react-router-dom';

const mockEtiquetas = [
  { label: 'ABMT', color: 'warning' },
  { label: 'DRA. RAYLLA CASTRO', color: 'secondary' },
  { label: 'FAMÍLIA', color: 'info' },
];

const mockProcessos = [
  { id: 1, numero: '0001234-56.2024.8.26.0000', titulo: 'Ação de Cobrança', cliente: 'João Silva', status: 'PENDENTE', etiquetas: [mockEtiquetas[0], mockEtiquetas[1]] },
  { id: 2, numero: '0005678-90.2024.8.26.0000', titulo: 'Inventário', cliente: 'Maria Souza', status: 'EM ANDAMENTO', etiquetas: [mockEtiquetas[2]] },
];

function Processos() {
  const [processos, setProcessos] = useState(mockProcessos);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ numero: '', titulo: '', cliente: '', status: '', etiquetas: [] });
  const [editId, setEditId] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [openEtiquetas, setOpenEtiquetas] = useState(false);
  const [selectedProcesso, setSelectedProcesso] = useState(null);
  const [etiquetas, setEtiquetas] = useState(mockEtiquetas);
  const [novaEtiqueta, setNovaEtiqueta] = useState({ label: '', color: 'primary' });
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

  const handleOpenEtiquetas = (processo) => {
    setSelectedProcesso(processo);
    setOpenEtiquetas(true);
  };

  const handleCloseEtiquetas = () => {
    setOpenEtiquetas(false);
    setSelectedProcesso(null);
  };

  const handleAddEtiqueta = () => {
    if (novaEtiqueta.label && !etiquetas.find(e => e.label === novaEtiqueta.label)) {
      setEtiquetas([...etiquetas, novaEtiqueta]);
      setNovaEtiqueta({ label: '', color: 'primary' });
    }
  };

  const handleAtribuirEtiqueta = (etiqueta) => {
    setProcessos(processos.map(p =>
      p.id === selectedProcesso.id && !p.etiquetas.find(e => e.label === etiqueta.label)
        ? { ...p, etiquetas: [...p.etiquetas, etiqueta] }
        : p
    ));
  };

  const handleRemoverEtiqueta = (etiqueta) => {
    setProcessos(processos.map(p =>
      p.id === selectedProcesso.id
        ? { ...p, etiquetas: p.etiquetas.filter(e => e.label !== etiqueta.label) }
        : p
    ));
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
          <IconButton color="secondary" onClick={() => handleOpenEtiquetas(params.row)}><LabelIcon /></IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: '1100px', margin: '0 auto', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Processos</Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleOpen} sx={{ minWidth: 150, fontWeight: 600 }}>
          NOVO PROCESSO
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
      <Dialog open={openEtiquetas} onClose={handleCloseEtiquetas} maxWidth="xs" fullWidth>
        <DialogTitle>Gerenciar Etiquetas</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Atribuir etiquetas ao processo</Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }}>
            {etiquetas.map((et, i) => (
              <Chip
                key={i}
                label={et.label}
                color={et.color}
                size="small"
                onClick={() => handleAtribuirEtiqueta(et)}
                onDelete={selectedProcesso && selectedProcesso.etiquetas.find(e => e.label === et.label) ? () => handleRemoverEtiqueta(et) : undefined}
                variant={selectedProcesso && selectedProcesso.etiquetas.find(e => e.label === et.label) ? 'filled' : 'outlined'}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>Nova Etiqueta</Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <TextField
              label="Nome"
              size="small"
              value={novaEtiqueta.label}
              onChange={e => setNovaEtiqueta({ ...novaEtiqueta, label: e.target.value })}
            />
            <TextField
              label="Cor"
              size="small"
              select
              SelectProps={{ native: true }}
              value={novaEtiqueta.color}
              onChange={e => setNovaEtiqueta({ ...novaEtiqueta, color: e.target.value })}
            >
              <option value="primary">Azul</option>
              <option value="secondary">Roxo</option>
              <option value="warning">Amarelo</option>
              <option value="info">Ciano</option>
              <option value="success">Verde</option>
              <option value="error">Vermelho</option>
            </TextField>
            <Button variant="contained" size="small" onClick={handleAddEtiqueta}>Adicionar</Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEtiquetas}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Processos; 