import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Badge, Flex } from '@chakra-ui/react';
import { Order } from '../../types/types';
import './orderTable.css'
import { AddIcon } from '@chakra-ui/icons';
import { cancelOrder, completeOrder } from '../../features/orders/orderSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

interface OrderTableProps {
  orders: Order[];
}

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  const dispatch = useDispatch();

  const handleCancelClick = (orderId: string) => {
    console.log(orderId);
    dispatch(cancelOrder(orderId)); 
  };

  const handleCompleteClick = (orderId: string) => {
    dispatch(completeOrder(orderId));
  };
  
  return (
    <div className='order-table'>
      <div className="order-table-header">
        <h2>Заказы</h2>
        <Link to="/order">
      <Button colorScheme="facebook" mb={4}>
        <AddIcon /> Добавить заказ
      </Button>
    </Link>
      </div>
      <Table variant="striped">
        <Thead bg="#E2E8F0">
          <Tr>
            <Th>№</Th>
            <Th>Клиент</Th>
            <Th>Номер телефона</Th>
            <Th>Статус</Th>
            <Th>Дата доставки</Th>
            <Th>Адрес доставки</Th>
            <Th>Кол-во</Th>
            <Th>Стоимость товаров (RUB)</Th>
            <Th>Стоимость доставки (RUB)</Th>
            <Th>Стоимость итого (RUB)</Th>
            <Th>Комментарий</Th>
            <Th>Действия</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order, index) => (
            <Tr key={order.id}>
              <Td>{index + 1}</Td>
              <Td>{order.client}</Td>
              <Td>{order.phoneNumber}</Td>
              <Td>
                {order.status === "Создан" && (
                  <Badge colorScheme='facebook'>Создан</Badge>
                )}
                {order.status === "Завершен" && (
                  <Badge colorScheme='green'>Завершен</Badge>
                )}
                {order.status === "Отменен" && (
                  <Badge colorScheme='red'>Отменен</Badge>
                )}
              </Td>
              <Td>{order.deliveryDate}</Td>
              <Td>{order.address}</Td>
              <Td>{order.products.length}</Td>
              <Td>{order.orderCost}</Td>
              <Td>{order.deliveryCost}</Td>
              <Td>{order.totalCost}</Td>
              <Td>{order.comment}</Td>
              <Td>
                <Flex>
                {order.status === 'Создан' && (
                  <>
                    <Button background="transparent" color='#385898' mr={2} onClick={() => handleCancelClick(String(order.id))}>Отменить</Button>
                    <Button colorScheme="facebook" onClick={() => handleCompleteClick(String(order.id))}>Завершить</Button>
                  </>
                )}
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default OrderTable;
