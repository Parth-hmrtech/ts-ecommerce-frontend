import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CircularProgress,
} from '@mui/material';

import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';

import useSellerDashboard from '@/hooks/useSellerDashboard';

const SellerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    isLoading,
    totalProducts,
    totalOrders,
    totalEarnings,
    totalReviews,
    averageRating,
  } = useSellerDashboard();

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const StatCard = ({ icon, title, value, bg }) => (
    <Card sx={{ p: 2, textAlign: 'center', backgroundColor: bg, borderRadius: 3 }}>
      <Box display="flex" justifyContent="center" mb={1}>
        {icon}
      </Box>
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />

      <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}>
        <Sidebar open={sidebarOpen} />

        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Seller Dashboard
          </Typography>

          {isLoading ? (
            <CircularProgress />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                mb: 3,
              }}
            >
              <Box sx={{ flex: '1 1 200px', maxWidth: '250px' }}>
                <StatCard
                  icon={<StoreIcon fontSize="large" color="secondary" />}
                  title="Total Products"
                  value={totalProducts}
                  bg="#f3e5f5"
                />
              </Box>

              <Box sx={{ flex: '1 1 200px', maxWidth: '250px' }}>
                <StatCard
                  icon={<ShoppingCartIcon fontSize="large" color="success" />}
                  title="Total Orders"
                  value={totalOrders}
                  bg="#e8f5e9"
                />
              </Box>

              <Box sx={{ flex: '1 1 200px', maxWidth: '250px' }}>
                <StatCard
                  icon={<CurrencyRupeeIcon fontSize="large" color="success" />}
                  title="Total Earnings"
                  value={`₹${parseFloat(totalEarnings).toFixed(2)}`}
                  bg="#c8e6c9"
                />
              </Box>

              <Box sx={{ flex: '1 1 200px', maxWidth: '250px' }}>
                <StatCard
                  icon={<RateReviewIcon fontSize="large" color="warning" />}
                  title="Total Reviews"
                  value={totalReviews}
                  bg="#fff8e1"
                />
              </Box>

              <Box sx={{ flex: '1 1 200px', maxWidth: '250px' }}>
                <StatCard
                  icon={<StarIcon fontSize="large" color="primary" />}
                  title="Avg. Rating"
                  value={averageRating}
                  bg="#e1f5fe"
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default SellerDashboard;
