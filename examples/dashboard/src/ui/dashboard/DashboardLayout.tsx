import { Box, Toolbar, Container } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Copyright from '~/ui/common/Copyright';
import AppBar from '~/ui/dashboard/AppBar';
import Drawer from '~/ui/dashboard/Drawer';

function DashboardLayout() {
  const [open, setOpen] = useState(true);

  function toggleDrawer() {
    setOpen(!open);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar open={open} toggleDrawer={toggleDrawer} />

      <Drawer open={open} toggleDrawer={toggleDrawer} />

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} component="main">
          <Outlet />

          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
