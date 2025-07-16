import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/store/reducers/auth.reducer';
// import cartReducer from '@/store/reducers/cart.reducer';
// import categoryReducer from '@/store/reducers/category.reducer';
// import orderReducer from '@/store/reducers/order.reducer';
// import paymentReducer from '@/store/reducers/payment.reducer';
import productReducer from '@/store/reducers/product.reducer';
// import reviewReducer from '@/store/reducers/review.reducer';
// import userReducer from '@/store/reducers/user.reducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // cart: cartReducer,
    // category: categoryReducer,
    // order: orderReducer,
    // payment: paymentReducer,
    product: productReducer,
    // review: reviewReducer,
    // user: userReducer,
  },
  devTools: true,
});

// 👇 Export types for use across app (especially with hooks)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
