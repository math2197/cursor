import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Avatar, Box, Menu, MenuItem, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel';
import PeopleIcon from '@mui/icons-material/People';
import LabelIcon from '@mui/icons-material/Label';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Processos', icon: <GavelIcon />, path: '/processos' },
  { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
  { text: 'Etiquetas', icon: <LabelIcon />, path: '/etiquetas' },
  { text: 'Tarefas', icon: <AssignmentIcon />, path: '/tarefas' },
  { text: 'Relatórios', icon: <BarChartIcon />, path: '/relatorios' },
  { text: 'Administração', icon: <AdminPanelSettingsIcon />, path: '/admin' },
];

function Layout({ children }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleProfile = () => {
    navigate('/perfil');
    handleMenuClose();
  };

  const handleChangePassword = () => {
    navigate('/alterar-senha');
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    handleMenuClose();
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Sistema Jurídico
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton color="inherit" onClick={handleAvatarClick}>
              <Avatar sx={{ width: 32, height: 32 }}><AccountCircleIcon /></Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleProfile}>
                <AccountCircleIcon sx={{ mr: 1 }} /> Meu Perfil
              </MenuItem>
              <MenuItem onClick={handleChangePassword}>
                <LockIcon sx={{ mr: 1 }} /> Alterar Senha
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} /> Sair
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text} onClick={() => handleMenuClick(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Layout; 