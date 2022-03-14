import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
//
import Label from '../../../components/Label';
import ColorPreview from '../../../components/ColorPreview';
import Iconify from '../../../components/Iconify';
import { ProductContext } from '../../../context/ProductContext';
import axiosHelper from '../../../utils/axios';
import toast from 'react-hot-toast';

export default function ShopProductCard() {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(ProductContext);
  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('cart'));
    const productGroup = [];
    products.map(product => {
      // check if productGroup has product with id
      const index = productGroup.findIndex(item => item.id === product.id);
      if (index === -1) {
        productGroup.push({
          ...product,
          amount: product.amount || 1,
        });
      } else {
        productGroup[index].amount += 1;
      }
      return productGroup;
    });
    setProducts(productGroup);
  }, []);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(products));
    const productAmount = products.reduce((acc, product) => {
      return acc + product.amount;
    }, 0);
    setCart(productAmount);
  }, [products]);

  async function handleCheckout() {
    await axiosHelper('post', '/customer/order/confirm', { cart: products }).then(res => {
      if (res.data.success) {
        setProducts([]);
        setCart(0);
        localStorage.setItem('cart', JSON.stringify([]));
        toast.success('Order success');
        return navigate('/');
      }
      toast.error('Order failed');
    });
  }

  return (
    <section className="antialiased bg-gray-100 text-gray-600 h-screen px-4">
      <div className="flex flex-col justify-center h-full">
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
                      <div className="font-semibold text-center">DELETE</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {products &&
                    products.map(product => (
                      <TableRow key={product.id} product={product} products={products} setProducts={setProducts} />
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
                    Total: {fCurrency(products.reduce((acc, cur) => acc + cur.price * cur.amount, 0))}
                  </Typography>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={handleCheckout}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}

function TableRow({ product, products, setProducts }) {
  return (
    <tr>
      <td className="p-2 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
            <img className="rounded-full" src={product.image} width="40" height="40" alt="" />
          </div>
          <div className="font-medium text-gray-800">{product.name}</div>
        </div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">
          <button
            className="px-2"
            onClick={() => {
              const newProducts = products.map(item => {
                if (item.id === product.id) {
                  item.amount -= 1;
                }
                return item;
              });

              setProducts(newProducts);
            }}
          >
            <Iconify icon="akar-icons:circle-minus" />
          </button>
          {product.amount}
          <button
            className="px-2"
            onClick={() => {
              const newProducts = products.map(item => {
                if (item.id === product.id) {
                  item.amount += 1;
                }
                return item;
              });
              setProducts(newProducts);
            }}
          >
            <Iconify icon="akar-icons:circle-plus" />
          </button>
        </div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left font-medium text-blue-500">{fCurrency(product.price * product.amount)}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <button
          className="text-center w-full py-2 bg-red-500 text-white rounded-xl text-xs px-2 sm:px-0"
          onClick={() => {
            const newProducts = products.filter(item => item.id !== product.id);
            setProducts(newProducts);
          }}
        >
          DELETE
        </button>
      </td>
    </tr>
  );
}
