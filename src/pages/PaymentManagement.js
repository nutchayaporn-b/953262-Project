// material
import { Box, Grid, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// components
import Page from '../components/Page';
import { useState, useEffect, useContext } from 'react';

// utils
import { fCurrency } from '../utils/formatNumber';
import { fDateTime } from '../utils/formatTime';
//
import Iconify from '../components/Iconify';
import axiosHelper from '../utils/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
export default function PaymentManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user.role !== 'kitchen') navigate('/');

  useEffect(async () => {
    await axiosHelper('get', '/kitchen/order/invoice').then(res => {
      if (res.data.success) {
        setProducts(res.data.data);
      }
    });
  }, []);

  const [products, setProducts] = useState([]);

  return (
    <Page title="Dashboard | ">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }} className="text-[#1a910a]">
          <Typography variant="h4">Order Management</Typography>
        </Box>
        <section className="antialiased bg-gray-100 text-gray-600 w-full px-4">
          <div className="flex flex-col justify-center h-full w-full">
            <div className="w-3/4 mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
              <header className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Order List</h2>
              </header>
              <div className="p-3">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                      <tr className="">
                        <th className="p-2 whitespace-nowrap w-2/12 text-center">
                          <div className="font-semibold ">INVOICE ID</div>
                        </th>
                        <th className="p-2 whitespace-nowrap w-4/12 text-center">
                          <div className="font-semibold text-center">CUSTOMER NAME</div>
                        </th>
                        <th className="p-2 whitespace-nowrap w-2/12 text-center">
                          <div className="font-semibold text-center">CREATED AT</div>
                        </th>
                        <th className="p-2 whitespace-nowrap w-4/12 text-center">
                          <div className="font-semibold text-center">STATUS</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                      {products &&
                        products.map(product => (
                          <TableRow
                            key={`${product.id}${product.created_at}${Math.floor(Math.random() * 1000)}`}
                            product={product}
                            setProducts={setProducts}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Page>
  );
}

function TableRow({ product, setProducts }) {
  function handleChange(id) {
    axiosHelper('post', '/kitchen/order/confirm', { id }).then(res => {
      if (res.data.success) {
        toast.success('Payment confirmed');
        axiosHelper('get', '/kitchen/order/invoice').then(res => {
          if (res.data.success) {
            setProducts(res.data.data);
          }
        });
      }
    });
  }

  function style(status) {
    switch (status) {
      case 'paid':
        return 'font-medium text-center px-4 py-2 text-white w-3/5 bg-green-700 rounded-lg';
      default:
        return 'font-medium text-center px-4 py-2 text-white w-3/5 bg-gray-700 rounded-lg';
    }
  }

  return (
    <tr>
      <td className="text-center">{product.id}</td>
      <td className="p-2 whitespace-nowrap text-center">
        <div>{product.order[0].user.name}</div>
      </td>
      <td className="p-2 whitespace-nowrap text-center">{new Date(product.created_at).toLocaleTimeString()}</td>
      <td className="p-2 whitespace-nowrap flex items-center justify-center">
        <button
          className={style(product.invoice_status.status)}
          title="Click to change status"
          onClick={() => {
            handleChange(product.id);
          }}
        >
          {product.invoice_status.status}
        </button>
      </td>
    </tr>
  );
}
