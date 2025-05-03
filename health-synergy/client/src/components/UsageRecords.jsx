import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const UsageRecords = () => {
  const [records, setRecords] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    supply_id: '',
    user_id: '',
    quantity: '',
    reason: '',
  });

  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usage-records');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const fetchSupplies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/supplies');
      const data = await response.json();
      setSupplies(data);
    } catch (error) {
      console.error('Error fetching supplies:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchSupplies();
    fetchUsers();
  }, []);

  const handleOpen = () => {
    setFormData({
      supply_id: '',
      user_id: '',
      quantity: '',
      reason: '',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/usage-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchRecords();
        handleClose();
      }
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Usage Records</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Record
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supply</TableCell>
              <TableCell>User</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record._id}>
                <TableCell>{record.supply_id?.name}</TableCell>
                <TableCell>{record.user_id?.name}</TableCell>
                <TableCell align="right">{record.quantity}</TableCell>
                <TableCell>{record.reason}</TableCell>
                <TableCell>{formatDate(record.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Usage Record</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="Supply"
              name="supply_id"
              value={formData.supply_id}
              onChange={handleChange}
              margin="normal"
            >
              {supplies.map((supply) => (
                <MenuItem key={supply._id} value={supply._id}>
                  {supply.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="User"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              margin="normal"
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsageRecords; 