  import { createBrowserRouter } from 'react-router-dom';

  import Home from '@/pages/home';
import SignIn from '@/pages/auth/signIn';
import SignUp from '@/pages/auth/signUp';
import ForgotPassword from '@/pages/auth/forgotPassword';

import BuyerDashboard from "@/pages/buyer/buyerDashboard";
// import BuyerProductDetail from "../views/buyer/BuyerProductDetail";
import BuyerCart from "@/pages/buyer/buyerCart";
// import BuyerOrders from "../views/buyer/BuyerOrders";
// import BuyerWishlist from "../views/buyer/Buyerwishlist";
// import BuyerProfile from "../views/buyer/BuyerProfile";

// import SellerDashboard from "../pages/seller/sellerDashboard";
// import SellerCategory from "../views/seller/SellerCategory";
// import SellerSubCategory from "../views/seller/SellerSubCategory";
// import SellerProducts from "../views/seller/SellerProduct";
// import SellerOrderList from "../views/seller/SellerOrder";
// import SellerProductImages from "../views/seller/SellerProductUploadImage";
// import SellerPayments from "../views/seller/SellerPayment";
// import SellerReview from "../views/seller/SellerReview";
// import SellerProfile from "../views/seller/SellerProfile";

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

  // Buyer routes (disabled for now)
  
  {
    element: <ProtectedRoute requiredRole="buyer" />,
    children: [
      {
        path: "/buyer-dashboard",
        element: <BuyerDashboard />,
      },
      // {
      //   path: "/buyer-dashboard/product-details/:productId",
      //   element: <BuyerProductDetail />,
      // },
      {
        path: "/buyer-dashboard/cart",
        element: <BuyerCart />,
      },
      // {
      //   path: "/buyer-dashboard/orders",
      //   element: <BuyerOrders />,
      // },
      // {
      //   path: "/buyer-dashboard/wishlist",
      //   element: <BuyerWishlist />,
      // },
      // {
      //   path: "/buyer-dashboard/profile",
      //   element: <BuyerProfile />,
      // },
    ],
  },
  

  // Seller routes (disabled for now)
  /*
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
  */
]);

export default AppRoutes;
