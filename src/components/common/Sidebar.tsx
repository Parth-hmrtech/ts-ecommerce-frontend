import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Subtitles as SubtitlesIcon,
  Inventory as InventoryIcon,
  ReceiptLong as ReceiptLongIcon,
  Payment as PaymentIcon,
  RateReview as ReviewsIcon,
  Logout as LogoutIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 220;

interface SidebarProps {
  open: boolean;
}

const Sidebar = ({ open }: SidebarProps) => {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState<boolean>(false);

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          transition: 'width 0.3s',
          boxSizing: 'border-box',
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Toolbar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', mt: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/seller-dashboard')}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/seller-dashboard/categories')}>
              <ListItemIcon><CategoryIcon /></ListItemIcon>
              <ListItemText primary="Categories" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/seller-dashboard/sub-categories')}>
              <ListItemIcon><SubtitlesIcon /></ListItemIcon>
              <ListItemText primary="Sub Categories" />
            </ListItemButton>
          </ListItem>

          <ListItem
            disablePadding
            onMouseEnter={() => setShowUpload(true)}
            onMouseLeave={() => setShowUpload(false)}
          >
            <Box sx={{ width: '100%' }}>
              <ListItemButton onClick={() => navigate('/seller-dashboard/products')}>
                <ListItemIcon><InventoryIcon /></ListItemIcon>
                <ListItemText primary="Products" />
              </ListItemButton>

              <Collapse in={showUpload} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 6, gap: 1, minHeight: 36 }}
                    onClick={() => navigate('/seller-dashboard/products/upload-images')}
                  >
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <ImageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Upload Image"
                      primaryTypographyProps={{ fontSize: 14 }}
                    />
                  </ListItemButton>
                </List>
              </Collapse>
            </Box>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/seller-dashboard/orders')}>
              <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/seller-dashboard/payments')}>
              <ListItemIcon><PaymentIcon /></ListItemIcon>
              <ListItemText primary="Payments" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/seller-dashboard/reviews')}>
              <ListItemIcon><ReviewsIcon /></ListItemIcon>
              <ListItemText primary="Reviews" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/signin');
              }}
            >
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
