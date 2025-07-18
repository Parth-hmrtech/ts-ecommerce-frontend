import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Container, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Collapse, TableContainer, Paper, Button, TextField, Modal, FormControl,
  InputLabel, Select, MenuItem, Snackbar, Alert, Rating,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useSelector } from 'react-redux';

import BuyerHeader from '@/components/common/BuyerHeader';
import BuyerFooter from '@/components/common/BuyerFooter';
import useBuyerOrder from '@/hooks/useOrder';
import type { RootState } from '@/store';
import type { IReview } from '@/types/review.types';
import type { IOrderItem, IOrder } from '@/types/order.types';


const BuyerOrders: React.FC = () => {

  const {
    orders,
    loading,
    error,
    buyerCheckPayments,
    buyerReviews,
    fetchOrders,
    deleteOrder,
    updateOrderAddress,
    fetchPaymentStatus,
    checkoutPayment,
    verifyPayment,
    addReview,
    updateReview,
    deleteReview,
    fetchReviewsByProductId,
  } = useBuyerOrder();

  const { products = [] } = useSelector((state: RootState) => state.product);

  const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
  const [editAddressRow, setEditAddressRow] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [reviewInputs, setReviewInputs] = useState<{
    [orderId: string]: {
      comment?: string;
      rating?: number;
      product_id?: string;
      review_id?: string;
    };
  }>({});

  useEffect(() => {
    if (!Array.isArray(orders) || orders.length === 0) return;

    const uniqueProductIds = new Set<string>();

    orders.forEach((order: IOrder) => {
      order?.order_items?.forEach((item: IOrderItem) => {
        if (item?.product_id) {
          uniqueProductIds.add(item.product_id);
        }
      });
    });


    uniqueProductIds.forEach((productId) => {
      if (productId) {
        fetchReviewsByProductId(productId);
      }
    });
  }, [orders, fetchReviewsByProductId]);

  const handleToggleRow = (orderId: string) => {
    setOpenRows((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleDelete = async (orderId: string) => {
    await deleteOrder(orderId);
    await fetchOrders();
    await fetchPaymentStatus();
  };

  const handleEditAddress = (orderId: string, currentAddress: string) => {
    setEditAddressRow(orderId);
    setNewAddress(currentAddress);
  };

  const handleSaveAddress = async (orderId: string) => {
    if (!newAddress.trim()) return alert('Address cannot be empty.');
    await updateOrderAddress({ orderId, delivery_address: newAddress });
    setEditAddressRow(null);
    fetchOrders();
  };

  const calculateOrderTotal = (items: IOrderItem[] = []) => {
    return items.reduce((sum, item) => {
      const price = Number(item?.price) || 0;
      const quantity = Number(item?.quantity) || 0;
      return sum + price * quantity;
    }, 0);
  };

  const handlePayNowClick = (order: IOrder) => {
    if (!order) return;
    setSelectedOrder(order);
    setPaymentMethod('UPI');
    setPaymentModalOpen(true);
  };

  const handleVerifyPayment = async () => {
    if (!selectedOrder || isOrderPaid(selectedOrder.id)) return;

    const totalAmount = calculateOrderTotal(selectedOrder?.order_items || []);
    const transactionId = `txn_${Date.now()}_${selectedOrder.id}`;
    setPayingOrderId(selectedOrder.id);

    try {
      await checkoutPayment({
        order_id: selectedOrder.id,
        seller_id: selectedOrder.seller_id,
        amount: totalAmount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
      });

      await verifyPayment({
        status: 'success',
        transaction_id: transactionId,
      });

      setSuccessMessage(`Payment verified for Order #${selectedOrder.id}`);
    } catch (error) {
      setSuccessMessage(`Payment failed for Order #${selectedOrder.id}`);
    } finally {
      setOpenSnackbar(true);
      setPaymentModalOpen(false);
      setPayingOrderId(null);
      setTimeout(async () => {
        await fetchOrders();
        await fetchPaymentStatus();
      }, 10);
    }
  };

  const isOrderPaid = (orderId: string): boolean => {
    if (!Array.isArray(buyerCheckPayments)) return false;
    const entry = buyerCheckPayments.find((p: any) => p?.order_id === orderId);
    const status = entry?.payment_status?.toLowerCase();
    return status === 'success' || status === 'paid';
  };

  const handleReviewInputChange = (
    orderId: string,
    field: 'comment' | 'rating' | 'product_id' | 'review_id',
    value: string | number | null
  ) => {
    setReviewInputs((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value ?? '',
      },
    }));
  };

  const handleAddReview = async (order: IOrder, productId?: string) => {
    const { comment, rating } = reviewInputs[order.id] || {};
    if (!comment || !rating || !productId) return;

    await addReview({
      order_id: order.id,
      product_id: productId,
      buyer_id: order.buyer_id,
      seller_id: order.seller_id,
      rating,
      comment,
    });

    setReviewInputs((prev) => ({ ...prev, [order.id]: {} }));
    fetchReviewsByProductId(productId);
  };

  const handleUpdateReview = async (reviewId?: string, orderId?: string) => {
    const { rating, comment, product_id } = reviewInputs[orderId ?? ''] || {};
    if (!reviewId || !rating || !comment || !product_id) {
      alert('Please fill in all review details.');
      return;
    }

    try {
      await updateReview({ id: reviewId, rating, comment });
      fetchReviewsByProductId(product_id);
    } catch (error) {
      console.error('Failed to update review:', error);
      alert('Something went wrong while updating the review.');
    }
  };

  const handleDeleteReview = async (reviewId: string, productId?: string) => {
    if (!productId) return;
    await deleteReview(reviewId);
    fetchReviewsByProductId(productId);
  };

  const getProductName = (productId?: string): string => {
    if (!productId) return '';
    const product = products.find((p) => p.id === productId);
    return product?.product_name ?? '';
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <BuyerHeader />
      <Container maxWidth={false} sx={{ my: 4, flex: 1 }}>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }} onClose={() => setOpenSnackbar(false)}>
            {successMessage}
          </Alert>
        </Snackbar>

        <Typography variant="h5" gutterBottom>My Orders</Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : !Array.isArray(orders) || orders.filter(order => order.status?.toLowerCase() !== 'cancelled').length === 0 ? (

          <Typography>No active orders found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#f0f0f0' }}>
                <TableRow>
                  <TableCell />
                  <TableCell>Order ID</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(orders) &&
                  orders
                    .filter((order) => order.status?.toLowerCase() !== 'cancelled')
                    .flatMap((order) => {
                      const orderKey = `order-${order.id}`;
                      if (!Array.isArray(order.order_items)) return [];

                      return [
                        <TableRow hover key={`${orderKey}-main`}>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleToggleRow(order.id)}>
                              {openRows[order.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                          </TableCell>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>
                            {editAddressRow === order.id ? (
                              <TextField
                                size="small"
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                fullWidth
                              />
                            ) : (
                              order.delivery_address
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography color={order.status === 'delivered' ? 'green' : 'orange'}>
                              {order.status || 'Pending'}
                            </Typography>
                          </TableCell>
                          <TableCell>₹{calculateOrderTotal(order.order_items).toLocaleString()}</TableCell>
                          <TableCell>{order.order_date ? new Date(order.order_date).toLocaleString() : '-'}</TableCell>
                          <TableCell align="right">
                            {editAddressRow === order.id ? (
                              <Button size="small" variant="contained" onClick={() => handleSaveAddress(order.id)} sx={{ mr: 1 }}>
                                Save
                              </Button>
                            ) : (
                              <Button size="small" onClick={() => handleEditAddress(order.id, order.delivery_address)} sx={{ mr: 1 }}>
                                Edit
                              </Button>
                            )}
                            <Button color="error" size="small" onClick={() => handleDelete(order.id)} sx={{ mr: 1 }}>
                              Delete
                            </Button>
                            {!isOrderPaid(order.id) ? (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handlePayNowClick(order)}
                                disabled={payingOrderId === order.id}
                              >
                                {payingOrderId === order.id ? 'Processing...' : 'Pay Now'}
                              </Button>
                            ) : (
                              <Button variant="outlined" color="success" disabled>
                                Paid
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>,

                        <TableRow key={`${orderKey}-collapse`}>
                          <TableCell colSpan={7} sx={{ padding: 0 }}>
                            <Collapse in={openRows[order.id]} timeout="auto" unmountOnExit>
                              <Box margin={2}>
                                <Typography variant="subtitle1" gutterBottom>Ordered Items</Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Product</TableCell>
                                      <TableCell>Quantity</TableCell>
                                      <TableCell>Price</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {order.order_items.map((item: IOrderItem, idx: number) => (
                                      <TableRow key={`${orderKey}-item-${item.product_id}-${idx}`}>
                                        <TableCell>{getProductName(item.product_id)}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>₹{Number(item.price || 0).toLocaleString()}</TableCell>
                                      </TableRow>
                                    ))}


                                    {buyerReviews
                                      .filter(
                                        (review: IReview) =>
                                          review.order_id === order.id &&
                                          review.order_id !== null &&
                                          order.order_items.some((item: any) => item.product_id === review.product_id)
                                      )
                                      .filter(
                                        (review, index, self) =>
                                          index === self.findIndex((r) => r.id === review.id)
                                      )

                                      .map((review) => (
                                        <TableRow key={`review-${review.id}`}>
                                          <TableCell colSpan={4}>
                                            <Box
                                              sx={{
                                                p: 2,
                                                bgcolor: '#f9f9f9',
                                                mb: 1,
                                                borderRadius: 1,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                              }}
                                            >
                                              <Box>
                                                <Typography variant="body2">
                                                  <strong>Product:</strong> {getProductName(review.product_id)}
                                                </Typography>
                                                <Typography variant="body2">
                                                  <strong>Rating:</strong> {review.rating}
                                                </Typography>
                                                <Typography variant="body2">
                                                  <strong>Comment:</strong> {review.comment}
                                                </Typography>
                                              </Box>
                                              <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                  size="small"
                                                  color="error"
                                                  variant="outlined"
                                                  onClick={() => handleDeleteReview(review.id, review.product_id)}
                                                >
                                                  Delete
                                                </Button>
                                                <Button
                                                  size="small"
                                                  color="primary"
                                                  variant="outlined"
                                                  onClick={() =>
                                                    setReviewInputs((prev) => ({
                                                      ...prev,
                                                      [order.id]: {
                                                        product_id: review.product_id,
                                                        rating: review.rating,
                                                        comment: review.comment,
                                                        review_id: review.id,
                                                      },
                                                    }))
                                                  }
                                                >
                                                  Edit
                                                </Button>
                                              </Box>
                                            </Box>
                                          </TableCell>
                                        </TableRow>
                                      ))}

                                    {/* Add New Review */}
                                    {order.status === 'delivered' && (
                                      <TableRow key={`${orderKey}-add-review`}>
                                        <TableCell colSpan={4}>
                                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                            <FormControl size="small" sx={{ minWidth: 220 }}>
                                              <InputLabel id={`select-product-label-${order.id}`}></InputLabel>
                                              <Select
                                                labelId={`select-product-label-${order.id}`}
                                                value={reviewInputs[order.id]?.product_id || ''}
                                                onChange={(e) =>
                                                  handleReviewInputChange(order.id, 'product_id', e.target.value as string)
                                                }
                                                label="Select Product"
                                                displayEmpty
                                                MenuProps={{ disableAutoFocusItem: true }}
                                                sx={{
                                                  backgroundColor: '#f9f9f9',
                                                  borderRadius: 1,
                                                  '.MuiSelect-select': { padding: '8px 12px' },
                                                }}
                                              >
                                                <MenuItem disabled value="">
                                                  <em>Choose a product...</em>
                                                </MenuItem>
                                                {order.order_items.map((item: IOrderItem, idx: number) => (
                                                  <MenuItem key={`${orderKey}-dropdown-${item.product_id}-${idx}`} value={item.product_id}>
                                                    {getProductName(item.product_id)}
                                                  </MenuItem>
                                                ))}

                                              </Select>
                                            </FormControl>

                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                              <Typography variant="body2" sx={{ mr: 1 }}>Rating:</Typography>
                                              <Rating
                                                name={`rating-${order.id}`}
                                                value={Number(reviewInputs[order.id]?.rating || 0)}
                                                onChange={(_, newValue) =>
                                                  handleReviewInputChange(order.id, 'rating', newValue ?? 0)
                                                }
                                                size="small"
                                              />
                                            </Box>

                                            <TextField
                                              label="Comment"
                                              size="small"
                                              sx={{ minWidth: 200, flex: 1 }}
                                              value={reviewInputs[order.id]?.comment || ''}
                                              onChange={(e) =>
                                                handleReviewInputChange(order.id, 'comment', e.target.value)
                                              }
                                            />

                                            <Button
                                              size="small"
                                              variant="contained"
                                              onClick={() =>
                                                handleAddReview(order, reviewInputs[order.id]?.product_id)
                                              }
                                            >
                                              Send
                                            </Button>

                                            {reviewInputs[order.id]?.review_id && (
                                              <Button
                                                size="small"
                                                color="success"
                                                variant="contained"
                                                onClick={() =>
                                                  handleUpdateReview(reviewInputs[order.id].review_id, order.id)
                                                }
                                              >
                                                Update
                                              </Button>
                                            )}
                                          </Box>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      ];
                    })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* Payment Modal */}
      <Modal open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            zIndex: 1500,
          }}
        >
          <Typography variant="h6" mb={2}>Complete Your Payment</Typography>
          <Typography mb={1}><strong>Order ID:</strong> {selectedOrder?.id}</Typography>
          <Typography mb={1}><strong>Amount:</strong> ₹{calculateOrderTotal(selectedOrder?.order_items || []).toLocaleString()}</Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Method</InputLabel>
            <Select value={paymentMethod} label="Select Method" onChange={(e) => setPaymentMethod(e.target.value)}>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="Card">Card</MenuItem>
              <MenuItem value="NetBanking">NetBanking</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            color="success"
            sx={{ mt: 3 }}
            onClick={handleVerifyPayment}
          >
            Verify & Pay
          </Button>
        </Box>
      </Modal>

      <Box mt="auto"><BuyerFooter /></Box>
    </Box>
  );

};

export default BuyerOrders;
