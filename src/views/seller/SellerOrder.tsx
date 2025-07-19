import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Collapse,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';

import useSellerOrder from '@/hooks/useOrder';
import type { IOrder } from '@/types/order.types';
import type { IProduct } from '@/types/product.types';

const SellerOrderList: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);

  const {
    sellerOrders,
    sellerProducts,
    fetchSellerOrders,
    fetchSellerProducts,
    updateOrderStatus,
  } = useSellerOrder();

  const orders: IOrder[] = sellerOrders || [];
  const productList: IProduct[] = sellerProducts || [];

  useEffect(() => {
    fetchSellerOrders();
    fetchSellerProducts();
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleRow = (index: number) => {
    setOpenRowIndex(openRowIndex === index ? null : index);
  };

  const getProductName = (productId: string): string => {
    const product = productList.find((p) => p.id === productId);
    return product ? product.product_name : 'Unknown Product';
  };

  const getProductPrice = (productId: string): number => {
    const product = productList.find((p) => p.id === productId);
    return product?.price || 0;
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {      
      await updateOrderStatus({ id: orderId, status: newStatus } as IOrder);
      await fetchSellerOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const sellerProductIds = productList.map((product) => product.id);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />

      <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}>
        <Sidebar open={sidebarOpen} />

        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h5" gutterBottom>
            Seller Orders
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                <TableRow>
                  <TableCell />
                  <TableCell>Order ID</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total (Your Products)</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Change Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders
                  .filter((order) =>
                    order.order_items?.some((item) =>
                      sellerProductIds.includes(item.product_id)
                    )
                  )
                  .map((order, index) => {
                    const sellerItems = order.order_items.filter((item) =>
                      sellerProductIds.includes(item.product_id)
                    );

                    const sellerTotal = sellerItems.reduce((total, item) => {
                      const price = getProductPrice(item.product_id);
                      return total + price * item.quantity;
                    }, 0);

                    return (
                      <React.Fragment key={order.id}>
                        <TableRow>
                          <TableCell>
                            <IconButton size="small" onClick={() => toggleRow(index)}>
                              {openRowIndex === index ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </TableCell>

                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.delivery_address}</TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                textTransform: 'capitalize',
                                fontWeight: 500,
                                color:
                                  order.status === 'pending'
                                    ? 'orange'
                                    : order.status === 'delivered'
                                    ? 'green'
                                    : order.status === 'cancelled'
                                    ? 'red'
                                    : 'black',
                              }}
                            >
                              {order.status}
                            </Typography>
                          </TableCell>
                          <TableCell>₹{sellerTotal.toFixed(2)}</TableCell>
                          <TableCell>{new Date(order.order_date).toLocaleString()}</TableCell>
                          <TableCell>
                            <Select
                              size="small"
                              value={order.status?.toLowerCase() || 'pending'}
                              onChange={(e: SelectChangeEvent<string>) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                              
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="accepted">Accepted</MenuItem>
                              <MenuItem value="shipped">Shipped</MenuItem>
                              <MenuItem value="delivered">Delivered</MenuItem>
                              <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell colSpan={7} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                            <Collapse in={openRowIndex === index} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 1 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Your Items
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Product ID</TableCell>
                                      <TableCell>Product Name</TableCell>
                                      <TableCell>Price</TableCell>
                                      <TableCell>Quantity</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {sellerItems.map((item) => (
                                      <TableRow key={item.product_id}>
                                        <TableCell>{item.product_id}</TableCell>
                                        <TableCell>{getProductName(item.product_id)}</TableCell>
                                        <TableCell>₹{getProductPrice(item.product_id)}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default SellerOrderList;
