import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';

import useSellerProduct from '@/hooks/useProduct';

const SellerReview = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    fetchSellerProducts,
    fetchSellerReviews,
    deleteSellerReview,
    sellerProducts,
    sellerReviews,
  } = useSellerProduct();

  const loading = sellerReviews?.loading || false;
  const error = sellerReviews?.error || '';
  const productList = sellerProducts || [];
  const reviews = sellerReviews || [];

  useEffect(() => {
    fetchSellerProducts();
    fetchSellerReviews();
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const getProductName = (productId) => {
    const product = productList.find((p) => p.id === productId);
    return product ? product.product_name : 'Unknown Product';
  };

  const handleDeleteClick = (reviewId) => {
    setSelectedReviewId(reviewId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedReviewId) {
      setDeleting(true);
      try {
        await deleteSellerReview(selectedReviewId); // wait for delete to complete
        await fetchSellerReviews(); // refresh reviews after delete
      } catch (error) {
        console.error('Error deleting review:', error);
      } finally {
        setDeleting(false);
        setConfirmOpen(false);
        setSelectedReviewId(null);
      }
    }
  };

  const filteredReviews = Array.isArray(reviews)
    ? reviews.filter((review) =>
        productList.some((product) => product.id === review.product_id)
      )
    : [];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />

      <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}>
        <Sidebar open={sidebarOpen} />

        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h5" mb={2}>
            Seller Reviews
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filteredReviews.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{getProductName(review.product_id)}</TableCell>
                      <TableCell>
                        <Rating value={review.rating} readOnly />
                      </TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>{new Date(review.created_at).toLocaleString()}</TableCell>
                      <TableCell>{new Date(review.updated_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(review.id)}
                          startIcon={<DeleteIcon />}
                          disabled={deleting}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No reviews found for your products.</Typography>
          )}
        </Box>
      </Box>

      <Footer />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary" disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SellerReview;
