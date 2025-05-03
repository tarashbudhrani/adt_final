import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';

const Supplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stockQuantity: '',
    reorderLevel: '',
  });

  const fetchSupplies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/supplies');
      const data = await response.json();
      setSupplies(data);
    } catch (error) {
      console.error('Error fetching supplies:', error);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  const handleOpen = (supply = null) => {
    if (supply) {
      setEditingSupply(supply);
      setFormData({
        name: supply.name,
        category: supply.category,
        stockQuantity: supply.stockQuantity,
        reorderLevel: supply.reorderLevel,
      });
    } else {
      setEditingSupply(null);
      setFormData({
        name: '',
        category: '',
        stockQuantity: '',
        reorderLevel: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSupply(null);
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
      const url = editingSupply
        ? `http://localhost:5000/api/supplies/${editingSupply._id}`
        : 'http://localhost:5000/api/supplies';
      const method = editingSupply ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchSupplies();
        handleClose();
      }
    } catch (error) {
      console.error('Error saving supply:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supply?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/supplies/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchSupplies();
        }
      } catch (error) {
        console.error('Error deleting supply:', error);
      }
    }
  };

  const getStockStatus = (supply) => {
    if (supply.stockQuantity <= supply.reorderLevel) {
      return 'warning';
    }
    if (supply.stockQuantity <= supply.reorderLevel * 1.5) {
      return 'info';
    }
    return 'success';
  };

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Supplies Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: 2 }}
        >
          Add Supply
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          flexGrow: 1,
          overflow: 'auto',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          borderRadius: 2
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Stock Quantity</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Reorder Level</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supplies.map((supply) => (
              <TableRow
                key={supply._id}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <TableCell>{supply.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={supply.category}
                    size="small"
                    sx={{ 
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    }}
                  />
                </TableCell>
                <TableCell align="center">{supply.stockQuantity}</TableCell>
                <TableCell align="center">{supply.reorderLevel}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={supply.stockQuantity <= supply.reorderLevel ? 'Low Stock' : 'In Stock'}
                    color={getStockStatus(supply)}
                    size="small"
                    icon={supply.stockQuantity <= supply.reorderLevel ? <WarningIcon /> : undefined}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpen(supply)} color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(supply._id)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {editingSupply ? 'Edit Supply' : 'Add New Supply'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Stock Quantity"
              name="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Reorder Level"
              name="reorderLevel"
              type="number"
              value={formData.reorderLevel}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSupply ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Supplies; 