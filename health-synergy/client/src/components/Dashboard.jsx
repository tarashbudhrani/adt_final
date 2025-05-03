import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
}));

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSupplies: 0,
    lowStock: 0,
    totalUsers: 0,
    recentUsage: 0,
  });
  const [usageData, setUsageData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [userUsageData, setUserUsageData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [supplies, users, recentUsage, usageTotals] = await Promise.all([
          fetch('http://localhost:5000/api/supplies').then(res => res.json()),
          fetch('http://localhost:5000/api/users').then(res => res.json()),
          fetch('http://localhost:5000/api/usage-records/recent').then(res => res.json()),
          fetch('http://localhost:5000/api/usage-records/user-totals').then(res => res.json()),
        ]);

        const lowStock = supplies.filter(supply => supply.stockQuantity <= supply.reorderLevel);

        // Process category data
        const categories = {};
        supplies.forEach(supply => {
          categories[supply.category] = (categories[supply.category] || 0) + 1;
        });

        setCategoryData({
          labels: Object.keys(categories),
          data: Object.values(categories),
        });

        // Process user usage data
        setUserUsageData({
          labels: usageTotals.map(item => item.user.name),
          data: usageTotals.map(item => item.totalItems),
        });

        // Process daily usage data for the last 7 days
        const dailyUsage = {};
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
          dailyUsage[date] = 0;
          return date;
        }).reverse();

        recentUsage.forEach(record => {
          const date = format(new Date(record.date), 'yyyy-MM-dd');
          if (dailyUsage[date] !== undefined) {
            dailyUsage[date] += record.quantity;
          }
        });

        setUsageData({
          labels: last7Days.map(date => format(new Date(date), 'MMM dd')),
          data: last7Days.map(date => dailyUsage[date]),
        });

        setStats({
          totalSupplies: supplies.length,
          lowStock: lowStock.length,
          totalUsers: users.length,
          recentUsage: recentUsage.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const usageChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Usage Trend',
      },
    },
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Supplies by Category',
      },
    },
  };

  const userUsageChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Items Used by User',
      },
    },
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Item>
            <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4">{stats.totalSupplies}</Typography>
            <Typography variant="subtitle1">Total Supplies</Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item>
            <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4">{stats.lowStock}</Typography>
            <Typography variant="subtitle1">Low Stock Items</Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item>
            <PeopleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4">{stats.totalUsers}</Typography>
            <Typography variant="subtitle1">Active Users</Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item>
            <AssignmentIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h4">{stats.recentUsage}</Typography>
            <Typography variant="subtitle1">Recent Usage Records</Typography>
          </Item>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <ChartContainer>
            <Line
              options={usageChartOptions}
              data={{
                labels: usageData.labels,
                datasets: [
                  {
                    label: 'Items Used',
                    data: usageData.data,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                  },
                ],
              }}
            />
          </ChartContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartContainer>
            <Doughnut
              options={categoryChartOptions}
              data={{
                labels: categoryData.labels,
                datasets: [
                  {
                    data: categoryData.data,
                    backgroundColor: [
                      '#FF6384',
                      '#36A2EB',
                      '#FFCE56',
                      '#4BC0C0',
                      '#9966FF',
                    ],
                  },
                ],
              }}
            />
          </ChartContainer>
        </Grid>

        <Grid item xs={12}>
          <ChartContainer>
            <Bar
              options={userUsageChartOptions}
              data={{
                labels: userUsageData.labels,
                datasets: [
                  {
                    label: 'Items Used',
                    data: userUsageData.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  },
                ],
              }}
            />
          </ChartContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 