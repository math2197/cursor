import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, IconButton, Chip, Link, Stack, Tooltip, Paper, InputBase } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LabelIcon from '@mui/icons-material/Label';
import SearchIcon from '@mui/icons-material/Search';
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
  const [search, setSearch] = useState('');
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

  const filteredProcessos = processos.filter(p =>
    p.titulo.toLowerCase().includes(search.toLowerCase()) ||
    p.numero.toLowerCase().includes(search.toLowerCase()) ||
    p.cliente.toLowerCase().includes(search.toLowerCase()) ||
    p.acaoForo.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      field: 'titulo',
      headerName: 'Título',
      flex: 2,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Link
              component="button"
              variant="body1"
              underline="hover"
              sx={{ fontWeight: 600, textAlign: 'left', flex: 1, color: '#1976d2' }}
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
          <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {params.row.etiquetas && params.row.etiquetas.map((et, i) => (
              <Chip 
                key={i} 
                label={et.label} 
                color={et.color} 
                size="small" 
                sx={{ 
                  height: 20, 
                  '& .MuiChip-label': { 
                    px: 1, 
                    fontSize: '0.75rem',
                    fontWeight: 500
                  } 
                }} 
              />
            ))}
          </Box>
        </Box>
      ),
    },
    { field: 'cliente', headerName: 'Cliente', flex: 1, sortable: false },
    { field: 'acaoForo', headerName: 'Ação / Foro', flex: 1, sortable: false },
    { field: 'ultMov', headerName: 'Últ. Mov', flex: 0.7, sortable: false },
  ];

  return (
    <Box sx={{ width: '100%', bgcolor: '#f7f7fa', minHeight: '100vh', p: 0, m: 0, boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', height: 64, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff', pl: 0, pr: 2, m: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#222', ml: 0, minWidth: 260, flex: 1, textAlign: 'left' }}>Processos e casos</Typography>
        <Paper component="form" sx={{ p: '2px 8px', display: 'flex', alignItems: 'center', width: 320, mr: 2, boxShadow: 0, border: '1px solid #e0e0e0', bgcolor: '#fff' }}>
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: 15 }}
            placeholder="Digite algo para pesquisar"
            inputProps={{ 'aria-label': 'pesquisar processos' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: '6px' }} disabled>
            <SearchIcon />
          </IconButton>
        </Paper>
        <Tooltip title="Novo Processo">
          <IconButton color="primary" size="medium" onClick={handleOpen}>
            <AddIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ width: '100%', p: 0, m: 0 }}>
        <Paper elevation={0} sx={{ borderRadius: 0, border: 'none', boxShadow: 0, mt: 0, ml: 0, width: '100%', p: 0, m: 0 }}>
          <div style={{ height: 'calc(100vh - 64px - 56px)', width: '100%' }}>
            <DataGrid
              rows={filteredProcessos}
              columns={columns}
              pageSize={8}
              rowsPerPageOptions={[8, 25, 100]}
              disableSelectionOnClick
              onRowMouseEnter={(params) => setHoveredRow(params.id)}
              onRowMouseLeave={() => setHoveredRow(null)}
              onRowClick={(params) => navigate(`/processos/${params.id}`)}
              sx={{ 
                border: 0, 
                fontSize: 15, 
                background: '#fff',
                '& .MuiDataGrid-row': { 
                  minHeight: 40, 
                  maxHeight: 40,
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                },
                '& .MuiDataGrid-cell': { 
                  py: 0.2, 
                  px: 1,
                  borderBottom: '1px solid #f0f0f0',
                  overflow: 'visible',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: 1.2
                },
                '& .MuiDataGrid-columnHeaders': { 
                  bgcolor: '#fafbfc', 
                  color: '#222', 
                  fontWeight: 600, 
                  fontSize: 14,
                  borderBottom: '1px solid #e0e0e0',
                  minHeight: 40,
                  maxHeight: 40
                }
              }}
            />
          </div>
        </Paper>
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