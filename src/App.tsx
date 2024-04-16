import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderTable from './components/OrderTable/OrderTable';
import OrderForm from './components/OrderForm/OrderForm';
import { useSelector } from 'react-redux';
import { RootState } from './store';

function App() {
  const orders = useSelector((state: RootState) => state.orders.orders)
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<OrderTable orders={orders} />} />
          <Route path="/order" element={<OrderForm />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
