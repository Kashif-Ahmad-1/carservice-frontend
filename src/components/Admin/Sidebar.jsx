
import React from 'react';
import { List, ListItem, ListItemText, Divider, Drawer } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

// Styled components
const drawerWidth = 240;

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: theme.palette.background.paper,
  },
}));

const ToolbarSpacer = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Sidebar = () => {
  return (
    <DrawerStyled variant="permanent">
      <ToolbarSpacer />
      <List>
        <ListItem button component={Link} to="/engineer-list">
          <ListItemText primary="Engineer List" />
        </ListItem>
        <ListItem button component={Link} to="/accountants">
          <ListItemText primary="Accountant List" />
        </ListItem>
      </List>
      <Divider />
      
        <ListItem button component={Link} to="/service-request">
          <ListItemText primary="Service Requests" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Reports" />
        </ListItem>
    
    </DrawerStyled>
  );
};

export default Sidebar;
