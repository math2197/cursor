import React, { useState } from 'react';
import { Box, Typography, Chip, Tabs, Tab, Paper, Grid, Card, CardContent, Divider, Link, Stack } from '@mui/material';

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

  return (
    <Box sx={{ p: 3, bgcolor: '#f7f7fa', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3, boxShadow: '0 2px 12px #0001' }}>
            {/* Título e etiquetas */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>{mockProcesso.titulo}</Typography>
              <Stack direction="row" spacing={1}>
                {mockProcesso.etiquetas.map((et, i) => (
                  <Chip key={i} label={et.label} color={et.color} size="small" sx={{ borderRadius: 1, fontWeight: 600 }} />
                ))}
              </Stack>
            </Box>
            {/* Número, pasta, instância */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Nº Processo: <b style={{ color: '#222' }}>{mockProcesso.numero}</b>
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">Pasta: <b style={{ color: '#222' }}>{mockProcesso.pasta}</b></Typography>
              <Typography variant="subtitle2" color="text.secondary">Instância: <b style={{ color: '#222' }}>{mockProcesso.status}</b></Typography>
            </Box>
            {/* Requerentes e Requeridos */}
            <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Requerente(s)</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                  {requerentes.map((r, i) => (
                    <Chip key={i} label={r} color="primary" size="small" sx={{ borderRadius: 1, bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 600 }} />
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Requerido(s)</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                  {requeridos.map((r, i) => (
                    <Chip key={i} label={r} color="secondary" size="small" sx={{ borderRadius: 1, bgcolor: '#f3e5f5', color: '#7b1fa2', fontWeight: 600 }} />
                  ))}
                </Stack>
              </Box>
            </Box>
            {/* Grid de informações principais */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Cliente / Pasta</Typography>
                <Typography variant="body2" fontWeight={500}>{mockProcesso.cliente}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Responsável</Typography>
                <Typography variant="body2" fontWeight={500}>{mockProcesso.responsavel}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Ação</Typography>
                <Typography variant="body2" fontWeight={500}>{mockProcesso.acao}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Juízo</Typography>
                <Typography variant="body2" fontWeight={500}>{mockProcesso.juizo}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Link no tribunal</Typography>
                <Link href={mockProcesso.link} target="_blank" rel="noopener" sx={{ fontWeight: 500 }}>Acessar</Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Valor da causa</Typography>
                <Typography variant="body2" fontWeight={500}>{mockProcesso.valorCausa}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Valor da condenação</Typography>
                <Typography variant="body2" fontWeight={500}>{mockProcesso.valorCond}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Distribuído em</Typography>
                <Typography variant="body2" fontWeight={500}>{mockProcesso.distribuido}</Typography>
              </Grid>
            </Grid>
            {/* Objeto */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">Objeto</Typography>
              <Typography variant="body2" fontWeight={400}>{mockProcesso.objeto}</Typography>
            </Box>
            {/* Terceira interessada */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">Terceira interessada</Typography>
              <Typography variant="body2" fontWeight={400}>{mockProcesso.terceiraInteressada}</Typography>
            </Box>
          </Paper>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mb: 3 }}>
            <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Resumo" />
              <Tab label="Atividades" />
              <Tab label="Histórico" />
            </Tabs>
            {tab === 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Resumo do Processo</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2">{mockProcesso.objeto}</Typography>
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