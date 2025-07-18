import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Container,
    IconButton,
    Snackbar,
    Alert,
    Rating,
    Button,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Add, Remove } from '@mui/icons-material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import BuyerHeader from '@/components/common/BuyerHeader';
import BuyerFooter from '@/components/common/BuyerFooter';
import useProductManager from '@/hooks/useProduct';
import type { IReview } from '@/types/review.types';
import type { ICartItem } from '@/types/cart.types';
interface ArrowProps {
    onClick?: () => void;
}
const NextArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <Box
        onClick={onClick}
        sx={{
            position: 'absolute',
            top: '50%',
            right: -20,
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
        }}
    >
        ❯
    </Box>
);

const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <Box
        onClick={onClick}
        sx={{
            position: 'absolute',
            top: '50%',
            left: -20,
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
        }}
    >
        ❮
    </Box>
);

const BuyerProductDetail: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();

    const {
        product,
        loading,
        error,
        cart,
        fetchCart,
        wishlist,
        fetchReviews,
        reviewResponses,
        addToCart,
        updateCart,
        deleteCartItem,
        addToWishlist,
        updateReview,
        deleteReview,
    } = useProductManager(productId);


    const [wishlisted, setWishlisted] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editedRating, setEditedRating] = useState<number>(0);
    const [editedComment, setEditedComment] = useState<string>('');

    useEffect(() => {
        const isWished = Array.isArray(wishlist) && wishlist.some((item) => item && item.product_id === product?.id);
        if (wishlisted !== isWished) {
            setWishlisted(isWished);
        }
    }, [wishlist, product?.id]);

    const getImages = (imageString?: string): string[] => {
        if (!imageString) return [];
        try {
            const parsed = JSON.parse(imageString);
            return Array.isArray(parsed)
                ? parsed.map((img: any) => img.image_url || img)
                : [parsed?.image_url || parsed];
        } catch {
            return [];
        }
    };
    const handleUpdateQuantity = async (item: ICartItem, delta: number) => {
        const newQty = item.quantity + delta;

        if (newQty < 1) {
            await deleteCartItem(item.id);
        } else {
            await updateCart({ ...item, quantity: newQty });
        }

        fetchCart();
    };

    const handleAddToCart = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}') as { id?: string };

        if (user?.id && product?.id) {
            const payload = {
                buyer_id: user.id,
                product_id: product.id,
                quantity: 1,
            };

            addToCart(payload);
        } else {
            console.warn('User or product ID is missing.');
        }
    };

    const handleWishlistClick = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.id && product?.id) {
            addToWishlist({ buyer_id: user.id, product_id: product.id });
            setWishlisted(true);
            setSnackbarOpen(true);
        }
    };

    const handleEditClick = (review: IReview) => {
        setEditingReviewId(review.id);
        setEditedRating(review.rating ?? 0);
        setEditedComment(review.comment ?? '');

    };

    const handleUpdateReview = async (reviewId: string) => {
        await updateReview({ id: reviewId, rating: editedRating, comment: editedComment });
        setEditingReviewId(null);
        if (product?.id) {
            fetchReviews(product.id);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        await deleteReview(reviewId);
        if (product?.id) {
            fetchReviews(product.id);
        }
    };

    const images = getImages(product?.image_url);
    const cartItem = cart.find((item: ICartItem) => item.product_id === product?.id);
    const quantity = cartItem?.quantity || 0;
    const totalPrice = (parseFloat(String(product?.price ?? '0')) * quantity).toFixed(2);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            <BuyerHeader />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
                    Added to wishlist!
                </Alert>
            </Snackbar>

            <Container sx={{ mt: 5, flex: 1 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">Error: {error}</Typography>
                ) : !product ? (
                    <Typography>No product found.</Typography>
                ) : (
                    <>
                        {/* Product Images and Info */}
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="center">
                            {/* Image Section */}
                            <Card sx={{ flex: 1, p: 2, overflow: 'hidden', position: 'relative' }}>
                                <IconButton
                                    onClick={handleWishlistClick}
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        zIndex: 2,
                                        bgcolor: '#fff',
                                        '&:hover': { bgcolor: '#ffe6e6' },
                                        boxShadow: 2,
                                    }}
                                >
                                    {wishlisted ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                                </IconButton>

                                {images.length > 1 ? (
                                    <Slider {...sliderSettings}>
                                        {images.map((url, index) => (
                                            <Box key={index} sx={{ px: 2 }}>
                                                <img
                                                    src={url}
                                                    alt={`product-${index}`}
                                                    style={{ width: '100%', height: '320px', objectFit: 'contain', borderRadius: '12px' }}
                                                />
                                            </Box>
                                        ))}
                                    </Slider>
                                ) : images.length === 1 ? (
                                    <Box sx={{ px: 2 }}>
                                        <img
                                            src={images[0]}
                                            alt="product-single"
                                            style={{ width: '100%', height: '320px', objectFit: 'contain', borderRadius: '12px' }}
                                        />
                                    </Box>
                                ) : (
                                    <Box>
                                        <img
                                            src="No image"
                                            alt="placeholder"
                                            style={{ width: '100%', height: '320px', objectFit: 'contain', borderRadius: '12px' }}
                                        />
                                    </Box>
                                )}
                            </Card>

                            {/* Info Section */}
                            <Card sx={{ flex: 1 }}>
                                <CardContent>
                                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                                        {product.product_name}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {product.description}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                        <strong>Category:</strong> {product.category?.category_name || 'N/A'}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        <strong>Subcategory:</strong> {product.subCategory?.sub_category_name || 'N/A'}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        <strong>Available:</strong> {product.quantity}
                                    </Typography>
                                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                        ₹{product.price}
                                    </Typography>

                                    <Box display="flex" alignItems="center" mt={3}>
                                        <IconButton
                                            onClick={() => cartItem && handleUpdateQuantity(cartItem, -1)}
                                        >
                                            <Remove />
                                        </IconButton>
                                        <Typography>{quantity}</Typography>
                                        <IconButton
                                            onClick={() =>
                                                cartItem ? handleUpdateQuantity(cartItem, 1) : handleAddToCart()
                                            }
                                        >
                                            <Add />
                                        </IconButton>
                                    </Box>

                                    {quantity > 0 && (
                                        <Typography variant="body1" sx={{ mt: 2 }}>
                                            <strong>Total:</strong> ₹{totalPrice}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Box>

                        {reviewResponses.filter(r => r.product_id === productId).length > 0 && (
                            <Box
                                sx={{
                                    border: '1px solid #ddd',
                                    borderRadius: 1,
                                    p: 2,
                                    backgroundColor: '#fff',
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {reviewResponses
                                        .filter(review => review.product_id === productId)
                                        .map((review: IReview) => {
                                            const user = JSON.parse(localStorage.getItem('user') || '{}');
                                            const isOwnReview = user?.id === review.buyer_id;
                                            const isEditing = editingReviewId === review.id;

                                            return (
                                                <Box
                                                    key={`review-${review.id}`}
                                                    sx={{
                                                        borderBottom: '1px solid #eee',
                                                        pb: 1,
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                                                        {isOwnReview ? 'You' : `Buyer: ${review.buyer_id}`}
                                                    </Typography>

                                                    {isEditing ? (
                                                        <>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                <Rating
                                                                    value={editedRating}
                                                                    onChange={(_, val) => setEditedRating(val || 0)}
                                                                    precision={0.5}
                                                                    size="small"
                                                                />
                                                                <Typography variant="body2" sx={{ ml: 1 }}>
                                                                    ({editedRating}/5)
                                                                </Typography>
                                                            </Box>
                                                            <textarea
                                                                value={editedComment}
                                                                onChange={e => setEditedComment(e.target.value)}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '8px',
                                                                    marginTop: '10px',
                                                                    borderRadius: '4px',
                                                                    border: '1px solid #ccc',
                                                                    resize: 'vertical',
                                                                    fontFamily: 'inherit',
                                                                    fontSize: '14px',
                                                                }}
                                                                rows={3}
                                                            />
                                                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={() => handleUpdateReview(review.id)}
                                                                >
                                                                    Save
                                                                </Button>
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onClick={() => setEditingReviewId(null)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </Box>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                                <Rating value={review.rating} readOnly precision={0.5} size="small" />
                                                                <Typography variant="body1" sx={{ flex: 1 }}>
                                                                    {review.comment}
                                                                </Typography>
                                                            </Box>

                                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                                {review.created_at ? new Date(review.created_at).toLocaleString('en-IN') : 'Date not available'}
                                                            </Typography>

                                                            {isOwnReview && (
                                                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                                                    <Button variant="text" size="small" onClick={() => handleEditClick(review)}>
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        variant="text"
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() => handleDeleteReview(review.id)}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </Box>
                                                            )}
                                                        </>
                                                    )}
                                                </Box>
                                            );
                                        })}
                                </Box>
                            </Box>
                        )}

                    </>
                )}
            </Container>
            <BuyerFooter />
        </Box>
    );
};

export default BuyerProductDetail;
