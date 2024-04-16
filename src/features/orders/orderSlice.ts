import { createSlice, createAsyncThunk, createAction, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { Product } from '../../types/types';

const API_KEY = process.env.REACT_APP_API_KEY
const URL = process.env.REACT_APP_URL

interface AddressSuggestion {
    value: string;
}

interface OrderState {
    address: string;
    suggestions: AddressSuggestion[];
    loading: boolean;
    error: string | null;
    orders: any[];
    orderCost: number;
    deliveryCost: number;
    totalCost: number;
    status: string
}

const initialState: OrderState = {
    address: '',
    suggestions: [],
    loading: false,
    error: null,
    orders: [],
    orderCost: 0,
    deliveryCost: 0,
    totalCost: 0,
    status: ''
};

export const fetchAddressSuggestions = createAsyncThunk(
    'order/fetchAddressSuggestions',
    async (address: string, thunkAPI) => {
        
        try {
            const response = await axios.post(`${[URL]}`, {
                query: address
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Token ${API_KEY}`
                }
            });
            return response.data.suggestions;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.error);
        }
    }
);

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData: any, thunkAPI) => {
        try {
            const { products } = orderData;
            let orderCost = 0;
            products.forEach((product: Product) => {
                orderCost += product.quantity * product.price;
            });
            const totalCost = orderCost + orderData.deliveryCost;
            return {
                ...orderData,
                orderCost,
                totalCost,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.error);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setAddress: (state, action) => {
            state.address = action.payload;
        },
        clearSuggestions: (state) => {
            state.suggestions = [];
        },
        cancelOrder: (state, action: PayloadAction<string>) => {
            const orderId = action.payload;
            state.orders = state.orders.map(order => {
                if (order.id === orderId) {
                    return { ...order, status: 'Отменен' };
                }
                return order;
            });
        },
        completeOrder: (state, action: PayloadAction<string>) => {
            const orderId = action.payload;
            state.orders = state.orders.map(order => {
                if (order.id === orderId) {
                    return { ...order, status: 'Завершен' };
                }
                return order;
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAddressSuggestions.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAddressSuggestions.fulfilled, (state, action) => {
            state.loading = false;
            state.suggestions = action.payload;
        });
        builder.addCase(fetchAddressSuggestions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.orders.push(action.payload);
            state.orderCost = action.payload.orderCost;
            state.deliveryCost = action.payload.deliveryCost;
            state.totalCost = action.payload.totalCost;
            state.status = action.payload.status
        });
    },
});

export const { setAddress } = orderSlice.actions;
export const clearSuggestions = createAction('order/clearSuggestions');
export const cancelOrder = createAction<string>('order/cancelOrder');
export const completeOrder = createAction<string>('order/completeOrder');

export const selectAddress = (state: RootState) => state.orders.address;
export const selectSuggestions = (state: RootState) => state.orders.suggestions;
export const selectLoading = (state: RootState) => state.orders.loading;
export const selectError = (state: RootState) => state.orders.error;
export const selectOrderCost = (state: RootState) => state.orders.orderCost;
export const selectDeliveryCost = (state: RootState) => state.orders.deliveryCost;
export const selectTotalCost = (state: RootState) => state.orders.totalCost;

export default orderSlice.reducer;