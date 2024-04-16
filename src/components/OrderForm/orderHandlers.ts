import { AddressSuggestion, Client } from '../../types/types';
import { AppDispatch } from '../../store';
import { fetchAddressSuggestions, clearSuggestions, createOrder } from '../../features/orders/orderSlice';
import { v4 as uuidv4 } from 'uuid';

export const handleClientChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    clients: Client[],
    setSelectedClient: React.Dispatch<React.SetStateAction<string>>,
    setPhoneNumber: React.Dispatch<React.SetStateAction<string>>,
    setAddressValue: React.Dispatch<React.SetStateAction<string>>
) => {
    setSelectedClient(e.target.value);
    const selectedClientData = clients.find(client => client.name === e.target.value);
    if (selectedClientData) {
        setPhoneNumber(selectedClientData.phone);
        setAddressValue(selectedClientData.address);
    }
};

export const handleCancelClick = (
    setTableData: React.Dispatch<React.SetStateAction<Array<any>>>
) => {
    setTableData([]);
};

export const handleDateButtonClick = (
    daysToAdd: number,
    index: number,
    setDeliveryDate: React.Dispatch<React.SetStateAction<string>>,
    setSelectedButton: React.Dispatch<React.SetStateAction<number>>
) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);

    const formattedDate = date.toISOString().split('T')[0];
    setDeliveryDate(formattedDate);
    setSelectedButton(index);
};

export const handleDeliveryCostChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setDeliveryCost: React.Dispatch<React.SetStateAction<number>>
) => {
    const value = e.target.value.replace(/\D/g, '');
    setDeliveryCost(Number(value));
};

export const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setAddressValue: React.Dispatch<React.SetStateAction<string>>,
    dispatch: AppDispatch
) => {
    const addressValue = e.target.value;
    setAddressValue(addressValue);
    if (addressValue.length > 2) {
        dispatch(fetchAddressSuggestions(addressValue));
    }
};

export const handleSuggestionClick = (
    suggestion: AddressSuggestion,
    setAddressValue: React.Dispatch<React.SetStateAction<string>>,
    setSelectedSuggestions: React.Dispatch<React.SetStateAction<AddressSuggestion[]>>,
    dispatch: AppDispatch
) => {
    setAddressValue(suggestion.value);
    setSelectedSuggestions([]);
    dispatch(clearSuggestions());
};

export const handleCreateButtonClick = (
    setTableData: React.Dispatch<React.SetStateAction<Array<any>>>,
    tableData: Array<any>
) => {
    const newProduct = {
        number: tableData.length + 1,
        name: '',
        article: '',
        quantity: 0,
        price: 0,
        comment: 'заполните данные по товару'
    };
    setTableData([...tableData, newProduct]);
};

export const handleTableCellChange = (
    value: string,
    rowIndex: number,
    field: string,
    tableData: Array<any>,
    setTableData: React.Dispatch<React.SetStateAction<Array<any>>>
) => {
    const updatedTableData = [...tableData];
    if (field === 'article') {
        value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }
    updatedTableData[rowIndex][field] = value;
    setTableData(updatedTableData);
};

export const handleCreateOrderClick = (
    selectedClient: string,
    phoneNumber: string,
    comment: string,
    address: string,
    deliveryCost: number,
    deliveryDate: string,
    tableData: Array<any>,
    dispatch: AppDispatch
) => {
    const newOrderId = uuidv4();
    const orderData = {
        id: newOrderId,
        client: selectedClient,
        phoneNumber,
        comment,
        address,
        deliveryCost,
        deliveryDate,
        products: tableData,
        status: 'Создан'
    };

    dispatch(createOrder(orderData));
};

export const copyToClipboard = (address: string) => {
    const input = document.createElement('input');
    input.value = address;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
};
