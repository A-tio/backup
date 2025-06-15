import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  Box, Button, Typography, 
  CircularProgress, Container
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Topbar from '../components/Topbar';


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function Analytics() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const url = `http://localhost:8000/api/sales?start=${dateRange.start}&end=${dateRange.end}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch sales');
        const data = await response.json();
        
        // Convert numeric fields to proper numbers
        const processedData = (data.data || data).map(item => ({
          ...item,
          quantity: Number(item.quantity),
          total_price: parseFloat(item.total_price),
          menu_price: parseFloat(item.menu_price)
        }));
        
        setSales(processedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [dateRange]);

  // Chart data configuration
  const chartData = {
    labels: sales.map(sale => sale.menu_name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: sales.map(sale => sale.quantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Revenue (₱)',
        data: sales.map(sale => sale.total_price),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Performance Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (₱) / Quantity'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Menu Items'
        }
      }
    }
  };

  // Calculate totals safely
  const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_price, 0);

  return (
    <Container maxWidth="lg">
      <Topbar/>
      <Box sx={{ my: 4 }}>
        <Button 
          component={Link}
          to="/"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back to Sales
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Sales Analytics Dashboard
        </Typography>

        {/* Date Range Selector */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" sx={{ height: '400px', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : sales.length === 0 ? (
          <Typography>No sales data available for the selected period</Typography>
        ) : (
          <Box sx={{ height: '70vh', width: '100%' }}>
            <Bar data={chartData} options={chartOptions} />
            
            {/* Additional Stats */}
            <Box sx={{ mt: 4, display: 'flex', gap: 3 }}>
              <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography variant="h6">Total Items Sold</Typography>
                <Typography variant="h4">
                  {totalQuantity}
                </Typography>
              </Box>
              <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h4">
                  ₱{totalRevenue.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Analytics;