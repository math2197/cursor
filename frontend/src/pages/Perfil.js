import React, { useRef, useState, useEffect } from 'react';
import { Avatar, Button, TextField, Typography, Box, Paper, Alert } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Perfil() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    photo: null,
    photoUrl: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/users/profile');
        setUser(u => ({ ...u, ...res.data, photoUrl: res.data.photoUrl }));
        setPhotoPreview(res.data.photoUrl ? `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${res.data.photoUrl}` : null);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Erro ao carregar perfil');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUser({ ...user, photo: file });
        setPhotoPreview(URL.createObjectURL(file));
        
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/api/users/profile/photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setPhotoPreview(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${res.data.photoUrl}`);
        setSuccess('Foto atualizada com sucesso');
      } catch (err) {
        setError('Erro ao atualizar foto');
        setPhotoPreview(user.photoUrl ? `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${user.photoUrl}` : null);
      }
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/users/profile', {
        name: user.name,
        email: user.email
      });
      setSuccess('Perfil atualizado com sucesso');
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Erro ao atualizar perfil');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>Meu Perfil</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

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
            required
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
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
          >
            Salvar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Perfil; 