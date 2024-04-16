import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, FormControl, FormLabel, Heading, Input, InputGroup, InputRightAddon, Select, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { AddressSuggestion, Client, Product } from '../../types/types';
import InputMask from 'react-input-mask';
import './orderForm.css'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddressSuggestions, selectAddress, selectSuggestions, clearSuggestions, createOrder, selectOrderCost, selectTotalCost } from '../../features/orders/orderSlice';
import { AppDispatch } from '../../store';
import { Link } from 'react-router-dom';
import { CopyIcon } from '@chakra-ui/icons';
import {
    handleClientChange,
    handleDateButtonClick,
    handleDeliveryCostChange,
    handleAddressChange,
    handleSuggestionClick,
    handleCreateButtonClick,
    handleTableCellChange,
    handleCreateOrderClick,
    copyToClipboard,
    handleCancelClick
} from './orderHandlers';

const clients: Client[] = require('../../db/clients.json');

const OrderForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const suggestions = useSelector(selectSuggestions);
    const orderCost = useSelector(selectOrderCost);
    const totalCost = useSelector(selectTotalCost);
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [address, setAddressValue] = useState<string>('');
    const [deliveryCost, setDeliveryCost] = useState<number>(0);
    const [deliveryDate, setDeliveryDate] = useState<string>('');
    const [selectedButton, setSelectedButton] = useState<number>(-1);
    const [selectedSuggestions, setSelectedSuggestions] = useState<AddressSuggestion[]>([]);
    const suggestionsRef = useRef<HTMLUListElement>(null);
    const [tableData, setTableData] = useState<Array<any>>([]);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [totalWithDelivery, setTotalWithDelivery] = useState<number>(0);

    useEffect(() => {
        setTableData([{
            number: 1,
            name: '',
            article: '',
            quantity: 0,
            price: 0,
            comment: 'заполните данные по товару'
        }]);
    }, []);

    useEffect(() => {
        const calculatedSubtotal = tableData.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);
        setSubtotal(calculatedSubtotal);
        const calculatedTotalWithDelivery = calculatedSubtotal + deliveryCost;
        setTotalWithDelivery(calculatedTotalWithDelivery);
    }, [tableData, deliveryCost]);

    return (
        <Box p={10}>
            <Heading fontSize='24px' color='#484A6A' mb='40px' as='h3' size='md'>
                Создание Заказа
            </Heading>
            <Box display="flex" >
                <Box marginRight="20px">
                    <Text mb={4} fontSize={16} fontWeight={500} color='#595B83'>Данные заказа</Text>
                    <FormControl mb="4">
                        <FormLabel fontSize={12} color='#595B83'>Постоянный клиент:</FormLabel>
                        <Select value={selectedClient} onChange={(e) => handleClientChange(e, clients, setSelectedClient, setPhoneNumber, setAddressValue)} placeholder="Выберите клиента">
                            {clients.map(client => (
                                <option key={client.id} value={client.name}>{client.name}</option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl mb="4">
                        <FormLabel fontSize={12} color='#595B83'>Номер телефона:</FormLabel>
                        <InputMask mask="+7 (999) 999-99-99" value={phoneNumber} onChange={(e) => setPhoneNumber(e.currentTarget.value)}>
                            <Input type="tel" />
                        </InputMask>
                    </FormControl>
                    <FormControl mb="4">
                        <FormLabel fontSize={12} color='#595B83'>Комментарий:</FormLabel>
                        <Input type="text" h={101} padding={0} value={comment} onChange={(e) => setComment(e.target.value)} />
                    </FormControl>
                    <FormControl mb="4" className="suggestions-container">
                        <FormLabel fontSize={12} color='#595B83' >Адрес:</FormLabel>
                        <InputGroup>
                            <Input type="text" value={address} onChange={(e) => handleAddressChange(e, setAddressValue, dispatch)} />
                            <Button
                                ml="4px"
                                border="1px"
                                borderColor="#E2E8F0"
                                background="transparent"
                                width='40px'
                                onClick={() => copyToClipboard(address)}
                                _hover={{
                                    bg: '#3743AF',
                                    borderColor: '#3743AF',
                                }}
                            >
                                <CopyIcon _hover={{ color: '#fff' }} color='#385898' />
                            </Button>
                        </InputGroup>
                        {suggestions.length > 0 && (
                            <ul className="suggestions-list" ref={suggestionsRef}>
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(suggestion, setAddressValue, setSelectedSuggestions, dispatch)}>{suggestion.value}</li>
                                ))}
                            </ul>
                        )}
                    </FormControl>
                    <FormControl mb="4">
                        <FormLabel fontSize={12} color='#595B83'>Стоимость доставки:</FormLabel>
                        <InputGroup>
                            <Input type="number" value={deliveryCost === 0 ? '' : deliveryCost.toString()} onChange={(e) => handleDeliveryCostChange(e, setDeliveryCost)} />
                            <InputRightAddon bg="#D8DBF3">RUB</InputRightAddon>
                        </InputGroup>

                    </FormControl>
                    <FormControl mb="4">
                        <FormLabel fontSize={12} color='#595B83'>Дата</FormLabel>
                        <div className="date-section">
                            <Input placeholder='Select Date and Time' mb={4} onChange={(e) => setDeliveryDate(e.target.value)} value={deliveryDate} size='md' type='date' />
                            <div className='date-btn'>
                                <Button
                                    border='1px'
                                    borderColor='#505CC8'
                                    color={selectedButton === 0 ? "#FFFFFF" : "#505CC8"}
                                    backgroundColor={selectedButton === 0 ? "#505CC8" : "transparent"}
                                    onClick={() => handleDateButtonClick(0, 0, setDeliveryDate, setSelectedButton)}
                                    marginRight="2">
                                    Сегодня
                                </Button>
                                <Button
                                    border='1px'
                                    borderColor='#505CC8'
                                    color={selectedButton === 1 ? "#FFFFFF" : "#505CC8"}
                                    backgroundColor={selectedButton === 1 ? "#505CC8" : "transparent"}
                                    onClick={() => handleDateButtonClick(1, 1, setDeliveryDate, setSelectedButton)}
                                    marginRight="2">
                                    Завтра
                                </Button>
                                <Button
                                    border='1px'
                                    borderColor='#505CC8'
                                    color={selectedButton === 2 ? "#FFFFFF" : "#505CC8"}
                                    backgroundColor={selectedButton === 2 ? "#505CC8" : "transparent"}
                                    onClick={() => handleDateButtonClick(2, 2, setDeliveryDate, setSelectedButton)}>
                                    Послезавтра
                                </Button>
                            </div>
                        </div>
                    </FormControl>
                </Box>
                <Box>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>№</Th>
                                <Th>Название</Th>
                                <Th>Артикул</Th>
                                <Th>Количество</Th>
                                <Th>Цена (RUB)</Th>
                                <Th>Комментарий</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tableData.map((rowData, index) => (
                                <Tr key={index}>
                                    <Td>{rowData.number}</Td>
                                    <Td><Input outline='none' border='none' type="text" value={rowData.name} onChange={(e) => handleTableCellChange(e.target.value, index, 'name', tableData, setTableData)} /></Td>
                                    <Td><Input outline='none' border='none' type="text" value={rowData.article} onChange={(e) => handleTableCellChange(e.target.value, index, 'article', tableData, setTableData)} /></Td>
                                    <Td><Input outline='none' border='none' type="number" value={rowData.quantity} onChange={(e) => handleTableCellChange(e.target.value, index, 'quantity', tableData, setTableData)} /></Td>
                                    <Td><Input outline='none' border='none' type="number" value={rowData.price} onChange={(e) => handleTableCellChange(e.target.value, index, 'price', tableData, setTableData)} /></Td>
                                    <Td><Input outline='none' border='none' type="text" value={rowData.comment} onChange={(e) => handleTableCellChange(e.target.value, index, 'comment', tableData, setTableData)} /></Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                    <Button background="transparent" onClick={() => handleCreateButtonClick(setTableData, tableData)}>+</Button>
                    <Box>
                        <Text mt={4} display='flex'>СУММА: <Text ml={550}>{subtotal}</Text> RUB</Text>
                        <Text display='flex'>СУММА С ДОСТАВКОЙ: <Text ml={437}>{totalWithDelivery}</Text> RUB</Text>
                    </Box>
                    <Box mt="4" display="flex" justifyContent="flex-end">
                        <Link to="/"><Button background="transparent" color='#385898' onClick={() => handleCancelClick(setTableData)} marginRight="2">Отменить</Button></Link>
                        <Link to="/"><Button width='150px' colorScheme="facebook" onClick={() => handleCreateOrderClick(selectedClient, phoneNumber, comment, address, deliveryCost, deliveryDate, tableData, dispatch)}>Создать</Button></Link>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default OrderForm;