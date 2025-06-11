import React, { useState } from 'react';
import { Autocomplete, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

// Mock de dados globais
const mockData = [
  { type: 'processo', label: 'Ação de Cobrança', id: 1 },
  { type: 'processo', label: 'Inventário', id: 2 },
  { type: 'cliente', label: 'João Silva', id: 101 },
  { type: 'cliente', label: 'Maria Souza', id: 102 },
  { type: 'tarefa', label: 'Enviar petição', id: 201 },
  { type: 'tarefa', label: 'Reunião com cliente', id: 202 },
];

function GlobalSearch() {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(mockData);
  const navigate = useNavigate();

  const handleInputChange = (event, value) => {
    setInputValue(value);
    // Filtro simples (mock)
    setOptions(
      mockData.filter((item) =>
        item.label.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSelect = (event, value) => {
    if (!value) return;
    if (value.type === 'processo') {
      navigate(`/processos/${value.id}`);
    } else if (value.type === 'cliente') {
      navigate(`/clientes/${value.id}`);
    } else if (value.type === 'tarefa') {
      navigate(`/tarefas/${value.id}`);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => option.label}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      inputValue={inputValue}
      sx={{ width: 350, background: 'white', borderRadius: 1 }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Pesquisar contato, processo ou tarefa"
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}

export default GlobalSearch; 