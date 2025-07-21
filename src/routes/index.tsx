  import { createBrowserRouter } from 'react-router-dom';

  import Home from '@/pages/home';
import SignIn from '@/pages/auth/signIn';
import SignUp from '@/pages/auth/signUp';
import ForgotPassword from '@/pages/auth/forgotPassword';

import BuyerDashboard from "@/pages/buyer/buyerDashboard";
import BuyerProductDetail from "@/pages/buyer/buyerProductDetail";
import BuyerCart from "@/pages/buyer/buyerCart";
import BuyerOrders from "@/pages/buyer/buyerOrder";
import BuyerWishlist from "@/pages/buyer/buyerWishlist";
import BuyerProfile from "@/pages/buyer/buyerProfile";

import SellerDashboard from "@/pages/seller/sellerDashboard";
import SellerCategory from "@/pages/seller/sellerCategory";
import SellerSubCategory from "@/pages/seller/sellerSubCategory";
import SellerProducts from "@/pages/seller/sellerProduct";
import SellerOrderList from "@/pages/seller/sellerOrder";
import SellerProductImages from "@/pages/seller/sellerProductUploadImage";
import SellerPayments from "@/pages/seller/sellerPayment";
import SellerReview from "@/pages/seller/sellerReview";
import SellerProfile from "@/pages/seller/sellerProfile";

import ProtectedRoute from '@/utils/ProtectedRoute';

const AppRoutes = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },

  
  {
    element: <ProtectedRoute requiredRole="buyer" />,
    children: [
      {
        path: "/buyer-dashboard",
        element: <BuyerDashboard />,
      },
      {
        path: "/buyer-dashboard/product-details/:productId",
        element: <BuyerProductDetail />,
      },
      {
        path: "/buyer-dashboard/cart",
        element: <BuyerCart />,
      },
      {
        path: "/buyer-dashboard/orders",
        element: <BuyerOrders />,
      },
      {
        path: "/buyer-dashboard/wishlist",
        element: <BuyerWishlist />,
      },
      {
        path: "/buyer-dashboard/profile",
        element: <BuyerProfile />,
      },
    ],
  },
  

  
  {
    element: <ProtectedRoute requiredRole="seller" />,
    children: [
      {
        path: "/seller-dashboard",
        element: <SellerDashboard />,
      },
      {
        path: "/seller-dashboard/categories",
        element: <SellerCategory />,
      },
      {
        path: "/seller-dashboard/sub-categories",
        element: <SellerSubCategory />,
      },
      {
        path: "/seller-dashboard/products",
        element: <SellerProducts />,
      },
      {
        path: "/seller-dashboard/products/upload-images",
        element: <SellerProductImages />,
      },
      {
        path: "/seller-dashboard/orders",
        element: <SellerOrderList />,
      },
      {
        path: "/seller-dashboard/payments",
        element: <SellerPayments />,
      },
      {
        path: "/seller-dashboard/reviews",
        element: <SellerReview />,
      },
      {
        path: "/seller-dashboard/profile",
        element: <SellerProfile />,
      },
    ],
  },
  
]);

export default AppRoutes;
