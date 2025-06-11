import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel';
import PeopleIcon from '@mui/icons-material/People';
import LabelIcon from '@mui/icons-material/Label';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
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

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleProfile = () => {
    navigate('/perfil');
  };

  const handleLogout = () => {
    // Limpar token e redirecionar para login
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Sistema Jurídico
          </Typography>
          <IconButton color="inherit" onClick={handleProfile}>
            <Avatar sx={{ width: 32, height: 32 }}><AccountCircleIcon /></Avatar>
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
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