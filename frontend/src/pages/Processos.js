import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, IconButton, Chip, Link, Stack, Tooltip } from '@mui/material';
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
  { id: 1, titulo: 'Ação de Cobrança', numero: '0001234-56.2024.8.26.0000', cliente: 'João Silva', acaoForo: 'Pedido de Providências', ultMov: '11/06/2025', etiquetas: [mockEtiquetas[0], mockEtiquetas[1]] },
  { id: 2, titulo: 'Inventário', numero: '0005678-90.2024.8.26.0000', cliente: 'Maria Souza', acaoForo: 'Inventário', ultMov: '10/06/2025', etiquetas: [mockEtiquetas[2]] },
];

function Processos() {
  const [processos, setProcessos] = useState(mockProcessos);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titulo: '', numero: '', cliente: '', acaoForo: '', ultMov: '', etiquetas: [] });
  const [editId, setEditId] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [openEtiquetas, setOpenEtiquetas] = useState(false);
  const [selectedProcesso, setSelectedProcesso] = useState(null);
  const [etiquetas, setEtiquetas] = useState(mockEtiquetas);
  const [novaEtiqueta, setNovaEtiqueta] = useState({ label: '', color: 'primary' });
  const navigate = useNavigate();

  const handleOpen = () => {
    setForm({ titulo: '', numero: '', cliente: '', acaoForo: '', ultMov: '', etiquetas: [] });
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
        <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Link
              component="button"
              variant="body1"
              underline="hover"
              sx={{ fontWeight: 600, textAlign: 'left', flex: 1 }}
              onClick={() => navigate(`/processos/${params.row.id}`)}
            >
              {params.value}
            </Link>
            <Box
              sx={{
                display: hoveredRow === params.row.id ? 'flex' : 'none',
                gap: 0.5,
                ml: 1,
                alignItems: 'center',
                position: 'absolute',
                right: 0,
                top: 0,
                height: '100%',
                background: 'white',
                zIndex: 2,
              }}
            >
              <Tooltip title="Editar">
                <IconButton size="small" color="primary" onClick={e => { e.stopPropagation(); handleEdit(params.row.id); }}><EditIcon fontSize="small" /></IconButton>
              </Tooltip>
              <Tooltip title="Etiquetas">
                <IconButton size="small" color="secondary" onClick={e => { e.stopPropagation(); handleOpenEtiquetas(params.row); }}><LabelIcon fontSize="small" /></IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.2 }}>{params.row.numero}</Typography>
          <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5 }}>
            {params.row.etiquetas && params.row.etiquetas.map((et, i) => (
              <Chip key={i} label={et.label} color={et.color} size="small" />
            ))}
          </Box>
        </Box>
      ),
    },
    { field: 'cliente', headerName: 'Cliente', flex: 1 },
    { field: 'acaoForo', headerName: 'Ação / Foro', flex: 1 },
    { field: 'ultMov', headerName: 'Últ. Mov', flex: 0.7 },
  ];

  return (
    <Box sx={{ pl: 0, pr: 0, pt: 2, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1, mr: 3 }}>
        <Tooltip title="Novo Processo">
          <IconButton color="primary" size="medium" onClick={handleOpen}>
            <AddIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ ml: 3, mr: 3 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>Processos</Typography>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={processos}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8]}
            disableSelectionOnClick
            onRowMouseEnter={(params) => setHoveredRow(params.id)}
            onRowMouseLeave={() => setHoveredRow(null)}
            onRowClick={(params) => navigate(`/processos/${params.id}`)}
            sx={{ border: 0 }}
          />
        </div>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Editar Processo' : 'Novo Processo'}</DialogTitle>
        <DialogContent>
          <TextField label="Título" name="titulo" value={form.titulo} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Número" name="numero" value={form.numero} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Cliente" name="cliente" value={form.cliente} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Ação / Foro" name="acaoForo" value={form.acaoForo} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Últ. Mov" name="ultMov" value={form.ultMov} onChange={handleChange} fullWidth margin="normal" />
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