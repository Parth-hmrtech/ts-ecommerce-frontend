import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
  TextField,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import BuyerHeader from '@/components/common/BuyerHeader';
import BuyerFooter from '@/components/common/BuyerFooter';
import useBuyerDashboard from '@/hooks/useBuyerDashboard'; 

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const {
    products,
    cart,
    loading,
    error,
    addToCart,
    updateCart,
    deleteFromCart,
    refreshCart,
  } = useBuyerDashboard();

    
  const [quantities, setQuantities] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    const qtyMap = {};
    cart.forEach((item) => {
      qtyMap[item.product_id] = item.quantity;
    });
    setQuantities(qtyMap);
  }, [cart]);

const handleQuantityChange = async (productId, delta) => {
  const currentQty = quantities[productId] || 0;
  const newQty = Math.max(0, currentQty + delta);

  setQuantities((prev) => ({
    ...prev,
    [productId]: newQty,
  }));

  const cartItem = cart.find((item) => item.product_id === productId);

  try {
    if (newQty === 0 && cartItem) {
      await deleteFromCart(cartItem.id);
      await refreshCart(); // make sure refresh happens after delete
    } else if (cartItem) {
      await updateCart(cartItem.id, newQty);
    } else if (newQty > 0) {
      await addToCart(productId, newQty);
    }
  } catch (error) {
    console.error('❌ Error updating cart:', error);
    // Optionally show a Snackbar/Toast message to the user here
  }
};


const handleCardClick = (productId) => {
  navigate(`/buyer-dashboard/product-details/${productId}`);
};
  const getImageArray = (imageData) => {
    try {
      const parsed = JSON.parse(imageData);
      if (Array.isArray(parsed)) return parsed.map((img) => img.image_url || img);
      if (typeof parsed === 'object' && parsed.image_url) return [parsed.image_url];
      if (typeof parsed === 'string') return [parsed];
    } catch {
      return [imageData || '/default-product.jpg'];
    }
  };

  const filteredProducts = products.filter((product) =>
    product.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <BuyerHeader />

      <Container sx={{ mt: 5, mb: 5, flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ maxWidth: 400, width: '100%' }}>
            <TextField
              fullWidth
              label="Search Product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : (
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap={3}
          >
            {filteredProducts.map((product) => {
              const images = getImageArray(product.image_url);
              const quantity = quantities[product.id] || 0;

              return (
                <Box key={product.id}>
                  <Card
                    onClick={() => handleCardClick(product.id)}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow: '0 0 20px rgba(0, 123, 255, 0.4)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={images[0] || '/default-product.jpg'}
                      alt={product.product_name}
                      height="100%"
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="h6" fontSize="16px" sx={{ mb: 0.5 }}>
                        {product.product_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{product.price}
                      </Typography>

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mt={1}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          color="primary"
                          onClick={() => handleQuantityChange(product.id, -1)}
                          disabled={quantity === 0}
                        >
                          <Remove />
                        </IconButton>
                        <Typography variant="body1" sx={{ mx: 2 }}>
                          {quantity}
                        </Typography>
                        <IconButton
                          color="primary"
                          onClick={() => handleQuantityChange(product.id, 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>
        )}
      </Container>

      <BuyerFooter />
    </Box>
  );
};

export default BuyerDashboard;
