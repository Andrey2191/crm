import { combineReducers } from '@reduxjs/toolkit';
import orderSlice from './orders/orderSlice';



const rootReducer = combineReducers({
    orders: orderSlice
});

export default rootReducer;