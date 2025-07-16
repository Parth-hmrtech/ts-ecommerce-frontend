import React, { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Stack,
  Alert,
  MenuItem,
  CircularProgress,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthentication from '@/hooks/useAuthentication';

type RoleType = 'buyer' | 'seller' | '';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const {
    forgotPassword,
    resetAuth,
    loading,
    error,
    message,
    success,
  } = useAuthentication();
  
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<RoleType>(''); // 'buyer' | 'seller' | ''
  const [emailError, setEmailError] = useState<string>('');
  const [roleError, setRoleError] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!role) {
      setRoleError('Role is required');
      isValid = false;
    } else {
      setRoleError('');
    }

    if (!isValid) return;

    if (role === '') return;
    forgotPassword({ email, role });
  };

  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value as RoleType);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Reset auth state on unmount
  useEffect(() => {
    return () => {
      resetAuth();
    };
  }, [resetAuth]);

  // Redirect on success
  useEffect(() => {
      console.log("sucess",success);

    if (success) {
      const timer = setTimeout(() => {
        resetAuth();
        navigate('/signin');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, resetAuth, navigate]);

  return (
    <Container maxWidth="sm">
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            width: '100%',
            backgroundColor: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Forgot Password
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter your registered email and role
                </Typography>
              </Box>

              {error && <Alert severity="error">{error}</Alert>}
              {success && message && <Alert severity="success">{message}</Alert>}

              <TextField
                select
                label="Select Role"
                value={role}
                onChange={handleRoleChange}
                fullWidth
                error={!!roleError}
                helperText={roleError}
                disabled={!!loading}
              >
                <MenuItem value="buyer">Buyer</MenuItem>
                <MenuItem value="seller">Seller</MenuItem>
              </TextField>

              <TextField
                type="email"
                label="Enter your registered email"
                fullWidth
                value={email}
                onChange={handleEmailChange}
                disabled={!!loading}
                error={!!emailError}
                helperText={emailError}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!!loading}
                sx={{ py: 1.5, borderRadius: 2 }}
                startIcon={
                  loading ? <CircularProgress size={20} color="inherit" /> : undefined
                }
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <Typography variant="body2" align="center">
                <Link
                  component="button"
                  underline="hover"
                  onClick={() => navigate('/signin')}
                >
                  Back to Sign In
                </Link>
              </Typography>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
