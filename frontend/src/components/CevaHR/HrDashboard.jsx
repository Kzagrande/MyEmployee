import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  GroupRemove as GroupRemoveIcon,
  Logout as LogoutIcon,
  ListAlt as ListAltIcon,
  AddCircle as AddCircleIcon
} from '@mui/icons-material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import http from '@config/http';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const HrDash = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    http.get("/hr/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token ) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Verifica se há um token no localStorage
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const employee_id = decoded.employee_id;
    // console.log('employee_id',employee_id)
  }, []); 


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ backgroundColor: "#d3d3d3" }}>
          <IconButton
            color="#3f3e3e"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              color:'#3f3e3e',
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ color: "#3f3e3e", fontWeight: "bold" }}
          >
            CEVA ERP SYSTEM
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          boxShadow:
            "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
        }}
        variant="permanent"
        open={open}
        PaperProps={{
          style: {
            backgroundColor: "#d3d3d3",
          },
        }}
      >
        <DrawerHeader sx={{ backgroundColor: "#d3d3d3" }}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List>
          <Divider />
          {renderListItem('/hr_dashboard/hr_crud', 'Ativos', <ListAltIcon />)}
          <Divider />
          {renderListItem('/hr_dashboard/hr_dismissal', 'Desligados', <GroupRemoveIcon />)}
          {renderListItem('/hr_dashboard/hr_register', 'Registrar', <AddCircleIcon />)}
        </List>
        <Divider />
        <List>
          {renderListItem(null, 'Sair', <LogoutIcon />, handleLogout)}
          <Divider />
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

const renderListItem = (to, primary, icon, onClick) => {
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      {to ? (
        <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
          <ListItemButton sx={{ minHeight: 48, justifyContent: "initial", px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: "center" }}>
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={primary}
              sx={{ opacity: 1 }}
              primaryTypographyProps={{ style: { fontWeight: "bold", color:'#3f3e3e' }}}
            />
          </ListItemButton>
        </Link>
      ) : (
        <ListItemButton onClick={onClick} sx={{ minHeight: 48, justifyContent: "initial", px: 2.5 }}>
          <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: "center", color:'#e1261c' }}>
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={primary}
            sx={{ opacity: 1 }}
            primaryTypographyProps={{ style: { fontWeight: "bold", color:'#3f3e3e' }}}
          />
        </ListItemButton>
      )}
    </ListItem>
  );
};

export default HrDash;
