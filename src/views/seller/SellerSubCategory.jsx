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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Footer from '@/components/common/Footer';

import useSellerCategory from '@/hooks/useCategory';

const SellerSubCategory = () => {
  const {
    subCategories,
    subCategoryLoading,
    subCategoryError,
    fetchSubCategories,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    categories,
    fetchCategories,
  } = useSellerCategory();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const [editSubCategoryId, setEditSubCategoryId] = useState(null);
  const [editSubCategoryName, setEditSubCategoryName] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleAddSubCategory = () => {
    if (!newSubCategoryName.trim() || !selectedCategoryId) return;

    addSubCategory(selectedCategoryId, newSubCategoryName)
      .unwrap()
      .then(() => {
        setNewSubCategoryName('');
        setSelectedCategoryId('');
        setShowAddForm(false);
      })
      .catch((err) => console.error('Failed to add subcategory:', err));
  };

  const handleEditClick = (subcategory) => {
    setEditSubCategoryId(subcategory.id);
    setEditSubCategoryName(subcategory.sub_category_name);
  };

  const handleEditSave = () => {
    if (!editSubCategoryName.trim()) return;

    updateSubCategory(editSubCategoryId, null, editSubCategoryName)
      .unwrap()
      .then(() => {
        setEditSubCategoryId(null);
        setEditSubCategoryName('');
        dispatch(fetchSubCategories());
      })
      .catch((err) => console.error('Update failed:', err));
  };

  const handleEditCancel = () => {
    setEditSubCategoryId(null);
    setEditSubCategoryName('');
  };

  const handleDeleteClick = (id) => {
    setSubCategoryToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    deleteSubCategory(subCategoryToDelete)
      .unwrap()
      .then(() => {
        setConfirmOpen(false);
        setSubCategoryToDelete(null);
        fetchSubCategories();
      })
      .catch((err) => console.error('Delete failed:', err));
  };

  const filteredList = Array.isArray(subCategories)
    ? subCategories.filter(
      (sub) =>
        sub?.sub_category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];


  const getCategoryName = (id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.category_name : '-';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />

      <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}>
        <Sidebar open={sidebarOpen} />

        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">Subcategories</Typography>
            <Button variant="contained" onClick={() => setShowAddForm((prev) => !prev)}>
              {showAddForm ? 'Cancel' : 'Add Subcategory'}
            </Button>
          </Box>

          {showAddForm && (
            <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Subcategory Name"
                variant="outlined"
                size="small"
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
              />

              <Button variant="contained" color="success" onClick={handleAddSubCategory}>
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

          {subCategoryLoading ? (
            <CircularProgress />
          ) : subCategoryError ? (
            <Typography color="error">{subCategoryError}</Typography>
          ) : filteredList.length === 0 ? (
            <Typography>No subcategories found.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>#</strong></TableCell>
                    <TableCell><strong>Subcategory Name</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell><strong>Created At</strong></TableCell>
                    <TableCell><strong>Updated At</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredList.map((sub, index) => (
                    <TableRow key={sub.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {editSubCategoryId === sub.id ? (
                          <TextField
                            value={editSubCategoryName}
                            onChange={(e) => setEditSubCategoryName(e.target.value)}
                            size="small"
                          />
                        ) : (
                          sub.sub_category_name
                        )}
                      </TableCell>
                      <TableCell>{getCategoryName(sub.category_id)}</TableCell>
                      <TableCell>{new Date(sub.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{sub.updatedAt ? new Date(sub.updatedAt).toLocaleString() : '-'}</TableCell>
                      <TableCell align="right">
                        {editSubCategoryId === sub.id ? (
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
                            <Button variant="outlined" size="small" onClick={handleEditCancel}>
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
                              onClick={() => handleEditClick(sub)}
                            />
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteClick(sub.id)}
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
            Are you sure you want to delete this subcategory?
          </DialogContentText>
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

export default SellerSubCategory;
