import {
  Category as SpecieIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  DataUsage as UnitsIcon,
  Event as ServicePlannedIcon,
  EventAvailable as ServiceProvidedIcon,
  Folder as CaseIcon,
  MedicalServices as ServicesIcon,
  People as OwnerIcon,
  Pets as PetIcon,
  Receipt as InvoiceIcon,
  Store as FacilityIcon,
} from '@mui/icons-material';
import {
  type DrawerProps,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  styled,
  Toolbar,
} from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';

export const drawerWidth = 240;

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (propKey) =>
    !['open', 'toggleDrawer'].includes(String(propKey)),
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

function MyDrawer(props: DrawerProps & { toggleDrawer(): void }) {
  return (
    <DrawerStyled variant="permanent" {...props}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={props.toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>

      <Divider />

      <List>
        <ListItem component={RouterLink} to="">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Main" />
        </ListItem>

        <ListSubheader inset>Pets</ListSubheader>

        <ListItem component={RouterLink} to="owners">
          <ListItemIcon>
            <OwnerIcon />
          </ListItemIcon>
          <ListItemText primary="Owner" />
        </ListItem>

        <ListItem component={RouterLink} to="pets">
          <ListItemIcon>
            <PetIcon />
          </ListItemIcon>
          <ListItemText primary="Pets" />
        </ListItem>

        <ListItem component={RouterLink} to="species">
          <ListItemIcon>
            <SpecieIcon />
          </ListItemIcon>
          <ListItemText primary="Species" />
        </ListItem>

        <ListSubheader inset>Facilities and services</ListSubheader>

        <ListItem component={RouterLink} to="facilities">
          <ListItemIcon>
            <FacilityIcon />
          </ListItemIcon>
          <ListItemText primary="Facilities" />
        </ListItem>

        <ListItem component={RouterLink} to="services">
          <ListItemIcon>
            <ServicesIcon />
          </ListItemIcon>
          <ListItemText primary="Services" />
        </ListItem>

        <ListItem component={RouterLink} to="units">
          <ListItemIcon>
            <UnitsIcon />
          </ListItemIcon>
          <ListItemText primary="Units" />
        </ListItem>

        <ListSubheader inset>Cases</ListSubheader>

        <ListItem component={RouterLink} to="cases">
          <ListItemIcon>
            <CaseIcon />
          </ListItemIcon>
          <ListItemText primary="Cases" />
        </ListItem>

        <ListSubheader inset>Planed and provided</ListSubheader>

        <ListItem component={RouterLink} to="planned">
          <ListItemIcon>
            <ServicePlannedIcon />
          </ListItemIcon>
          <ListItemText primary="Services planned" />
        </ListItem>

        <ListItem component={RouterLink} to="provided">
          <ListItemIcon>
            <ServiceProvidedIcon />
          </ListItemIcon>
          <ListItemText primary="Services provided" />
        </ListItem>

        <ListItem component={RouterLink} to="invoices">
          <ListItemIcon>
            <InvoiceIcon />
          </ListItemIcon>
          <ListItemText primary="Invoices" />
        </ListItem>
      </List>
    </DrawerStyled>
  );
}

export default MyDrawer;
