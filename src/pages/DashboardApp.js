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

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user.role === 'kitchen') navigate('/kitchen/order');
  useEffect(() => {
    axiosHelper('get', '/customer/order/list').then(res => {
      if (res.data.success) {
        setProducts(res.data.data);
      } else toast.error('Fail to get order');
    });
  }, []);

  const [products, setProducts] = useState([]);

  function findTotal() {
    let total = 0;
    products.forEach(product => {
      product.order_item.forEach(item => {
        total += item.food.price * item.amount;
      });
    });
    return total;
  }

  async function handleCheckout() {
    await axiosHelper('post', '/customer/order/checkout').then(res => {
      if (res.data.success) {
        toast.success('Checkout success');
        return navigate('/customer/checkout');
      }
      toast.error(res.data.message);
    });
  }

  return (
    <Page title="Dashboard | ">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }} className="text-[#1a910a]">
          <Typography variant="h4">Your orders will appear here</Typography>
        </Box>
        <section className="antialiased bg-gray-100 text-gray-600 w-full px-4">
          <div className="flex flex-col justify-center h-full w-full">
            <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
              <header className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Order List</h2>
              </header>
              <div className="p-3">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                      <tr className="">
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-left">FOOD</div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-left">AMOUNT</div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-left">PRICE</div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">STATUS</div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">CANCEL</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                      {products &&
                        products.map(product => (
                          <>
                            <tr className="w-full bg-gray-800 text-white py-4 text-2xl text-center">
                              Order: {new Date(product.created_at).toTimeString().split(' ')[0].slice(0, 5)}
                            </tr>
                            {product.order_item.map(item => (
                              <TableRow
                                key={`${product.id}${item.id}${product.created_at}${Math.floor(Math.random() * 1000)}`}
                                product={item}
                                products={products}
                                setProducts={setProducts}
                              />
                            ))}
                          </>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <footer className="px-5 py-4 border-t border-gray-100 bg-gray-800">
                <div className="flex justify-between w-full">
                  <div className="flex items-center w-full">
                    <div className="flex items-center w-full">
                      <Typography className="text-white w-[90%]" variant="body2">
                        Total: {fCurrency(findTotal())}
                      </Typography>
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={handleCheckout}
                      >
                        CHECKOUT
                      </button>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </section>
      </Container>
    </Page>
  );
}

function TableRow({ product, products, setProducts }) {
  async function handleCancel(order) {
    await axiosHelper('post', '/customer/order/cancel', { order_item_id: order }).then(async res => {
      if (res.data.success) {
        toast.success('Cancel success');
        await axiosHelper('get', '/customer/order/list').then(res => {
          if (res.data.success) {
            setProducts(res.data.data);
          }
        });
      } else toast.error(res.data.message);
    });
  }
  return (
    <tr>
      <td className="p-2 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
            <img className="rounded-full" src={product.food.image} width="40" height="40" alt="" />
          </div>
          <div className="font-medium text-gray-800">{product.food.name}</div>
        </div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{product.amount}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left font-medium text-blue-500">{fCurrency(product.food.price * product.amount)}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className={'font-medium text-center'}>{product.order_status.status}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <button
          className="text-center w-full py-2 bg-red-500 text-white rounded-xl text-xs px-2 sm:px-0"
          onClick={() => handleCancel(product.id)}
        >
          CANCEL
        </button>
      </td>
    </tr>
  );
}
