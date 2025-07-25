import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Alert,
  FormHelperText,
  Container,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import useAuthentication from '@/hooks/useAuthentication';
import ecommerceLogo from '@/assets/images/ecommerce-logo.png';

type RoleType = 'buyer' | 'seller' | '';

interface SignInFormData {
  email: string;
  password: string;
  role: RoleType;
}

interface FieldErrors {
  email: string;
  password: string;
  role: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, error, signIn } = useAuthentication();

  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
    role: '',
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    email: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      if (user.role === 'buyer') {
        navigate('/buyer-dashboard');
      } else if (user.role === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showFieldError = (field: keyof FieldErrors, message: string) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
    setTimeout(() => {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }, 3000);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;

    if (!formData.email.trim()) {
      showFieldError('email', 'Email is required');
      hasError = true;
    }

    if (!formData.password.trim()) {
      showFieldError('password', 'Password is required');
      hasError = true;
    }

    if (!formData.role) {
      showFieldError('role', 'Please select role');
      hasError = true;
    }

    if (hasError) return;

    signIn({
      ...formData,
      role: formData.role === '' ? undefined : (formData.role as 'buyer' | 'seller'),
    });
  };

  return (
    <Container maxWidth="sm">
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, width: '100%' }}>
          <Box textAlign="center" mb={3}>
            <Box
              component="img"
              src={ecommerceLogo}
              alt="Ecommerce Logo"
              sx={{ height: 60, mb: 1, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
            <Typography variant="h4" fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please sign in to your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth error={!!fieldErrors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="buyer">Buyer</MenuItem>
                  <MenuItem value="seller">Seller</MenuItem>
                </Select>
                {fieldErrors.role && (
                  <FormHelperText>{fieldErrors.role}</FormHelperText>
                )}
              </FormControl>

              <Box textAlign="right">
                <Button
                  variant="text"
                  onClick={() => navigate('/forgot-password')}
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto', fontSize: '0.875rem' }}
                >
                  Forgot password?
                </Button>
              </Box>

              <Button
                variant="contained"
                fullWidth
                type="submit"
                size="large"
                sx={{ py: 1.5, borderRadius: 2 }}
                disabled={!!loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Stack>
          </form>

          <Typography variant="body2" align="center" mt={3}>
            Don’t have an account yet?{' '}
            <Button
              variant="text"
              onClick={() => navigate('/signup')}
              sx={{ textTransform: 'none', p: 0, minWidth: 'auto', fontSize: '0.875rem' }}
            >
              Sign Up
            </Button>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignIn;
