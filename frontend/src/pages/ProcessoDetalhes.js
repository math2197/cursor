import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Tabs, Tab, Paper, Grid, Card, CardContent, Divider, Link, Stack, IconButton, Tooltip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import LabelIcon from '@mui/icons-material/Label';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import ForumIcon from '@mui/icons-material/Forum';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import API_URL from '../services/api';

const mockProcesso = {
  id: 1,
  titulo: 'AJUTRA - ASSOCIACAO DOS JUÍZES DO TRABALHO X TRIBUNAL REGIONAL DO TRABALHO DA 1ª REGIÃO',
  numero: '1000023-59.2024.5.90.0000',
  pasta: 'CSJT',
  cliente: 'ASSOCIAÇÃO BRASILEIRA DOS MAGISTRADOS DO TRABALHO',
  status: 'Ativo Superior 3ª',
  responsavel: 'Rayla Castro',
  etiquetas: [
    { label: 'ABMT', color: 'warning' },
    { label: 'DRA. RAYLLA CASTRO', color: 'secondary' },
  ],
  acao: 'PEDIDO DE PROVIDÊNCIAS',
  objeto: 'Trata-se de PEDIDO DE PROVIDÊNCIAS formulado pela ASSOCIAÇÃO DOS JUÍZES DO TRABALHO...',
  juizo: 'Ministro Cláudio Mascarenhas Brandão',
  link: 'https://pje.tst.jus.br/consultaprocessual/detalhe',
  valorCausa: 'R$ 0,00',
  valorCond: 'R$ 0,00',
  distribuido: '06/08/2024',
  criado: '14/10/2024',
  terceiraInteressada: 'ASSOCIAÇÃO BRASILEIRA DOS MAGISTRADOS',
  requerente: 'AJUTRA - ASSOCIACAO DOS JUÍZES DO TRAB',
  requerido: 'TRIBUNAL REGIONAL DO TRABALHO DA 1ª RE',
  historicos: [
    { data: '11/06/2025', descricao: 'Disponibilizado (a) o(a) despacho no Diário da Justiça Eletrônico do dia 11/06/2025' },
    { data: '11/06/2025', descricao: 'Publicação do(a) despacho em 12/06/2025' },
    { data: '09/06/2025', descricao: 'Expedido(a) intimação ao TRIBUNAL REGIONAL DO TRABALHO DA 1A' },
  ],
};

const sideCards = [
  { title: 'Próximas atividades', content: 'Este processo não possui atividades pendentes.' },
  { title: 'Documentos', content: 'Nenhum documento encontrado. Adicione aqui documentos, recibos e comprovantes.' },
  { title: 'Atendimentos', content: 'Nenhum atendimento encontrado. Adicione conversas e reuniões importantes com seu cliente.' },
  { title: 'Despesas', content: 'Reembolsado: R$ 0,00\nA reembolsar: R$ 0,00\nTotal lançado: R$ 0,00' },
  { title: 'Timesheet', content: 'Faturado: R$ 0,00\nA faturar: 0min\nTotal lançado: 0min' },
];

function ProcessoDetalhes() {
  const [tab, setTab] = useState(0);
  const handleTabChange = (_e, newValue) => setTab(newValue);

  // Mock para múltiplos requerentes/requeridos
  const requerentes = [
    'AJUTRA - ASSOCIACAO DOS JUÍZES DO TRAB',
    'OUTRO REQUERENTE',
  ];
  const requeridos = [
    'TRIBUNAL REGIONAL DO TRABALHO DA 1ª RE',
    'OUTRO REQUERIDO',
  ];

  // Handlers para botões (mock)
  const handleBack = () => window.history.back();
  const handleEdit = () => alert('Editar processo');
  const handleEtiquetas = () => alert('Gerenciar etiquetas');

  // Estado para upload de documentos (mock)
  const [docs, setDocs] = useState([]);
  const processId = mockProcesso.id; // Substituir pelo id real do processo

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/documents/process/${processId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocs(res.data);
    } catch (err) {
      setDocs([]);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/api/documents/process/${processId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
    });
    fetchDocuments();
  };

  const handleDeleteProcess = async () => {
    if(window.confirm('Tem certeza que deseja excluir este processo?')) {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/processes/${processId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = '/processos';
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f7f7fa', minHeight: '100vh', width: '100%', boxSizing: 'border-box', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 1100 }}>
        {/* Header do processo */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>{mockProcesso.titulo}</Typography>
              <Stack direction="row" spacing={1}>
                {mockProcesso.etiquetas.map((et, i) => (
                  <Chip key={i} label={et.label} color={et.color} size="small" sx={{ borderRadius: 1, fontWeight: 600 }} />
                ))}
              </Stack>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Processo <b style={{ color: '#222' }}>{mockProcesso.numero}</b></Typography>
              <Typography variant="body2" color="text.secondary">Pasta <b style={{ color: '#222' }}>{mockProcesso.pasta}</b></Typography>
              <Typography variant="body2" color="text.secondary">Cliente <b style={{ color: '#222' }}>{mockProcesso.cliente}</b></Typography>
              <Typography variant="body2" color="text.secondary">Status <b style={{ color: '#1976d2' }}>{mockProcesso.status}</b></Typography>
              <Typography variant="body2" color="text.secondary">Responsável <b style={{ color: '#222' }}>{mockProcesso.responsavel}</b></Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignSelf: 'flex-start' }}>
            <Tooltip title="Voltar para Processos">
              <IconButton onClick={handleBack} sx={{ bgcolor: '#fff', border: '1px solid #e0e0e0', boxShadow: 0, width: 40, height: 40, borderRadius: '50%', '&:hover': { boxShadow: 2, bgcolor: '#f5f5f5' } }}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar Processo">
              <IconButton onClick={handleEdit} color="primary" sx={{ bgcolor: '#fff', border: '1px solid #e0e0e0', boxShadow: 0, width: 40, height: 40, borderRadius: '50%', '&:hover': { boxShadow: 2, bgcolor: '#f5f5f5' } }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Gerenciar Etiquetas">
              <IconButton onClick={handleEtiquetas} color="secondary" sx={{ bgcolor: '#fff', border: '1px solid #e0e0e0', boxShadow: 0, width: 40, height: 40, borderRadius: '50%', '&:hover': { boxShadow: 2, bgcolor: '#f5f5f5' } }}>
                <LabelIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir Processo">
              <IconButton onClick={handleDeleteProcess} color="error" sx={{ bgcolor: '#fff', border: '1px solid #e0e0e0', boxShadow: 0, width: 40, height: 40, borderRadius: '50%', '&:hover': { boxShadow: 2, bgcolor: '#f5f5f5' } }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
        <Grid container spacing={2} sx={{ width: '100%', maxWidth: '100%', margin: 0 }} alignItems="flex-start">
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3, boxShadow: '0 2px 12px #0001', width: '100%', maxWidth: '100%' }}>
              {/* Tabs */}
              <Tabs
                value={tab}
                onChange={handleTabChange}
                sx={{ mb: 2, justifyContent: 'center', display: 'flex', '& .MuiTabs-flexContainer': { justifyContent: 'center' }, '& .MuiTabs-indicator': { bgcolor: '#bdbdbd', height: 3, borderRadius: 2 }, '& .MuiTab-root': { color: '#444', fontWeight: 600, fontSize: 16, px: 3, transition: 'none', bgcolor: 'transparent', minHeight: 44 }, '& .Mui-selected': { color: '#222', bgcolor: 'transparent' }, '& .MuiTab-root:hover': { bgcolor: 'transparent', color: '#222' } }}
                centered
              >
                <Tab label="Resumo" disableRipple />
                <Tab label="Atividades" disableRipple />
                <Tab label="Histórico" disableRipple />
              </Tabs>
              {tab === 0 && (
                <Grid container spacing={2} sx={{ width: '100%', maxWidth: '100%' }} alignItems="flex-start">
                  {/* Dados do Processo - coluna única, alinhado à esquerda */}
                  <Grid item xs={12} md={8} sx={{ pr: { md: 4 }, pl: 0 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, textAlign: 'left' }}>Dados do Processo</Typography>
                    <Divider sx={{ mb: 2 }} />
                    {/* Primeira seção: Terceira interessada, Requerente(s), Requerido(s) */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>Terceira interessada</Typography>
                        <Typography variant="body2" fontWeight={400} sx={{ textAlign: 'left' }}>{mockProcesso.terceiraInteressada}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>Requerente(s)</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                          {requerentes.map((r, i) => (
                            <Chip key={i} label={r} color="primary" size="small" sx={{ borderRadius: 1, bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 600 }} />
                          ))}
                        </Stack>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>Requerido(s)</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                          {requeridos.map((r, i) => (
                            <Chip key={i} label={r} color="secondary" size="small" sx={{ borderRadius: 1, bgcolor: '#f3e5f5', color: '#7b1fa2', fontWeight: 600 }} />
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    {/* Demais campos, todos alinhados à esquerda */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>Ação</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ textAlign: 'left' }}>{mockProcesso.acao}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>Objeto</Typography>
                        <Typography variant="body2" fontWeight={400} sx={{ textAlign: 'justify' }}>{mockProcesso.objeto}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>Número</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ textAlign: 'left' }}>{mockProcesso.numero}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>Juízo</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ textAlign: 'left' }}>{mockProcesso.juizo}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>Link no tribunal</Typography>
                        <Box sx={{ textAlign: 'left' }}>
                          <Link href={mockProcesso.link} target="_blank" rel="noopener" sx={{ fontWeight: 500, fontSize: 13, display: 'inline-block', mt: 0.5, textAlign: 'left' }}>Acessar</Link>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>Valor da causa</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ textAlign: 'left' }}>{mockProcesso.valorCausa}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>Valor da condenação</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ textAlign: 'left' }}>{mockProcesso.valorCond}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>Distribuído em</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ textAlign: 'left' }}>{mockProcesso.distribuido}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>Criado em</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ textAlign: 'left' }}>{mockProcesso.criado}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  {/* Cards de Resumo à direita */}
                  <Grid item xs={12} md={4} sx={{ pl: 0 }}>
                    <Stack spacing={2}>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <EventIcon color="primary" sx={{ mr: 1 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>Próximas atividades</Typography>
                          <Typography variant="body2" color="text.secondary">Este processo não possui atividades pendentes.</Typography>
                        </Box>
                      </Paper>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>Documentos</Typography>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Button variant="outlined" size="small" startIcon={<UploadFileIcon />} component="label">
                              Anexar
                              <input type="file" hidden onChange={handleUpload} />
                            </Button>
                            {docs.length > 0 && <Typography variant="caption" color="text.secondary">{docs.length} documento(s) anexado(s)</Typography>}
                          </Stack>
                          {docs.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">Nenhum documento encontrado. Adicione aqui documentos, recibos e comprovantes.</Typography>
                          ) : (
                            <Stack spacing={0.5}>
                              {docs.map((doc, i) => (
                                <a key={i} href={`${API_URL}${doc.url}`} target="_blank" rel="noopener noreferrer">
                                  <Typography variant="body2" color="text.secondary">{doc.name}</Typography>
                                </a>
                              ))}
                            </Stack>
                          )}
                        </Box>
                      </Paper>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ForumIcon color="primary" sx={{ mr: 1 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>Atendimentos</Typography>
                          <Typography variant="body2" color="text.secondary">Nenhum atendimento encontrado. Adicione conversas e reuniões importantes com seu cliente.</Typography>
                        </Box>
                      </Paper>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ReceiptIcon color="primary" sx={{ mr: 1 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>Despesas</Typography>
                          <Typography variant="body2" color="text.secondary">Reembolsado: R$ 0,00 &nbsp;|&nbsp; A reembolsar: R$ 0,00 &nbsp;|&nbsp; Total lançado: R$ 0,00</Typography>
                        </Box>
                      </Paper>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>Timesheet</Typography>
                          <Typography variant="body2" color="text.secondary">Faturado: R$ 0,00 &nbsp;|&nbsp; A faturar: 0min &nbsp;|&nbsp; Total lançado: 0min</Typography>
                        </Box>
                      </Paper>
                    </Stack>
                  </Grid>
                </Grid>
              )}
              {tab === 2 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>Últimos históricos</Typography>
                  <Divider sx={{ mb: 2 }} />
                  {mockProcesso.historicos.map((h, i) => (
                    <Box key={i} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">{h.data}</Typography>
                      <Typography>{h.descricao}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
              {tab === 1 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>Atividades</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography color="text.secondary">Nenhuma atividade encontrada.</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ProcessoDetalhes; 