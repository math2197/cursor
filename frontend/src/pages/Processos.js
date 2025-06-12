import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, IconButton, Chip, Link, Stack, Tooltip, Paper, InputBase, Menu, MenuItem, Checkbox, Tabs, Tab, Autocomplete, InputAdornment } from '@mui/material';
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
import axios from 'axios';
import API_URL from '../services/api';

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
  const [processos, setProcessos] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    number: '', 
    clientId: '', 
    status: 'Ativo',
    description: '',
    requerente: '',
    requerido: ''
  });
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
  const [tabStatus, setTabStatus] = useState(0);
  const [etiquetaFiltro, setEtiquetaFiltro] = useState([]);
  const navigate = useNavigate();

  const fetchProcessos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/processes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProcessos(response.data);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
    }
  };

  useEffect(() => {
    fetchProcessos();
  }, []);

  const handleOpen = () => {
    setForm({ 
      title: '', 
      number: '', 
      clientId: '', 
      status: 'Ativo',
      description: '',
      requerente: '',
      requerido: ''
    });
    setEditId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editId) {
        await axios.put(`${API_URL}/api/processes/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/api/processes`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchProcessos();
      setOpen(false);
    } catch (error) {
      console.error('Erro ao salvar processo:', error);
    }
  };

  const handleEdit = (id) => {
    const proc = processos.find(p => p.id === id);
    setForm({
      title: proc.title,
      number: proc.number,
      clientId: proc.clientId,
      status: proc.status,
      description: proc.description,
      requerente: proc.requerente,
      requerido: proc.requerido
    });
    setEditId(id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este processo?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/processes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProcessos();
      } catch (error) {
        console.error('Erro ao deletar processo:', error);
      }
    }
  };

  const handleRowClick = (processo) => {
    navigate(`/processos/${processo.id}`);
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

  const filteredProcessos = processos.filter(p => {
    const statusMatch = tabStatus === 0 ? p.status === 'Processo ativo' : p.status !== 'Processo ativo';
    const searchMatch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.number?.toLowerCase().includes(search.toLowerCase()) ||
      p.client?.name?.toLowerCase().includes(search.toLowerCase());
    const etiquetasMatch = etiquetaFiltro.length === 0 || etiquetaFiltro.every(fil => p.etiquetas.some(et => et.label === fil.label));
    return statusMatch && searchMatch && etiquetasMatch;
  });

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
      field: 'title',
      headerName: 'TÍTULO',
      flex: 2.5,
      minWidth: 320,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222', lineHeight: 1.2, flex: 1, pr: 2, fontSize: 15 }}>{params.row.title}</Typography>
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
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 400, mr: 1 }}>{params.row.number}</Typography>
            {params.row.etiquetas && params.row.etiquetas.map((et, i) => (
              <Chip
                key={i}
                label={et.label}
                color={et.color}
                size="small"
                sx={{ height: 20, fontWeight: 600, bgcolor: 'background.paper', border: '1px solid #e0e0e0', color: 'inherit', borderRadius: 1, '& .MuiChip-label': { px: 1, fontSize: '0.75rem', fontWeight: 600 } }}
              />
            ))}
          </Box>
        </Box>
      ),
    },
    {
      field: 'client',
      headerName: 'CLIENTE / PASTA',
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#222', fontSize: 14 }}>{params.value?.name}</Typography>
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
    {
      field: 'acoes',
      headerName: '',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
          <Tooltip title="Editar Processo">
            <IconButton size="small" color="primary" onClick={e => { e.stopPropagation(); handleEdit(params.row.id); }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Gerenciar Etiquetas">
            <IconButton size="small" color="secondary" onClick={e => { e.stopPropagation(); handleOpenEtiquetas(params.row); }}>
              <LabelIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir Processo">
            <IconButton size="small" color="error" onClick={e => { e.stopPropagation(); handleDelete(params.row.id); }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        px: 2,
        pt: 2
      }}>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Processos
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {selectedProcesso && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ 
                minWidth: 'auto',
                px: 2,
                '& .MuiButton-startIcon': {
                  mr: 0.5
                }
              }}
            >
              Excluir
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{ 
              minWidth: 'auto',
              px: 2,
              '& .MuiButton-startIcon': {
                mr: 0.5
              }
            }}
          >
            Novo Processo
          </Button>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        p: 2, 
        flex: 1,
        minHeight: 0
      }}>
        <Paper 
          elevation={0} 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Lista de Processos
            </Typography>
            <TextField
              size="small"
              placeholder="Buscar processos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
          </Box>

          <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Número</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Último Movimento</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell width={100}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProcessos.map((processo) => (
                  <TableRow 
                    key={processo.id}
                    hover
                    selected={selectedProcesso?.id === processo.id}
                    onClick={() => handleRowClick(processo)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{processo.number}</TableCell>
                    <TableCell>{processo.client?.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={processo.status} 
                        size="small"
                        color={getStatusColor(processo.status)}
                      />
                    </TableCell>
                    <TableCell>{processo.ultMov}</TableCell>
                    <TableCell>{processo.ultMov}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(processo.id);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEtiquetas(processo);
                          }}
                        >
                          <LabelIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editId ? 'Editar Processo' : 'Novo Processo'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Pasta" name="pasta" value={form.pasta || ''} onChange={handleChange} fullWidth size="small" />
            <Autocomplete
              multiple
              options={['ASSOCIAÇÃO BRASILEIRA DOS MAGISTRADOS DO TRABALHO']}
              value={form.clientes || []}
              onChange={(_e, value) => setForm(f => ({ ...f, clientes: value }))}
              renderInput={params => <TextField {...params} label="Clientes" size="small" required />}
              sx={{ mb: 1 }}
            />
            <Stack direction="row" spacing={2}>
              <Autocomplete
                multiple
                options={['AJUTRA - ASSOCIACAO DOS JUÍZES DO TRABALHO', 'TRIBUNAL REGIONAL DO TRABALHO DA 1ª REGIÃO - TRT 1']}
                value={form.terceiros || []}
                onChange={(_e, value) => setForm(f => ({ ...f, terceiros: value }))}
                renderInput={params => <TextField {...params} label="Outros envolvidos" size="small" />}
                sx={{ flex: 2 }}
              />
              <Autocomplete
                options={['Requerente', 'Requerido', 'Terceira interessada']}
                value={form.terceiroTipo || ''}
                onChange={(_e, value) => setForm(f => ({ ...f, terceiroTipo: value }))}
                renderInput={params => <TextField {...params} label="Tipo" size="small" />}
                sx={{ flex: 1 }}
              />
            </Stack>
            <TextField label="Título" name="titulo" value={form.titulo || ''} onChange={handleChange} fullWidth size="small" required />
            <Autocomplete
              multiple
              options={etiquetas}
              getOptionLabel={option => option.label}
              value={form.etiquetas || []}
              onChange={(_e, value) => setForm(f => ({ ...f, etiquetas: value }))}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.label}
                    color={option.color}
                    size="small"
                    {...getTagProps({ index })}
                    sx={{ height: 22, fontWeight: 600, bgcolor: 'background.paper', border: '1px solid #e0e0e0', color: 'inherit', borderRadius: 1, '& .MuiChip-label': { px: 1, fontSize: '0.75rem', fontWeight: 600 } }}
                  />
                ))
              }
              renderInput={params => <TextField {...params} label="Etiqueta" size="small" />}
              sx={{ mb: 1 }}
            />
            <Stack direction="row" spacing={2}>
              <TextField label="Instância" name="instancia" value={form.instancia || ''} onChange={handleChange} size="small" sx={{ flex: 1 }} />
              <TextField label="Número" name="numero" value={form.numero || ''} onChange={handleChange} size="small" sx={{ flex: 2 }} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField label="Juízo" name="juizo" value={form.juizo || ''} onChange={handleChange} size="small" sx={{ flex: 2 }} />
              <TextField label="Foro" name="foro" value={form.foro || ''} onChange={handleChange} size="small" sx={{ flex: 1 }} />
            </Stack>
            <TextField label="Ação" name="acaoForo" value={form.acaoForo || ''} onChange={handleChange} fullWidth size="small" />
            <TextField label="Link no tribunal" name="link" value={form.link || ''} onChange={handleChange} fullWidth size="small" />
            <TextField label="Objeto" name="objeto" value={form.objeto || ''} onChange={handleChange} fullWidth multiline minRows={3} size="small" />
            <Stack direction="row" spacing={2}>
              <TextField label="Valor da causa" name="valorCausa" value={form.valorCausa || ''} onChange={handleChange} size="small" sx={{ flex: 1 }} />
              <TextField label="Distribuído em" name="distribuido" value={form.distribuido || ''} onChange={handleChange} size="small" sx={{ flex: 1 }} type="date" InputLabelProps={{ shrink: true }} />
            </Stack>
            <TextField label="Valor da condenação" name="valorCond" value={form.valorCond || ''} onChange={handleChange} size="small" />
            <TextField label="Observações" name="observacoes" value={form.observacoes || ''} onChange={handleChange} fullWidth multiline minRows={2} size="small" />
            <TextField label="Responsável" name="responsavel" value={form.responsavel || ''} onChange={handleChange} size="small" required />
          </Box>
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
                sx={{ height: 20, fontWeight: 600, bgcolor: 'background.paper', border: '1px solid #e0e0e0', color: 'inherit', borderRadius: 1, '& .MuiChip-label': { px: 1, fontSize: '0.75rem', fontWeight: 600 } }}
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