import { Menu as MenuIcon } from '@mui/icons-material';
import {
  type AppBarProps,
  AppBar,
  IconButton,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';

import { drawerWidth } from './Drawer';

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (propKey) =>
    !['open', 'toggleDrawer'].includes(String(propKey)),
})<AppBarProps & { open: boolean; toggleDrawer(): void }>(
  ({ theme, open }) => ({
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
  }),
);

function MyAppBar(
  props: AppBarProps & { open: boolean; toggleDrawer(): void },
) {
  return (
    <AppBarStyled position="absolute" {...props}>
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={props.toggleDrawer}
          sx={{
            marginRight: '36px',
            ...(props.open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Simple CRUD
        </Typography>
      </Toolbar>
    </AppBarStyled>
  );
}

export default MyAppBar;
