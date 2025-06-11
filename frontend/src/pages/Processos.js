import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, IconButton, Chip, Link, Stack, Tooltip, Paper, InputBase, Menu, MenuItem, Checkbox } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LabelIcon from '@mui/icons-material/Label';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';

const mockEtiquetas = [
  { label: 'ABMT', color: 'warning' },
  { label: 'DRA. RAYLLA CASTRO', color: 'secondary' },
  { label: 'FAMÍLIA', color: 'info' },
  { label: 'ARPEN - RJ', color: 'success' },
  { label: 'CARTÓRIO. RIO DE JANEIRO', color: 'warning' },
  { label: 'CORREGEDORIA', color: 'primary' },
  { label: 'DRA. TAINAH', color: 'secondary' },
  { label: 'AMAGIS-MG', color: 'info' },
  { label: 'PAD', color: 'error' },
  { label: 'REDES SOCIAIS', color: 'success' },
  { label: 'TAC', color: 'primary' },
  { label: 'TJMG', color: 'info' },
  { label: 'RECEBIDO À CORREGEDORIA', color: 'warning' },
  { label: 'TAC', color: 'primary' },
  { label: 'TJAL', color: 'info' },
  { label: 'AUDIÊNCIA 14.02.2025', color: 'success' },
];

const mockProcessos = [
  {
    id: 1,
    titulo: 'AJUTRA - ASSOCIACAO DOS JUÍZES DO TRABALHO X TRIBUNAL REGIONAL DO TRABALHO DA 1ª REGIÃO',
    numero: '1000023-59.2024.5.90.0000',
    status: 'Processo ativo',
    cliente: 'ASSOCIAÇÃO BRASILEIRA DOS MAGISTRADOS DO TRABALHO',
    pasta: 'CSJT',
    acaoForo: 'PEDIDO DE PROVIDÊNCIAS',
    acaoSub: 'Ministro Cláudio Mascarenhas Brandão',
    ultMov: '11/06/2025',
    etiquetas: [mockEtiquetas[0], mockEtiquetas[1]],
  },
  {
    id: 2,
    titulo: 'ASSOCIAÇÃO DOS REGISTRADORES DE PESSOAS NATURAIS DO ESTADO DO RIO DE JANEIRO – ARPEN-RJ X TRIBUNAL DE JUSTIÇA DO ESTADO DO RIO DE JANEIRO',
    numero: '0008227-66.2024.2.00.0000',
    status: 'Processo ativo',
    cliente: 'ASSOCIAÇÃO DOS REGISTRADORES DE PESSOAS...',
    pasta: 'CNJ',
    acaoForo: 'PEDIDO DE PROVIDÊNCIAS',
    acaoSub: 'Corregedoria',
    ultMov: '11/06/2025',
    etiquetas: [mockEtiquetas[3], mockEtiquetas[4], mockEtiquetas[5], mockEtiquetas[6]],
  },
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
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [status, setStatus] = useState('Ativos');
  const [selectionModel, setSelectionModel] = useState([]);
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
      field: 'checkbox',
      headerName: '',
      width: 48,
      sortable: false,
      renderHeader: () => <Checkbox size="small" checked={selectionModel.length === filteredProcessos.length && filteredProcessos.length > 0} indeterminate={selectionModel.length > 0 && selectionModel.length < filteredProcessos.length} />,
      renderCell: (params) => <Checkbox size="small" checked={selectionModel.includes(params.row.id)} />,
      disableColumnMenu: true,
      headerClassName: 'no-border',
    },
    {
      field: 'titulo',
      headerName: 'TÍTULO',
      flex: 2.5,
      minWidth: 320,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222', lineHeight: 1.2, flex: 1, pr: 2, fontSize: 15 }}>{params.row.titulo}</Typography>
            <Box
              sx={{
                display: hoveredRow === params.row.id ? 'flex' : 'none',
                gap: 0.5,
                ml: 1,
                alignItems: 'center',
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: '#fff',
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 500, mr: 1 }}>{params.row.status}</Typography>
            <Typography variant="caption" sx={{ color: '#bbb', fontWeight: 400, mr: 1 }}>|</Typography>
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 400, mr: 1 }}>{params.row.numero}</Typography>
            {params.row.etiquetas && params.row.etiquetas.map((et, i) => (
              <Chip
                key={i}
                label={et.label}
                color={et.color}
                size="small"
                sx={{ height: 20, fontWeight: 600, bgcolor: 'background.paper', border: '1px solid #e0e0e0', color: 'inherit', '& .MuiChip-label': { px: 1, fontSize: '0.75rem', fontWeight: 600 } }}
              />
            ))}
          </Box>
        </Box>
      ),
    },
    {
      field: 'cliente',
      headerName: 'CLIENTE / PASTA',
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#222', fontSize: 14 }}>{params.value}</Typography>
          <Typography variant="caption" sx={{ color: '#888', fontWeight: 400 }}>{params.row.pasta}</Typography>
        </Box>
      ),
    },
    {
      field: 'acaoForo',
      headerName: 'AÇÃO / FORO',
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#222', fontSize: 14 }}>{params.value}</Typography>
          <Typography variant="caption" sx={{ color: '#888', fontWeight: 400 }}>{params.row.acaoSub}</Typography>
        </Box>
      ),
    },
    {
      field: 'ultMov',
      headerName: 'ÚLT. MOV',
      flex: 0.7,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#222', fontSize: 14 }}>{params.value}</Typography>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', bgcolor: '#f7f7fa', minHeight: '100vh', p: 0, m: 0, boxSizing: 'border-box', position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 0, pt: 3, pb: 1, bgcolor: 'transparent', width: '100%' }}>
        <Tooltip title="Status dos processos">
          <IconButton
            sx={{ bgcolor: '#f7f7fa', border: '1px solid #e0e0e0', color: '#444', width: 40, height: 40, borderRadius: '50%', mr: 1, '&:hover': { boxShadow: 2, bgcolor: '#f5f5f5' } }}
            onClick={e => setStatusAnchor(e.currentTarget)}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{status}</Typography>
            <ArrowDropDownIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
          <MenuItem onClick={() => { setStatus('Ativos'); setStatusAnchor(null); }}>Ativos</MenuItem>
          <MenuItem onClick={() => { setStatus('Arquivados'); setStatusAnchor(null); }}>Arquivados</MenuItem>
        </Menu>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Imprimir">
          <IconButton sx={{ bgcolor: '#fff', border: '1px solid #e0e0e0', boxShadow: 0, width: 40, height: 40, borderRadius: '50%', ml: 0.5, '&:hover': { boxShadow: 2, bgcolor: '#f5f5f5' } }}><PrintIcon /></IconButton>
        </Tooltip>
        <Tooltip title="Exportar">
          <IconButton sx={{ bgcolor: '#fff', border: '1px solid #e0e0e0', boxShadow: 0, width: 40, height: 40, borderRadius: '50%', ml: 0.5, '&:hover': { boxShadow: 2, bgcolor: '#f5f5f5' } }}><FileDownloadIcon /></IconButton>
        </Tooltip>
        <Tooltip title="Novo Processo">
          <IconButton
            color="primary"
            size="large"
            onClick={handleOpen}
            sx={{ ml: 0.5, bgcolor: '#2196f3', color: '#fff', borderRadius: '50%', width: 44, height: 44, boxShadow: 1, border: '1.5px solid #1976d2', '&:hover': { bgcolor: '#1976d2', boxShadow: 2 } }}
          >
            <AddIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 0, pb: 1, pt: 0, fontSize: 15, color: '#666' }}>
        <Typography sx={{ fontWeight: 500, fontSize: 15, color: '#666', mr: 2 }}>
          <span style={{ fontWeight: 600 }}>{selectionModel.length > 0 ? selectionModel.length : filteredProcessos.length}</span> de 157 processos
        </Typography>
      </Box>
      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 0, mt: 0, ml: 0, width: '100%', p: 0, m: 0 }}>
        <div style={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={filteredProcessos}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8, 25, 100]}
            checkboxSelection={false}
            disableSelectionOnClick
            onRowMouseEnter={(params) => setHoveredRow(params.id)}
            onRowMouseLeave={() => setHoveredRow(null)}
            onRowClick={(params) => navigate(`/processos/${params.id}`)}
            selectionModel={selectionModel}
            onSelectionModelChange={setSelectionModel}
            sx={{
              border: 0,
              fontSize: 15,
              background: '#fff',
              width: '100%',
              '& .MuiDataGrid-row': {
                minHeight: 80,
                maxHeight: 80,
                borderBottom: '1px solid #f0f0f0',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              },
              '& .MuiDataGrid-cell': {
                py: 0.2,
                px: 1,
                borderBottom: 'none',
                overflow: 'visible',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                lineHeight: 1.2,
                maxWidth: 'initial',
              },
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#fafbfc',
                color: '#222',
                fontWeight: 700,
                fontSize: 14,
                borderBottom: '1px solid #e0e0e0',
                minHeight: 48,
                maxHeight: 48,
              },
              '& .MuiCheckbox-root': {
                p: 0.5,
              },
              '& .no-border': {
                border: 'none',
              },
            }}
          />
        </div>
      </Paper>
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