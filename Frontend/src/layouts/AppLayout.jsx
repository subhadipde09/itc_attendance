import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Analytics from '@mui/icons-material/Analytics';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import Dashboard from '@mui/icons-material/Dashboard';
import Group from '@mui/icons-material/Group';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import Logout from '@mui/icons-material/Logout';
import Menu from '@mui/icons-material/Menu';
import People from '@mui/icons-material/People';
import PublishedWithChanges from '@mui/icons-material/PublishedWithChanges';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import { logout } from '../redux/slices/authSlice';
import { useThemeMode } from '../context/ThemeModeContext.jsx';
import itcLogo from '../assets/ITC_Limited_Logo.svg.png';

const drawerWidth = 260;

const navItems = [
  { label: 'Dashboard', path: '/', icon: <Dashboard /> },
  { label: 'Employees', path: '/employees', icon: <People /> },
  { label: 'Attendance', path: '/attendance', icon: <VerifiedUser /> },
  { label: 'Roster', path: '/roster', icon: <CalendarMonth /> },
  { label: 'Replacements', path: '/replacements', icon: <PublishedWithChanges /> },
  { label: 'Shift Swaps', path: '/swaps', icon: <SwapHoriz /> },
  { label: 'Analytics', path: '/analytics', icon: <Analytics /> },
  { label: 'Admin Management', path: '/admins', icon: <Group />, role: 'SUPER_ADMIN' },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: theme.palette.mode === 'dark' ? '#08111C' : '#0B3554', color: 'white', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ gap: 1.5, minHeight: 76 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: 1, bgcolor: 'white', display: 'grid', placeItems: 'center', p: 0.75 }}>
          <Box
            component="img"
            src={itcLogo}
            alt="ITC Limited"
            sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={800}>ITC Workforce</Typography>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>{user?.role}</Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.14)' }} />
      <List sx={{ px: 1.5, flex: 1 }}>
        {navItems
          .filter((item) => !item.role || item.role === user?.role)
          .map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 1,
                my: 0.5,
                color: 'rgba(255,255,255,0.82)',
                transition: 'background-color 160ms ease, color 160ms ease',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.10)' },
                '&.active': { bgcolor: 'rgba(255,255,255,0.16)', color: 'white', boxShadow: 'inset 3px 0 0 #8FD3C7' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
      </List>
      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
          <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            <IconButton
              onClick={toggleMode}
              sx={{ color: 'rgba(255,255,255,0.88)', borderRadius: 1, bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' } }}
            >
              {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile Settings">
            <IconButton
              component={NavLink}
              to="/settings"
              onClick={() => setMobileOpen(false)}
              sx={{ color: 'rgba(255,255,255,0.88)', borderRadius: 1, bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' }, '&.active': { bgcolor: 'rgba(255,255,255,0.20)', color: 'white' } }}
            >
              <SettingsOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
              sx={{ color: 'rgba(255,255,255,0.88)', borderRadius: 1, bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' } }}
            >
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` }, bgcolor: theme.palette.mode === 'dark' ? 'rgba(21,34,49,0.92)' : 'rgba(255,255,255,0.92)', color: 'text.primary', boxShadow: '0 1px 0', borderColor: 'divider', backdropFilter: 'blur(10px)' }}>
        <Toolbar sx={{ minHeight: 76 }}>
          <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2, display: { md: 'none' } }}>
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: { xs: 16, sm: 20 }, lineHeight: 1.2 }}>Smart Shift & Workforce Management</Typography>
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>{user?.firstName} {user?.lastName}</Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, border: 0 } }} open>
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: 9, minWidth: 0, bgcolor: 'background.default' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
