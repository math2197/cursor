import React, { useState } from 'react';
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
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocs((prev) => [...prev, ...files.map(f => ({ name: f.name }))]);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f7f7fa', minHeight: '100vh' }}>
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
        </Stack>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3, boxShadow: '0 2px 12px #0001' }}>
            {/* Tabs */}
            <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Resumo" />
              <Tab label="Atividades" />
              <Tab label="Histórico" />
            </Tabs>
            {tab === 0 && (
              <Box>
                {/* Dados do Processo - coluna única, justificado */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2 }}>Dados do Processo</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Ação</Typography>
                    <Typography variant="body2" fontWeight={500}>{mockProcesso.acao}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Objeto</Typography>
                    <Typography variant="body2" fontWeight={400} sx={{ textAlign: 'justify' }}>{mockProcesso.objeto}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Número</Typography>
                    <Typography variant="body2" fontWeight={500}>{mockProcesso.numero}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Juízo</Typography>
                    <Typography variant="body2" fontWeight={500}>{mockProcesso.juizo}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Link no tribunal</Typography>
                    <Box>
                      <Link href={mockProcesso.link} target="_blank" rel="noopener" sx={{ fontWeight: 500, fontSize: 13, display: 'inline-block', mt: 0.5 }}>Acessar</Link>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Valor da causa</Typography>
                    <Typography variant="body2" fontWeight={500}>{mockProcesso.valorCausa}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Valor da condenação</Typography>
                    <Typography variant="body2" fontWeight={500}>{mockProcesso.valorCond}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Distribuído em</Typography>
                    <Typography variant="body2" fontWeight={500}>{mockProcesso.distribuido}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Criado em</Typography>
                    <Typography variant="body2" fontWeight={500}>{mockProcesso.criado}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Terceira interessada</Typography>
                    <Typography variant="body2" fontWeight={400}>{mockProcesso.terceiraInteressada}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Requerente(s)</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                      {requerentes.map((r, i) => (
                        <Chip key={i} label={r} color="primary" size="small" sx={{ borderRadius: 1, bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 600 }} />
                      ))}
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Requerido(s)</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                      {requeridos.map((r, i) => (
                        <Chip key={i} label={r} color="secondary" size="small" sx={{ borderRadius: 1, bgcolor: '#f3e5f5', color: '#7b1fa2', fontWeight: 600 }} />
                      ))}
                    </Stack>
                  </Box>
                </Box>
                {/* Cards de Resumo */}
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
                          <input type="file" hidden multiple onChange={handleUpload} />
                        </Button>
                        {docs.length > 0 && <Typography variant="caption" color="text.secondary">{docs.length} documento(s) anexado(s)</Typography>}
                      </Stack>
                      {docs.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">Nenhum documento encontrado. Adicione aqui documentos, recibos e comprovantes.</Typography>
                      ) : (
                        <Stack spacing={0.5}>
                          {docs.map((doc, i) => (
                            <Typography key={i} variant="body2" color="text.secondary">{doc.name}</Typography>
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
              </Box>
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
        <Grid item xs={12} md={4}>
          {sideCards.map((card, i) => (
            <Card key={i} sx={{ mb: 2, borderRadius: 3, boxShadow: '0 2px 12px #0001' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>{card.title}</Typography>
                <Divider sx={{ my: 1 }} />
                {card.content.split('\n').map((line, idx) => (
                  <Typography key={idx} variant="body2">{line}</Typography>
                ))}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProcessoDetalhes; 