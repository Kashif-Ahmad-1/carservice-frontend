import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Drawer,
  Typography,
  ListItemIcon,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';

// Styled components
const drawerWidth = 240;

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const ToolbarSpacer = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  borderRadius: theme.shape.borderRadius,
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textAlign: 'left',
  fontSize: '1.5rem',
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  width: '90%',
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout functionality here (e.g., clear tokens)
    localStorage.removeItem('token'); // Adjust according to your storage method

    // Show success message
    Swal.fire({
      title: 'Logged out!',
      text: 'You have successfully logged out.',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 2000, // Auto close after 2 seconds
      timerProgressBar: true,
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        // Redirect to home page after 2 seconds
        navigate('/'); // Adjust to your home route
      }
    });
  };

  return (
    <DrawerStyled variant="permanent">
      <ToolbarSpacer />
      <div>
        <SidebarTitle variant="h6">Admin Panel</SidebarTitle>
        <Divider />
        <List>
          <ListItemStyled button component={Link} to="/admin">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemStyled>
          <ListItemStyled button component={Link} to="/engineer-list">
            <ListItemIcon>
              <EngineeringIcon />
            </ListItemIcon>
            <ListItemText primary="Engineer List" />
          </ListItemStyled>
          <ListItemStyled button component={Link} to="/accountants">
            <ListItemIcon>
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Accountant List" />
          </ListItemStyled>
          <Divider />
          <ListItemStyled button component={Link} to="/service-request">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Service Requests" />
          </ListItemStyled>
          <ListItemStyled button component={Link} to="/reports">
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItemStyled>
        </List>
      </div>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <LogoutButton variant="contained" startIcon={<LogoutIcon />} onClick={handleLogout}>
          Logout
        </LogoutButton>
        <Typography variant="caption" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          © 2024 Your Company
        </Typography>
      </div>
    </DrawerStyled>
  );
};

export default Sidebar;
