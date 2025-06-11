import React, { useState } from 'react';
import { Box, Typography, Chip, Tabs, Tab, Paper, Grid, Card, CardContent, Divider, Link } from '@mui/material';

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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {mockProcesso.titulo}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        {mockProcesso.etiquetas.map((et, i) => (
          <Chip key={i} label={et.label} color={et.color} size="small" />
        ))}
      </Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Processo: <b>{mockProcesso.numero}</b> &nbsp;|&nbsp; Pasta: {mockProcesso.pasta} &nbsp;|&nbsp; Cliente: {mockProcesso.cliente} &nbsp;|&nbsp; Responsável: {mockProcesso.responsavel}
      </Typography>
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Resumo" />
        <Tab label="Atividades" />
        <Tab label="Histórico" />
      </Tabs>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {tab === 0 && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Dados do Processo</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography><b>Ação:</b> {mockProcesso.acao}</Typography>
              <Typography><b>Objeto:</b> {mockProcesso.objeto}</Typography>
              <Typography><b>Número:</b> {mockProcesso.numero}</Typography>
              <Typography><b>Juízo:</b> {mockProcesso.juizo}</Typography>
              <Typography><b>Link no tribunal:</b> <Link href={mockProcesso.link} target="_blank" rel="noopener">Acessar</Link></Typography>
              <Typography><b>Valor da causa:</b> {mockProcesso.valorCausa}</Typography>
              <Typography><b>Val. condenação:</b> {mockProcesso.valorCond}</Typography>
              <Typography><b>Distribuído em:</b> {mockProcesso.distribuido}</Typography>
              <Typography><b>Criado em:</b> {mockProcesso.criado}</Typography>
              <Typography><b>Terceira interessada:</b> {mockProcesso.terceiraInteressada}</Typography>
              <Typography><b>Requerente:</b> {mockProcesso.requerente}</Typography>
              <Typography><b>Requerido:</b> {mockProcesso.requerido}</Typography>
            </Paper>
          )}
          {tab === 2 && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Últimos históricos</Typography>
              <Divider sx={{ mb: 2 }} />
              {mockProcesso.historicos.map((h, i) => (
                <Box key={i} sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">{h.data}</Typography>
                  <Typography>{h.descricao}</Typography>
                </Box>
              ))}
            </Paper>
          )}
          {tab === 1 && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Atividades</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography color="text.secondary">Nenhuma atividade encontrada.</Typography>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {sideCards.map((card, i) => (
            <Card key={i} sx={{ mb: 2 }}>
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