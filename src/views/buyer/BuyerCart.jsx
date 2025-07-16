import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
  Button,
  TextField,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import BuyerHeader from '@/components/common/BuyerHeader';
import BuyerFooter from '@/components/common/BuyerFooter';

import useBuyerCart from '@/hooks/useCart';

const BuyerCart = () => {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    error,
    products,
    fetchCart,
    updateCartItem,
    deleteCartItem,
    deleteCartByBuyerId,
    placeOrder,
  } = useBuyerCart();

  const [showPlaceOrder, setShowPlaceOrder] = useState(false);
  const [address, setAddress] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleUpdateQuantity = (item, delta) => {
    const newQty = item.quantity + delta;

    if (newQty < 1) {
      deleteCartItem(item.id).then(fetchCart);
    } else {
      updateCartItem({ id: item.id, quantity: newQty }).then(fetchCart);
    }
  };

  const handleDeleteItem = (id) => {
    deleteCartItem(id).then(fetchCart);
  };

  const handleCardClick = (productId) => {
    navigate(`/buyer-dashboard/product-details/${productId}`);
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (!product || isNaN(Number(product.price))) return total;
      return total + item.quantity * Number(product.price);
    }, 0);

  const handlePlaceOrderClick = () => {
    setShowPlaceOrder(true);
  };

  const handlePlaceOrderSubmit = async () => {
    if (!address.trim()) {
      alert('Please enter your address.');
      return;
    }

    const orderData = {
      delivery_address: address,
      products: cart
        .filter((item) => products.some((p) => p.id === item.product_id))
        .map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
    };

    setPlacingOrder(true);
    try {
      const res = await placeOrder(orderData);
      const buyerId = JSON.parse(localStorage.getItem('user'))?.id;

      if (buyerId) {
        await deleteCartByBuyerId(buyerId);
      }

      if (res.type === 'buyerOrder/placeBuyerOrder/fulfilled') {
        setAddress('');
        setShowPlaceOrder(false);
        navigate('/buyer-dashboard/orders');
      } else {
        alert('Order failed. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <BuyerHeader />

      <Container sx={{ mt: 5, mb: 5, flex: 1 }}>
        <Typography variant="h5" gutterBottom>
          My Cart
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : cart.length === 0 ? (
          <Typography>No items in cart.</Typography>
        ) : (
          <>
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              gap={3}
            >
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.product_id);
                if (!product) return null;

                let imageUrl = '/default-product.jpg';
                try {
                  const parsed = JSON.parse(product.image_url || '[]');
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    imageUrl = parsed[0]?.image_url || imageUrl;
                  }
                } catch {}

                return (
                  <Card
                    key={item.id}
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
                      height="100%"
                      image={imageUrl}
                      alt={product?.product_name || 'Product Image'}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Typography variant="h6" fontSize={16} gutterBottom>
                        {product?.product_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{Number(product?.price).toLocaleString()}
                      </Typography>

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mt={2}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Box display="flex" alignItems="center" mt={3}>
                          <IconButton onClick={() => handleUpdateQuantity(item, -1)}>
                            <Remove />
                          </IconButton>

                          <Typography>{item.quantity}</Typography>

                          <IconButton onClick={() => handleUpdateQuantity(item, 1)}>
                            <Add />
                          </IconButton>
                        </Box>

                        <IconButton onClick={() => handleDeleteItem(item.id)} color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>

            <Box mt={4}>
              <Typography variant="h6" textAlign="right">
                Total: ₹{calculateTotal().toLocaleString()}
              </Typography>
              <Box textAlign="right">
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 2 }}
                  onClick={handlePlaceOrderClick}
                >
                  Place Order
                </Button>
              </Box>
            </Box>

            {showPlaceOrder && (
              <>
                <Box
                  onClick={() => setShowPlaceOrder(false)}
                  sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 999,
                    cursor: 'pointer',
                  }}
                />

                <Box
                  sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 24,
                    zIndex: 1000,
                    width: '90%',
                    maxWidth: 500,
                    p: 4,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>

                  {cart.map((item) => {
                    const product = products.find((p) => p.id === item.product_id);
                    if (!product) return null;

                    return (
                      <Box
                        key={item.id}
                        display="flex"
                        justifyContent="space-between"
                        borderBottom="1px solid #eee"
                        py={1}
                      >
                        <Typography>{product?.product_name}</Typography>
                        <Typography>
                          ₹{Number(product?.price).toLocaleString()} × {item.quantity}
                        </Typography>
                      </Box>
                    );
                  })}

                  <Typography mt={2} fontWeight="bold">
                    Total: ₹{calculateTotal().toLocaleString()}
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Shipping Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    sx={{ mt: 3 }}
                  />

                  <Box textAlign="right" mt={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePlaceOrderSubmit}
                      disabled={placingOrder}
                    >
                      {placingOrder ? 'Placing Order...' : 'Confirm Order'}
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </>
        )}
      </Container>

      <Box mt="auto">
        <BuyerFooter />
      </Box>
    </Box>
  );
};

export default BuyerCart;
