import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { Link } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Box,
  IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const columns = [
  { id: 'menu_name', label: 'Menu Name', minWidth: 170 },
  {
    id: 'menu_price',
    label: 'Price',
    minWidth: 100,
    align: 'right',
    format: (value) => {
      const num = Number(value);
      return isNaN(num) ? 'N/A' : `₱${num.toFixed(2)}`;
    }
  },
  { 
    id: 'created_at', 
    label: 'Created At', 
    minWidth: 170,
    format: (value) => value ? new Date(value).toLocaleString() : 'N/A'
  },
  { 
    id: 'updated_at', 
    label: 'Updated At', 
    minWidth: 170,
    format: (value) => value ? new Date(value).toLocaleString() : 'N/A'
  },
  { 
    id: 'actions', 
    label: 'Actions', 
    minWidth: 120, 
    align: 'center'
  }
];

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/menu');
      if (!response.ok) throw new Error('Failed to fetch menu');
      const data = await response.json();
      setMenu(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://localhost:8000/api/menu/${editingId}`
        : 'http://localhost:8000/api/menu';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menu_name: menuName,
          menu_price: parseFloat(menuPrice),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMenuName('');
        setMenuPrice('');
        setEditingId(null);
        fetchMenu();
      } else {
        throw new Error(result.message || 'Something went wrong');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error saving menu:', error);
    }
  };

  const handleEdit = (menuItem) => {
    setMenuName(menuItem.menu_name);
    setMenuPrice(menuItem.menu_price);
    setEditingId(menuItem.menu_id);
  };

  const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this item?')) return;
  
  try {
    const response = await fetch(`http://localhost:8000/api/menu/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Delete failed');
    }

    // Refresh the menu list
    fetchMenu();
    
  } catch (error) {
    console.error('Delete error:', error);
    setError(error.message || 'Failed to delete menu item');
  }
};

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Topbar />
      <Button 
        component={Link} 
        to="/sales" 
        variant="contained" 
        sx={{ mb: 2 }}
      >
        Go to Sales
      </Button>
      <Button component={Link} to="/analytics" variant="contained">
        View Analytics
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
        </Typography>
        <Box component="form" onSubmit={handleAddMenu} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Menu Name"
            variant="outlined"
            fullWidth
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            required
          />
          <TextField
            label="Price"
            variant="outlined"
            type="number"
            fullWidth
            value={menuPrice}
            onChange={(e) => setMenuPrice(e.target.value)}
            required
            InputProps={{
              startAdornment: '₱',
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            sx={{ minWidth: 120 }}
          >
            {editingId ? 'Update' : 'Add'}
          </Button>
          {editingId && (
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => {
                setEditingId(null);
                setMenuName('');
                setMenuPrice('');
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            Error: {error}
          </Alert>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="menu table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menu
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover tabIndex={-1} key={row.menu_id}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          if (column.id === 'actions') {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <IconButton onClick={() => handleEdit(row)}>
                                  <Edit color="primary" />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(row.menu_id)}>
                                  <Delete color="error" />
                                </IconButton>
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format ? column.format(value) : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={menu.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Menu;