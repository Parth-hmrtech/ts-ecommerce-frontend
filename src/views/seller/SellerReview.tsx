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
import type { IReview } from '@/types/review.types';

const SellerReview: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    fetchSellerReviews,
    deleteSellerReview,
    sellerProducts,
    sellerReviews,
  } = useSellerProduct();

  useEffect(() => {
    fetchSellerReviews();
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const getProductName = (productId: string): string => {
    const product = sellerProducts?.find((p) => p.id === productId);
    return product?.product_name || 'Unknown Product';
  };

  const handleDeleteClick = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedReviewId) return;
    setDeleting(true);
    try {
      await deleteSellerReview(selectedReviewId);
      await fetchSellerReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setSelectedReviewId(null);
    }
  };

  const filteredReviews: IReview[] =
    Array.isArray(sellerReviews) && Array.isArray(sellerProducts)
      ? sellerReviews.filter((review) =>
        sellerProducts.some((product) => product.id === review.product_id)
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

          {sellerReviews == null ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
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
                      <TableCell>{review.product_id ? getProductName(review.product_id) : 'Unknown Product'}</TableCell>
                      <TableCell>
                        <Rating value={review.rating} readOnly />
                      </TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>
                        {new Date(review.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(review.updated_at).toLocaleString()}
                      </TableCell>
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
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
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
