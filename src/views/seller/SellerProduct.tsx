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
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';

import useSellerProduct from '@/hooks/useProduct';
import type { IAddProduct, IProduct, IUpdateProduct } from '@/types/product.types';
import type { ICategory, ISubCategory } from '@/types/category.types';

const SellerProduct: React.FC = () => {
  const {
    addSellerProduct,
    deleteSellerProduct,
    updateSellerProduct,
    fetchSellerCategories,
    fetchSellerSubcategoriesByCategoryId,
    sellerProducts,
    sellerCategories,
    sellerSubcategories,
    sellerLoading,
    sellerError,
  } = useSellerProduct();

  const loading = sellerLoading;
  const error = sellerError;

  const products: IProduct[] = sellerProducts;
  const categories: ICategory[] = sellerCategories;
  const subcategories: ISubCategory[] = sellerSubcategories;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>>({
    product_name: '',
    description: '',
    price: '',
    quantity: '',
    category_id: '',
    subcategory_id: '',
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<IProduct>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // fetchSellerProducts();
    fetchSellerCategories();
  }, []);

  useEffect(() => {
    if (formData.category_id) {
      fetchSellerSubcategoriesByCategoryId(formData.category_id).then((res) => {
        const subList = Array.isArray(res?.payload) ? (res.payload as ISubCategory[]) : [];

        const isSubcategoryValid = subList.some(
          (sub: ISubCategory) => sub.id === formData.subcategory_id
        );

        if (!isSubcategoryValid) {
          setFormData((prev) => ({ ...prev, subcategory_id: '' }));
        }
      });
    } else {
      setFormData((prev) => ({ ...prev, subcategory_id: '' }));
    }
  }, [formData.category_id]);

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleAdd = () => {
    const { product_name, price, description, quantity, category_id, subcategory_id } = formData;

    if (
      !product_name.trim() ||
      !description.trim() ||
      !price ||
      !quantity ||
      !category_id ||
      !subcategory_id
    ) {
      return;
    }

    const payload: IAddProduct = {
      product_name: product_name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      category_id,
      subcategory_id,
    };

    addSellerProduct(payload).then(() => {
      setFormData({
        product_name: '',
        description: '',
        price: '',
        quantity: '',
        category_id: '',
        subcategory_id: '',
      });
      setShowAddForm(false);
    });
  };

  const handleEditClick = (product: IProduct) => {
    setEditId(product.id);
    setEditData(product);
  };

  const handleEditSave = () => {
    if (!editId) return;

    const { product_name, description, price, quantity, category_id, subcategory_id } = editData;

    if (
      !product_name?.trim() ||
      !description?.trim() ||
      !price ||
      !quantity ||
      !category_id ||
      !subcategory_id
    ) {
      return;
    }

    const updatedPayload: IUpdateProduct = {
      id: String(editId),
      product_name: product_name.trim(),
      description: description.trim(),
      price: parseFloat(String(price)),
      quantity: parseInt(String(quantity), 10),
      category_id: String(category_id),
      subcategory_id: String(subcategory_id),
    };

    updateSellerProduct(updatedPayload).then(() => {
      setEditId(null);
      setEditData({});
    });
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({});
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    deleteSellerProduct(productToDelete).then(() => {
      setConfirmOpen(false);
      setProductToDelete(null);
    });
  };

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const user = localStorage.getItem("user");
  const currentSellerId = user ? JSON.parse(user)?.id : '';
  const filteredList: IProduct[] = Array.isArray(products)
    ? products.filter((p) =>
      p.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      String(p.seller_id) === currentSellerId
    )
    : [];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />
      <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}>
        <Sidebar open={sidebarOpen} />
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">Products</Typography>
            <Button variant="contained" onClick={() => setShowAddForm((prev) => !prev)}>
              {showAddForm ? 'Cancel' : 'Add Product'}
            </Button>
          </Box>

          {showAddForm && (
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category_id}
                  label="Category"
                  onChange={(e: SelectChangeEvent) =>
                    setFormData({ ...formData, category_id: e.target.value, subcategory_id: '' })
                  }
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={formData.subcategory_id}
                  label="Subcategory"
                  onChange={(e: SelectChangeEvent) =>
                    setFormData({ ...formData, subcategory_id: e.target.value })
                  }
                  disabled={!formData.category_id}
                >
                  {formData.category_id && subcategories.length > 0 ? (
                    subcategories.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_category_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      {formData.category_id ? 'No Subcategories Found' : 'Select Category First'}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

              <TextField
                label="Name"
                size="small"
                value={formData.product_name}
                onChange={(e) =>
                  setFormData({ ...formData, product_name: e.target.value })
                }
              />
              <TextField
                label="Description"
                size="small"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <TextField
                label="Price"
                size="small"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />
              <TextField
                label="Quantity"
                size="small"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
              />
              <Button variant="contained" color="success" onClick={handleAdd}>
                Save
              </Button>
            </Box>
          )}

          <TextField
            label="Search by Name"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 2, maxWidth: 400 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filteredList.length === 0 ? (
            <Typography>{searchTerm ? 'No products found.' : 'No products available.'}</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Updated</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredList.map((product, index) => {
                    const isEditing = editId === product.id;
                    return (
                      <TableRow key={product.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {isEditing ? (
                            <TextField
                              size="small"
                              value={editData.product_name}
                              onChange={(e) =>
                                setEditData({ ...editData, product_name: e.target.value })
                              }
                            />
                          ) : (
                            product.product_name
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <TextField
                              size="small"
                              multiline
                              value={editData.description || ''}
                              onChange={(e) =>
                                setEditData({ ...editData, description: e.target.value })
                              }
                            />
                          ) : expandedDescriptions[product.id] ? (
                            product.description
                          ) : (
                            `${product.description?.slice(0, 50)}${product.description && product.description.length > 50 ? '...' : ''}`
                          )}
                          {!isEditing &&
                            product.description &&
                            product.description.length > 50 && (
                              <Button
                                onClick={() => toggleDescription(product.id)}
                                size="small"
                                sx={{ textTransform: 'none', ml: 1 }}
                              >
                                {expandedDescriptions[product.id] ? 'Less' : 'More'}
                              </Button>
                            )}
                        </TableCell>
                        <TableCell>{isEditing ? (
                          <TextField
                            type="number"
                            size="small"
                            value={editData.price}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        ) : (
                          product.price
                        )}</TableCell>
                        <TableCell>{isEditing ? (
                          <TextField
                            type="number"
                            size="small"
                            value={editData.quantity}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                quantity: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        ) : (
                          product.quantity
                        )}</TableCell>
                        <TableCell>
                          {product.createdAt
                            ? new Date(product.createdAt).toLocaleString()
                            : '—'}
                        </TableCell>
                        <TableCell>
                          {product.updatedAt
                            ? new Date(product.updatedAt).toLocaleString()
                            : '—'}
                        </TableCell>
                        <TableCell align="right">
                          {isEditing ? (
                            <>
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                sx={{ mr: 1 }}
                                onClick={handleEditSave}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={handleEditCancel}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                sx={{ mr: 1 }}
                                startIcon={<EditIcon />}
                                onClick={() => handleEditClick(product)}
                              />
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteClick(product.id)}
                              />
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this product?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default SellerProduct;
