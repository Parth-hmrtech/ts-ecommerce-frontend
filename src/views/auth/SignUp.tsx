import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import {
  Avatar,
  Box,
  Button,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, UploadFile } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuthentication from '@/hooks/useAuthentication';

interface IFormData {
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: 'buyer' | 'seller' | '';
  phone_number: string;
  image_url: string;
}

interface IErrors {
  [key: string]: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, loading, error, success, resetAuth } = useAuthentication();

  const [formData, setFormData] = useState<IFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password_hash: '',
    role: '',
    phone_number: '',
    image_url: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [errors, setErrors] = useState<IErrors>({});

  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

  useEffect(() => {
    if (success) {
      navigate('/signin');
      resetAuth();
    }
  }, [success, navigate, resetAuth]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'confirm_password') {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFormData((prev) => ({
      ...prev,
      [name]: value as 'buyer' | 'seller' | '',
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFormData((prev) => ({
        ...prev,
        image_url: file.name,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: IErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';

    if (!formData.password_hash) {
      newErrors.password_hash = 'Password is required';
    } else if (!strongPasswordRegex.test(formData.password_hash)) {
      newErrors.password_hash = 'Password must be 8+ chars, include uppercase, number, special char.';
    }

    if (!confirmPassword) {
      newErrors.confirm_password = 'Confirm password is required';
    } else if (formData.password_hash !== confirmPassword) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.image_url) newErrors.image_url = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = new FormData();
    (Object.keys(formData) as (keyof IFormData)[]).forEach((key) => {
      const value = formData[key];
      if (value !== undefined && value !== null) {
        payload.append(key, value.toString());
      }
    });

    if (imageFile) {
      payload.append('image', imageFile);
    }

    signUp(payload);
  };

  return (
    <Container maxWidth="sm">
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, width: '100%' }}>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Typography variant="h4" textAlign="center" fontWeight="bold" mb={3}>
              Create Account
            </Typography>

            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}

              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={imageFile ? URL.createObjectURL(imageFile) : ''}
                  alt="Profile"
                  sx={{ width: 56, height: 56 }}
                />
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFile />}
                >
                  Upload Image
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
              </Stack>
              {errors.image_url && <FormHelperText error>{errors.image_url}</FormHelperText>}

              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                error={!!errors.first_name}
                helperText={errors.first_name}
                fullWidth
              />

              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                error={!!errors.last_name}
                helperText={errors.last_name}
                fullWidth
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
              />

              <TextField
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                error={!!errors.phone_number}
                helperText={errors.phone_number}
                fullWidth
              />

              <TextField
                label="Password"
                name="password_hash"
                type={showPassword ? 'text' : 'password'}
                value={formData.password_hash}
                onChange={handleInputChange}
                error={!!errors.password_hash}
                helperText={errors.password_hash}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                name="confirm_password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirm_password}
                helperText={errors.confirm_password}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                        {showConfirm ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth error={!!errors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                  label="Role"
                >
                  <MenuItem value="buyer">Buyer</MenuItem>
                  <MenuItem value="seller">Seller</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ py: 1.5, borderRadius: 2 }}
                disabled={!!loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>

              <Typography variant="body2" textAlign="center">
                Already have an account?{' '}
                <Button variant="text" onClick={() => navigate('/signin')}>
                  Sign In
                </Button>
              </Typography>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
