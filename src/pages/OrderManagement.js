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
export default function OrderManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user.role !== 'kitchen') navigate('/');

  useEffect(async () => {
    await axiosHelper('get', '/kitchen/order/list').then(res => {
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
                          <div className="font-semibold ">ORDER ID</div>
                        </th>
                        <th className="p-2 whitespace-nowrap w-4/12 text-center">
                          <div className="font-semibold text-center">FOOD</div>
                        </th>
                        <th className="p-2 whitespace-nowrap w-2/12 text-center">
                          <div className="font-semibold text-center">AMOUNT</div>
                        </th>
                        <th className="p-2 whitespace-nowrap w-4/12 text-center">
                          <div className="font-semibold text-center">STATUS</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                      {products &&
                        products.map(product => (
                          <>
                            <tr className="w-full bg-gray-800 text-white py-4 text-2xl text-center">
                              <td></td>
                              <td>Order: {new Date(product.created_at).toTimeString().split(' ')[0].slice(0, 5)}</td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                            {product.order_item.map(item => (
                              <TableRow
                                key={`${product.id}${item.id}${product.created_at}${Math.floor(Math.random() * 1000)}`}
                                product={item}
                                setProducts={setProducts}
                              />
                            ))}
                          </>
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
  function handleChange(status, id) {
    axiosHelper('post', '/kitchen/order/change', { status, id }).then(res => {
      if (res.data.success) {
        toast.success('Status changed');
        axiosHelper('get', '/kitchen/order/list').then(res => {
          if (res.data.success) {
            setProducts(res.data.data);
          }
        });
      } else {
        toast.error(res.data.message);
      }
    });
  }

  function style(status) {
    switch (status) {
      case 'queue':
        return 'font-medium text-center px-4 py-2 text-white w-2/5 bg-gray-700 rounded-lg';
      case 'cooking':
        return 'font-medium text-center px-4 py-2 text-white w-2/5 bg-orange-600 rounded-lg';
      case 'served':
        return 'font-medium text-center px-4 py-2 text-white w-2/5 bg-green-600 rounded-lg';
      default:
        return 'font-medium text-center px-4 py-2 text-white w-2/5 bg-gray-700 rounded-lg';
    }
  }

  return (
    <tr>
      <td className="text-center">{product.id}</td>
      <td className="p-2 whitespace-nowrap">
        <div className="flex items-center justify-center w-full">
          <div className="flex w-2/5 items-center">
            <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
              <img className="rounded-full" src={product.food.image} width="40" height="40" alt="" />
            </div>
            <div className="font-medium text-gray-800">{product.food.name}</div>
          </div>
        </div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-center">{product.amount}</div>
      </td>
      <td className="p-2 whitespace-nowrap flex items-center justify-center">
        <button
          className={style(product.order_status.status)}
          onClick={() => {
            handleChange(product.order_status.status, product.id);
          }}
          title="Click to change status"
        >
          {product.order_status.status}
        </button>
      </td>
    </tr>
  );
}
