export interface Order {
    id: number;
    client: string;
    phoneNumber: string;
    status: string;
    deliveryDate: string;
    address: string;
    quantity: number;
    orderCost: number;
    deliveryCost: number;
    totalCost: number;
    comment: string;
    products: []
}

export interface Client {
    id: number;
    name: string;
    address: string;
    phone: string;
}

export interface AddressSuggestion {
    value: string;
}

export interface Product {
    number: number;
    name: string;
    article: string;
    quantity: number;
    price: number;
    comment: string;
}