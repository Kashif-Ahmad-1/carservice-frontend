// Sidebar.js
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
        <ListItem button component={Link} to="/mechanics">
          <ListItemText primary="Mechanic List" />
        </ListItem>
        <ListItem button component={Link} to="/accountants">
          <ListItemText primary="Accountant List" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemText primary="Service Requests" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Reports" />
        </ListItem>
      </List>
    </DrawerStyled>
  );
};

export default Sidebar;
