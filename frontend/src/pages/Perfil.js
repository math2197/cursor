import React, { useRef, useState } from 'react';
import { Avatar, Button, TextField, Typography, Box, Paper } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Perfil() {
  // Mock de dados do usuário
  const [user, setUser] = useState({
    name: 'Administrador',
    email: 'admin@admin.com',
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Aqui você faria a chamada para salvar os dados e a foto
    alert('Perfil atualizado! (mock)');
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto' }}>
      <Paper sx={{ p: 4, mt: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>Meu Perfil</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handlePhotoChange}
          />
          <Avatar
            src={photoPreview}
            sx={{ width: 80, height: 80, mb: 1, cursor: 'pointer' }}
            onClick={handlePhotoClick}
          >
            {!photoPreview && <AccountCircleIcon sx={{ fontSize: 60 }} />}
          </Avatar>
          <Button variant="outlined" onClick={handlePhotoClick}>Alterar Foto</Button>
        </Box>
        <form onSubmit={handleSave}>
          <TextField
            label="Nome"
            name="name"
            value={user.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Salvar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Perfil; 