import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Card,
    CardMedia,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Footer from '@/components/common/Footer';

import useSellerProduct from '@/hooks/useProduct';

const NextArrow = ({ onClick }) => (
    <Box
        onClick={onClick}
        sx={{
            position: 'absolute',
            right: -30,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'white',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 2,
            cursor: 'pointer',
            fontSize: 16,
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
            left: -30,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'white',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 2,
            cursor: 'pointer',
            fontSize: 16,
        }}
    >
        ❮
    </Box>
);

const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
};

const SellerProductImages = () => {
    const {
        fetchSellerProducts,
        uploadProductImage,
        sellerProducts,
        sellerLoading,
        sellerError,
    } = useSellerProduct();
    const loading = sellerLoading;
    const error = sellerError;

    const products = sellerProducts;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [file, setFile] = useState(null);
    const [productId, setProductId] = useState('');
    const [visibleCount, setVisibleCount] = useState(20);

    useEffect(() => {
        fetchSellerProducts();
    }, []);

    const handleToggleSidebar = () => setSidebarOpen((o) => !o);

    const handleUpload = () => {
        if (!file || !productId || file.length === 0) return;

        const fd = new FormData();
        fd.append('product_id', productId);
        file.forEach((f) => fd.append('image', f));

        uploadProductImage(fd)
            .then(() => {
                setFile(null);
                document.querySelector('input[type="file"]').value = '';
                fetchSellerProducts();
            })
            .catch((err) => {
                console.error('Image upload failed:', err);
            });
    };

    const displayProducts = products.slice(0, visibleCount);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />

            <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}>
                <Sidebar open={sidebarOpen} />

                <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5' }}>
                    <Typography variant="h5" mb={2}>
                        Upload Product Images
                    </Typography>

                    <Box display="flex" gap={2} alignItems="center" mb={4}>
                        <FormControl sx={{ minWidth: 240 }}>
                            <InputLabel>Select Product</InputLabel>
                            <Select
                                value={productId}
                                label="Select Product"
                                onChange={(e) => setProductId(e.target.value)}
                            >
                                {products.map((p) => {
                                    let thumb = '';
                                    try {
                                        const arr = JSON.parse(p.image_url || '[]');
                                        thumb = Array.isArray(arr) ? arr[0]?.image_url : '';
                                    } catch {
                                        thumb = '';
                                    }
                                    return (
                                        <MenuItem key={p.id} value={p.id}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {thumb && (
                                                    <img
                                                        src={thumb}
                                                        alt=""
                                                        style={{ height: 24, borderRadius: 4 }}
                                                    />
                                                )}
                                                {p.product_name}
                                            </Box>
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setFile(Array.from(e.target.files))}
                        />

                        <Button
                            variant="contained"
                            onClick={handleUpload}
                            disabled={!file || !productId}
                        >
                            Upload
                        </Button>
                    </Box>

                    {loading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '300px',
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                    gap: 2,
                                }}
                            >
                                {displayProducts.map((p) => {
                                    let imgs = [];
                                    try {
                                        const parsed = JSON.parse(p.image_url || '[]');
                                        imgs = Array.isArray(parsed)
                                            ? parsed.map((o) => o.image_url || o)
                                            : [parsed];
                                    } catch {
                                        imgs = [p.image_url];
                                    }
                                    return (
                                        <Card
                                            key={p.id}
                                            sx={{
                                                position: 'relative',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                p: 1,
                                                minWidth: 120,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    position: 'relative',
                                                    mb: 1,
                                                }}
                                            >
                                                {imgs.length > 1 ? (
                                                    <Slider {...sliderSettings}>
                                                        {imgs.map((url, idx) => (
                                                            <Box
                                                                key={idx}
                                                                sx={{
                                                                    width: 150,
                                                                    height: 100,
                                                                    borderRadius: 1,
                                                                    overflow: 'hidden',
                                                                    border: '1px solid #ccc',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <CardMedia
                                                                    component="img"
                                                                    image={url}
                                                                    alt={`Product ${idx}`}
                                                                    sx={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover',
                                                                    }}
                                                                />
                                                            </Box>
                                                        ))}
                                                    </Slider>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            width: 100,
                                                            height: 80,
                                                            borderRadius: 1,
                                                            overflow: 'hidden',
                                                            border: '1px solid #ccc',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <CardMedia
                                                            component="img"
                                                            image={imgs[0]}
                                                            alt="Product"
                                                            sx={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>

                                            <Typography
                                                variant="subtitle2"
                                                noWrap
                                                sx={{ textAlign: 'center', maxWidth: 100 }}
                                            >
                                                {p.product_name}
                                            </Typography>
                                        </Card>
                                    );
                                })}
                            </Box>

                            {visibleCount < products.length && (
                                <Box display="flex" justifyContent="center" mt={3}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setVisibleCount((prev) => prev + 20)}
                                    >
                                        Load More
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>

            <Footer />
        </Box>
    );
};

export default SellerProductImages;
