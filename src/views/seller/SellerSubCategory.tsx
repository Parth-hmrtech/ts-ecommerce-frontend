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
import type { ICategory, ISubCategory } from '@/types/category.types';

const SellerSubCategory: React.FC = () => {
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

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const [editSubCategoryId, setEditSubCategoryId] = useState<string | null>(null);
  const [editSubCategoryName, setEditSubCategoryName] = useState<string>('');

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleAddSubCategory = () => {
    if (!newSubCategoryName.trim() || !selectedCategoryId) return;

    addSubCategory({
      category_id: selectedCategoryId,
      sub_category_name: newSubCategoryName
    })
      .unwrap()
      .then(() => {
        setNewSubCategoryName('');
        setSelectedCategoryId('');
        setShowAddForm(false);
        fetchSubCategories();

      })
      .catch((err: any) => console.error('Failed to add subcategory:', err));
  };

  const handleEditClick = (subcategory: ISubCategory) => {
    setEditSubCategoryId(subcategory.id);
    setEditSubCategoryName(subcategory.sub_category_name);
  };

  const handleEditSave = async () => {
    if (!editSubCategoryName.trim() || !editSubCategoryId) return;

    try {
      await updateSubCategory({
        id: editSubCategoryId,
        sub_category_name: editSubCategoryName,
      });

      setEditSubCategoryId(null);
      setEditSubCategoryName('');
      fetchSubCategories();
    } catch (err: any) {
      console.error('Update failed:', err);
    }
  };


  const handleEditCancel = () => {
    setEditSubCategoryId(null);
    setEditSubCategoryName('');
  };

  const handleDeleteClick = (id: string) => {
    setSubCategoryToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!subCategoryToDelete) return;

    deleteSubCategory(subCategoryToDelete)
      .then(() => {
        setConfirmOpen(false);
        setSubCategoryToDelete(null);
        fetchSubCategories();
      })
      .catch((err: any) => console.error('Delete failed:', err));
  };

  const filteredList: ISubCategory[] = Array.isArray(subCategories)
    ? subCategories.filter((sub) =>
      sub?.sub_category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const getCategoryName = (id: string): string => {
    const category = categories.find((cat: ICategory) => cat.id === id);
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
                  {categories.map((cat: ICategory) => (
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
                      <TableCell>
                        {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : 'N/A'}
                      </TableCell>
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
