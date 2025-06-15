import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';

import { 
  TextField, Button, Typography, Box, Alert, 
  MenuItem, Select, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress
} from '@mui/material';

export function Sales() {
  const [selectedMenu, setSelectedMenu] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState({
    menu: true,
    sales: true
  });

  // Helper function to safely format prices
  const formatPrice = (price) => {
    const num = typeof price === 'string' ? parseFloat(price) : Number(price) || 0;
    return num.toFixed(2);
  };

  // Enhanced fetch function
  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, got: ${contentType}`);
      }
      
      const data = await response.json();
      return data.data || data; // Handle both {data: [...]} and direct array responses
    } catch (err) {
      console.error(`Error fetching ${url}:`, err);
      throw err;
    }
  };

  // Fetch menu items and sales on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [menuData, salesData] = await Promise.all([
          fetchData('http://localhost:8000/api/menu'),
          fetchData('http://localhost:8000/api/sales')
        ]);
        
        setMenuItems(Array.isArray(menuData) ? menuData : []);
        setSales(Array.isArray(salesData) ? salesData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading({ menu: false, sales: false });
      }
    };
    
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedMenu) {
      setError('Please select a menu item');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          menu_id: selectedMenu,
          quantity: parseInt(quantity),
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Sale failed');
      }

      // Refresh sales data
      const salesResponse = await fetchData('http://localhost:8000/api/sales');
      setSales(Array.isArray(salesResponse) ? salesResponse : []);
      
      setSuccess('Sale added successfully!');
      setSelectedMenu('');
      setQuantity(1);
    } catch (err) {
      console.error('Sale error:', err);
      setError(err.message || 'Failed to record sale');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Topbar />
      <div 
        className='bg-red-300 p-4 rounded-lg mb-4'
        style={{ border: '1px solid #ccc' }}
      >
        <Link to="/">Back to Menu</Link>
        <h2 className='text-xl font-bold mb-4'>Add Sales</h2>
        
        {loading.menu ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Menu Item</InputLabel>
              <Select
                value={selectedMenu}
                label="Menu Item"
                onChange={(e) => setSelectedMenu(e.target.value)}
                required
              >
                {menuItems.map((menu) => (
                  <MenuItem key={menu.menu_id} value={menu.menu_id}>
                    {menu.menu_name} (₱{formatPrice(menu.menu_price)})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Quantity"
              variant="outlined"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              type="number"
              inputProps={{ min: 1 }}
              margin="normal"
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Sale
            </Button>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </div>

      {/* Sales Table */}
      <div className='mt-8'>
        <h2 className='text-xl font-bold mb-4'>Recent Sales</h2>
        {loading.sales ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : sales.length === 0 ? (
          <Typography>No sales records found</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Menu Item</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((sale) => (
                    <TableRow key={sale.sales_id}>
                    <TableCell>{sale.menu_name}</TableCell>
                    <TableCell align="right">₱{formatPrice(sale.menu_price)}</TableCell>
                    <TableCell align="right">{sale.quantity}</TableCell>
                    <TableCell align="right">₱{formatPrice(sale.total_price)}</TableCell>
                    <TableCell align="right">
                        {new Date(sale.created_at).toLocaleString()}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}

export default Sales;