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
import GlobalSearch from './GlobalSearch';

const drawerWidth = 240;
const appBarHeight = 64;

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
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #e0e0e0',
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            bgcolor: '#fff',
          },
        }}
        PaperProps={{ elevation: 0 }}
      >
        <Toolbar sx={{ minHeight: appBarHeight }} />
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
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          left: `${drawerWidth}px`,
          width: `calc(100% - ${drawerWidth}px)`,
          height: appBarHeight,
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
          bgcolor: '#1976d2',
        }}
      >
        <Toolbar sx={{ minHeight: appBarHeight, px: 2 }}>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, color: '#fff', fontWeight: 600 }}>
            Sistema Jurídico
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <GlobalSearch />
          </Box>
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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`,
          mt: `${appBarHeight}px`,
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: `calc(100vh - ${appBarHeight}px)`,
          bgcolor: '#f7f7fa',
          p: 0,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout; 