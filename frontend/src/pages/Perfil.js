import React, { useRef, useState, useEffect } from 'react';
import { Avatar, Button, TextField, Typography, Box, Paper } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import API_URL from '../services/api';

function Perfil() {
  // Mock de dados do usuário
  const [user, setUser] = useState({
    name: 'Administrador',
    email: 'admin@admin.com',
    photo: null,
    photoUrl: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    // Buscar dados reais do usuário, incluindo foto
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(u => ({ ...u, ...res.data, photoUrl: res.data.photoUrl }));
      setPhotoPreview(res.data.photoUrl ? `${API_URL}${res.data.photoUrl}` : null);
    };
    fetchProfile();
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
      // Upload real
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/users/profile/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setPhotoPreview(`${API_URL}${res.data.photoUrl}`);
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