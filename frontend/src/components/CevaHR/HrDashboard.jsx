import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import LogoutIcon from '@mui/icons-material/Logout';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Link, Outlet, useNavigate, Route } from 'react-router-dom';
import axios from 'axios'
import http from '@config/http'
import Divider from '@mui/material/Divider'
import { useEffect } from 'react';
import Cookies from 'js-cookie';



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
  // necessary for content to be below app bar
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
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    http
      .get("/hr/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // Verificar se o cookie 'token' existe
    const token = Cookies.get('token');

    if (!token) {
      // Se o cookie 'token' não existir, navegue de volta para '/'
      navigate('/');
    } else {
      // Verificar se o token está expirado (você pode ajustar isso de acordo com sua lógica)
      const isTokenExpired = false;  // Substitua isso com a lógica real para verificar a expiração do token

      if (isTokenExpired) {
        // Se o token estiver expirado, navegue de volta para '/'
        navigate('/');
      }
    }
  }, [navigate]);

  
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
            backgroundColor: "#d3d3d3", // Defina a cor desejada aqui
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
          <Divider></Divider>
          <ListItem disablePadding sx={{ display: "block" }}>
            <Link
              to="/planning_dashboard/planning_crud"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color:'#3f3e3e'
                  }}
                >
                  <ListAltIcon />
                </ListItemIcon >
                <ListItemText
                  primary="Ativos"
                  sx={{ opacity: open ? 1 : 0 }}
                  primaryTypographyProps={{
                    style: {
                      fontWeight: "bold", // Defina a cor desejada aqui
                      color:'#3f3e3e'
                    },
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
          <Divider></Divider>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color:'#3f3e3e'
                  }}
              >
                <GroupRemoveIcon />
              </ListItemIcon>
              <ListItemText
                  primary="Desligados"
                  sx={{ opacity: open ? 1 : 0 }}
                  primaryTypographyProps={{
                    style: {
                      fontWeight: "bold", // Defina a cor desejada aqui
                      color:'#3f3e3e'
                    },
                  }}
                />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider></Divider>
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color:'#e1261c'
                  }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                  primary="Sair"
                  sx={{ opacity: open ? 1 : 0 }}
                  primaryTypographyProps={{
                    style: {
                      fontWeight: "bold", // Defina a cor desejada aqui
                      color:'#3f3e3e'
                    },
                  }}
                />
            </ListItemButton>
          </ListItem>
          <Divider></Divider>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {/* Defina suas rotas dentro do componente Outlet */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default HrDash;
