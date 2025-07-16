import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  AppBar,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  CardActions,
} from '@mui/material';
import ecommerceLogo from '@/assets/images/ecommerce-logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsAction } from '@/store/actions/product.action';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NextArrow = ({ onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      right: -10,
      transform: 'translateY(-50%)',
      width: 36,
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'white',
      borderTopLeftRadius: '30px',
      borderBottomLeftRadius: '30px',
      boxShadow: 3,
      cursor: 'pointer',
      zIndex: 1,
      transition: 'box-shadow 0.3s ease-in-out',
      '&:hover': {
        boxShadow: '0 0 20px rgba(0, 123, 255, 0.4)',
      },
    }}
  >
    ❯
  </Box>
);

const PrevArrow = ({ onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      left: -10,
      transform: 'translateY(-50%)',
      width: 36,
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'white',
      borderTopRightRadius: '30px',
      borderBottomRightRadius: '30px',
      boxShadow: 3,
      cursor: 'pointer',
      zIndex: 1,
      transition: 'box-shadow 0.3s ease-in-out',
      '&:hover': {
        boxShadow: '0 0 20px rgba(0, 123, 255, 0.4)',
      },
    }}
  >
    ❮
  </Box>
);

const HomeView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products = [], loading, error } = useSelector((state) => state.product);
  const [visibleCount, setVisibleCount] = useState(9);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    dispatch(fetchProductsAction());
  }, [dispatch]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  const handleToggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const maxFullRows = Math.floor(visibleCount / 3) * 3;
  const visibleProducts = products.slice(0, maxFullRows);

  return (
    <Box>
      <AppBar position="static" color="transparent" elevation={1}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            py: 1,
          }}
        >
          <Box display="flex" alignItems="center">
            <img
              src={ecommerceLogo}
              alt="Logo"
              style={{ height: 80, marginRight: 12 }}
            />
          </Box>

          <Box display="flex" gap={2}>
            <Button variant="text" color="primary" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/signin')}>
              Sign In
            </Button>
          </Box>
        </Box>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Products
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" my={4}>
            <Typography color="error">Error: {error}</Typography>
          </Box>
        ) : products.length === 0 ? (
          <Box mt={4} textAlign="center">
            <Typography>No products available.</Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: '1fr 1fr 1fr',
                },
                gap: 3,
              }}
            >
              {visibleProducts.map((product) => {
                let images = [];

                try {
                  const parsed = JSON.parse(product.image_url);
                  if (Array.isArray(parsed)) {
                    images = parsed.map((img) => img.image_url || img);
                  } else if (parsed?.image_url) {
                    images = [parsed.image_url];
                  } else if (typeof parsed === 'string') {
                    images = [parsed];
                  }
                } catch {
                  images = [product.image_url || '/default-product.jpg'];
                }

                const isExpanded = expandedCards[product.id];

                return (
                  <Box key={product.id}>
                    <Card
                      sx={{
                        maxWidth: 345,
                        mx: 'auto',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid transparent',
                        transition: 'all 0.3s ease',
                        transform: 'scale(1)',
                        '&:hover': {
                          border: '1px solid #1976d2',
                          boxShadow: 23, 
                        },
                      }}


                    >
                      <Box sx={{ width: '100%', position: 'relative' }}>
                        {images.length > 1 ? (
                          <Slider
                            dots
                            infinite
                            speed={500}
                            slidesToShow={1}
                            slidesToScroll={1}
                            nextArrow={<NextArrow />}
                            prevArrow={<PrevArrow />}
                          >
                            {images.map((img, idx) => (
                              <Box key={`${product.id}-${idx}`}>
                                <CardMedia
                                  component="img"
                                  image={img || '/default-product.jpg'}
                                  alt={`Product image ${idx + 1}`}
                                  sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderBottom: '1px solid #eee',
                                  }}
                                />
                              </Box>
                            ))}
                          </Slider>
                        ) : (
                          <CardMedia
                            component="img"
                            image={images[0] || '/default-product.jpg'}
                            alt="Product image"
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderBottom: '1px solid #eee',
                            }}
                          />
                        )}
                      </Box>

                      <CardContent>
                        <Typography gutterBottom variant="h6">
                          {product.product_name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                          ₹{product.price}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {isExpanded
                            ? product.description || 'No description available.'
                            : (product.description?.slice(0, 80) || 'No description available.') +
                            (product.description?.length > 80 ? '...' : '')}
                        </Typography>
                      </CardContent>

                      <CardActions sx={{ mt: 'auto' }}>
                        {product.description?.length > 80 && (
                          <Button size="small" onClick={() => handleToggleExpand(product.id)}>
                            {isExpanded ? 'Less' : 'More'}
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Box>
                );
              })}
            </Box>

            {visibleProducts.length < products.length && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Button variant="outlined" onClick={handleLoadMore}>
                  Load More
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>

      <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} eCommerce. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomeView;
