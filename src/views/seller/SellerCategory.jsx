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
  TableSortLabel
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';

import { useDispatch } from 'react-redux';
import {
  fetchAllCategoriesAction,
  addCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from '@/store/actions/category.action';

import useSellerCategory from '@/hooks/useCategory';

const SellerCategory = () => {
  const dispatch = useDispatch();
  const {
    categories: list = [],
    categoryLoading: loading,
    categoryError: error,
  } = useSellerCategory();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    dispatch(fetchAllCategoriesAction());
  }, [dispatch]);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    dispatch(addCategoryAction({ category_name: newCategoryName }))
      .unwrap()
      .then(() => {
        setNewCategoryName('');
        setShowAddForm(false);
        dispatch(fetchAllCategoriesAction());
      })
      .catch((err) => console.error('Failed to add category:', err));
  };

  const handleEditClick = (category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.category_name);
  };

  const handleEditSave = () => {
    if (!editCategoryName.trim()) return;
    dispatch(updateCategoryAction({ id: editCategoryId, category_name: editCategoryName }))
      .unwrap()
      .then(() => {
        setEditCategoryId(null);
        setEditCategoryName('');
        dispatch(fetchAllCategoriesAction());
      })
      .catch((err) => console.error('Update failed:', err));
  };

  const handleEditCancel = () => {
    setEditCategoryId(null);
    setEditCategoryName('');
  };

  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;
    dispatch(deleteCategoryAction(categoryToDelete))
      .unwrap()
      .then(() => {
        dispatch(fetchAllCategoriesAction());
        setConfirmOpen(false);
        setCategoryToDelete(null);
      })
      .catch((err) => {
        console.error('Delete failed:', err);
        alert(`Delete failed: ${err.message || err}`);
      });
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortField(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const filteredList = list
    .filter((category) =>
      category.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      const normalizedA = typeof aVal === 'string' ? aVal.toLowerCase() : new Date(aVal);
      const normalizedB = typeof bVal === 'string' ? bVal.toLowerCase() : new Date(bVal);
      return (normalizedA < normalizedB ? -1 : normalizedA > normalizedB ? 1 : 0) *
        (sortDirection === 'asc' ? 1 : -1);
    });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />
      <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}>
        <Sidebar open={sidebarOpen} />
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Categories</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowAddForm((prev) => !prev)}
            >
              {showAddForm ? 'Cancel' : 'Add Category'}
            </Button>
          </Box>

          {showAddForm && (
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Category Name"
                variant="outlined"
                size="small"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                sx={{ mr: 2 }}
              />
              <Button variant="contained" color="success" onClick={handleAddCategory}>
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
            <Typography>No matching categories found.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell sortDirection={sortField === 'category_name' ? sortDirection : false}>
                      <TableSortLabel
                        active={sortField === 'category_name'}
                        direction={sortDirection}
                        onClick={() => handleSort('category_name')}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={sortField === 'createdAt' ? sortDirection : false}>
                      <TableSortLabel
                        active={sortField === 'createdAt'}
                        direction={sortDirection}
                        onClick={() => handleSort('createdAt')}
                      >
                        Created At
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={sortField === 'updatedAt' ? sortDirection : false}>
                      <TableSortLabel
                        active={sortField === 'updatedAt'}
                        direction={sortDirection}
                        onClick={() => handleSort('updatedAt')}
                      >
                        Updated At
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredList.map((category, index) => (
                    <TableRow key={category.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {editCategoryId === category.id ? (
                          <TextField
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            size="small"
                          />
                        ) : (
                          category.category_name
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(category.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {category.updatedAt
                          ? new Date(category.updatedAt).toLocaleString()
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {editCategoryId === category.id ? (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={handleEditSave}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
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
                              color="primary"
                              size="small"
                              onClick={() => handleEditClick(category)}
                              sx={{ mr: 1 }}
                              startIcon={<EditIcon />}
                            />
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDeleteClick(category.id)}
                              startIcon={<DeleteIcon />}
                            />
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default SellerCategory;
