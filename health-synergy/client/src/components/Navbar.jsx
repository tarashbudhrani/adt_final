import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <MedicalServicesIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Health Synergy
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/supplies">
            Supplies
          </Button>
          <Button color="inherit" component={RouterLink} to="/users">
            Users
          </Button>
          <Button color="inherit" component={RouterLink} to="/usage-records">
            Usage Records
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 