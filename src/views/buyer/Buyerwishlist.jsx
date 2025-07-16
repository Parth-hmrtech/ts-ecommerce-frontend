import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import BuyerHeader from '@/components/common/BuyerHeader';
import BuyerFooter from '@/components/common/BuyerFooter';
import useProductManager from '@/hooks/useProduct';

const BuyerWishlist = () => {
  const navigate = useNavigate();

  const {
    wishlist,
    loading: wishlistLoading,
    error: wishlistError,
    products,
    deleteFromWishlist,
  } = useProductManager();

  const handleCardClick = (productId) => {
    navigate(`/buyer-dashboard/product-details/${productId}`);
  };

  const uniqueWishlist = useMemo(() => {
    const seen = new Set();
    return wishlist.filter(item => {
      if (seen.has(item.product_id)) return false;
      seen.add(item.product_id);
      return true;
    });
  }, [wishlist]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <BuyerHeader />

      <Container sx={{ mt: 5, mb: 5, flex: 1 }}>
        <Typography variant="h5" gutterBottom>
          My Wishlist
        </Typography>

        {wishlistLoading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : wishlistError ? (
          <Typography color="error">{wishlistError}</Typography>
        ) : uniqueWishlist.length === 0 ? (
          <Typography>No items in wishlist.</Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {uniqueWishlist.map((item) => {
              const product = products.find(p => p.id === item.product_id);
              if (!product) return null;

              let imageUrl = '/default-product.jpg';
              try {
                const parsed = JSON.parse(product.image_url || '[]');
                if (Array.isArray(parsed) && parsed.length > 0) {
                  imageUrl = parsed[0]?.image_url || imageUrl;
                }
              } catch (err) {
              }

              return (
                <Card
                  key={item.product_id}
                  onClick={() => handleCardClick(product.id)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 0 20px rgba(0, 123, 255, 0.4)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="100%"
                    image={imageUrl}
                    alt={product.product_name || 'Product Image'}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" fontSize={16} gutterBottom noWrap>
                      {product.product_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{Number(product.price || 0).toLocaleString()}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFromWishlist(item.product_id);
                        }}
                        color="error"
                        aria-label="Remove from wishlist"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Container>

      <Box mt="auto">
        <BuyerFooter />
      </Box>
    </Box>
  );
};

export default BuyerWishlist;
