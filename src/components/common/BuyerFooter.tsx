import { Box, Typography } from '@mui/material';

const BuyerFooter = () => {
return (
    <Box
      component="footer"
      sx={{
        textAlign: 'center',
        p: 2,
        bgcolor: '#f1f1f1',
        borderTop: '1px solid #ddd',
        mt: 'auto',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} My eCommerce. All rights reserved.
      </Typography>
    </Box>
  );
};

export default BuyerFooter;
