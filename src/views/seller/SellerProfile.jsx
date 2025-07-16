import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Alert, InputAdornment,
  IconButton, Divider, Avatar, Stack
} from '@mui/material';
import {
  Visibility, VisibilityOff, Person, Edit, LockReset, PhotoCamera
} from '@mui/icons-material';

import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Footer from '@/components/common/Footer';
import useUserProfile from '@/hooks/useUser';

const SellerProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const userId = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user'))?.id || null;
    } catch {
      return null;
    }
  }, []);

  const {
    profile,
    fetchUserProfile,
    updateUserProfile,
    resetUserPassword,
    loading,
    alertType,
    message,
  } = useUserProfile();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    image: null,
    image_url: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [passwordResetMessage, setPasswordResetMessage] = useState('');
  const [passwordResetSeverity, setPasswordResetSeverity] = useState('error');
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateAlertType, setUpdateAlertType] = useState('success');

  useEffect(() => {
    if (userId) fetchUserProfile(userId);
  }, [userId]);

  useEffect(() => {
    const user = profile?.user;
    if (user) {
      const { first_name, last_name, email, phone_number, image_url } = user;
      setFormData({
        first_name: first_name || '',
        last_name: last_name || '',
        email: email || '',
        phone_number: phone_number || '',
        image: null,
        image_url: image_url || '',
      });

      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [profile]);

  const validateForm = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email';
    }
    if (!formData.phone_number.trim()) errors.phone_number = 'Phone number is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm() || !userId) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        data.append('image', value);
      } else if (key !== 'image_url') {
        data.append(key, value);
      }
    });

    try {
      const res = await updateUserProfile({ id: userId, data }).unwrap();
      fetchUserProfile(userId);
      const msg = res?.data?.message || res?.message;
      setUpdateAlertType('success');
      setUpdateMessage(msg);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message;
      setUpdateAlertType('error');
      setUpdateMessage(msg);
    } finally {
      setTimeout(() => setUpdateMessage(''), 3000);
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!oldPassword) errors.oldPassword = 'Old password required';
    if (!newPassword) {
      errors.newPassword = 'New password required';
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(newPassword)) {
      errors.newPassword = 'Min 8 chars, 1 uppercase, 1 special char';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordReset = async () => {
    if (!validatePassword()) return;
    setResetting(true);
    setPasswordResetMessage('');

    try {
      const res = await resetUserPassword({ oldPassword, newPassword }).unwrap();
      const msg = res?.data?.message || res?.message;
      const isError = /incorrect|not match|wrong/i.test(msg);
      setPasswordResetSeverity(isError ? 'warning' : 'success');
      setPasswordResetMessage(msg);
      if (!isError) {
        setOldPassword('');
        setNewPassword('');
      }
    } catch (err) {
      const msg = err?.response?.data?.message;
      setPasswordResetSeverity('error');
      setPasswordResetMessage(msg);
    } finally {
      setResetting(false);
      setTimeout(() => setPasswordResetMessage(''), 3000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        image_url: URL.createObjectURL(file),
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}>
        <Sidebar open={sidebarOpen} />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 1200, mx: 'auto', display: 'flex', flexDirection: 'row', gap: 4 }}>
            {/* Profile Info */}
            <Box component={Paper} elevation={2} sx={{ p: 3, borderRadius: 3, flex: 1, bgcolor: '#fafafa' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={profile?.user?.image_url} sx={{ width: 80, height: 80 }} />
                <Typography variant="h6" fontWeight="bold">
                  <Person fontSize="small" /> Seller Info
                </Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
              {['first_name', 'last_name', 'email', 'phone_number'].map((field) => (
                <Typography key={field} sx={{ mt: 1 }}>
                  <strong>{field.replace('_', ' ').toUpperCase()}:</strong> {profile?.user?.[field] || '—'}
                </Typography>
              ))}
            </Box>

            {/* Edit Form */}
            <Box sx={{ flex: 2 }}>
              <Typography variant="h6"><Edit color="primary" /> Edit Profile</Typography>
              <Divider sx={{ my: 2 }} />
              {updateMessage && (
                <Alert severity={updateAlertType} sx={{ mb: 2 }}>{updateMessage}</Alert>
              )}
              <TextField label="First Name" name="first_name" fullWidth value={formData.first_name} onChange={handleChange}
                margin="normal" error={!!formErrors.first_name} helperText={formErrors.first_name} />
              <TextField label="Last Name" name="last_name" fullWidth value={formData.last_name} onChange={handleChange}
                margin="normal" error={!!formErrors.last_name} helperText={formErrors.last_name} />
              <TextField label="Email" name="email" fullWidth value={formData.email} onChange={handleChange}
                margin="normal" error={!!formErrors.email} helperText={formErrors.email} />
              <TextField label="Phone Number" name="phone_number" fullWidth value={formData.phone_number} onChange={handleChange}
                margin="normal" error={!!formErrors.phone_number} helperText={formErrors.phone_number} />

              <Box mt={2} display="flex" alignItems="center" gap={2}>
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} />
                )}
                <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
                  Upload Image
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                <Button variant="contained" onClick={handleUpdate} disabled={loading === 'userProfile/update'}>
                  {loading === 'userProfile/update' ? 'Updating...' : 'Update'}
                </Button>
              </Box>

              <Typography variant="h6" sx={{ mt: 4 }}><LockReset color="error" /> Reset Password</Typography>
              <Divider sx={{ my: 2 }} />
              {passwordResetMessage && (
                <Alert severity={passwordResetSeverity} sx={{ mb: 2 }}>
                  {passwordResetMessage}
                </Alert>
              )}
              <TextField
                label="Old Password"
                type={showOldPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                error={!!passwordErrors.oldPassword}
                helperText={passwordErrors.oldPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowOldPassword((prev) => !prev)}>
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!passwordErrors.newPassword}
                helperText={passwordErrors.newPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPassword((prev) => !prev)}>
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePasswordReset}
                sx={{ mt: 2 }}
                disabled={resetting}
              >
                {resetting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default SellerProfile;
