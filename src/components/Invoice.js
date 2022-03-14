import React, { useEffect, useState } from 'react';
import axiosHelper from '../utils/axios';
import { toast } from 'react-hot-toast';
import { fCurrency } from '../utils/formatNumber';

export default function Invoice() {
  useEffect(async () => {
    await axiosHelper('get', '/customer/order/invoice').then(res => {
      if (res.data.success) {
        setInvoice(res.data.data.invoice);
        const orders = res.data.data.orders;
        const temp = [];
        orders.forEach(order => {
          order.order_item.forEach(item => {
            // temp push item to array if item.food.id not exist in array
            if (!temp.some(e => e.food.id === item.food.id)) {
              temp.push({
                food: item.food,
                amount: item.amount,
                price: item.food.price,
              });
            } else {
              // if item.food.id exist in array, update amount
              const index = temp.findIndex(e => e.food.id === item.food.id);
              temp[index].amount += item.amount;
            }
          });
        });
        setOrder(temp);
      } else {
        toast.error('No invoice found');
      }
    });
  }, []);

  const [invoice, setInvoice] = useState();
  const [order, setOrder] = useState();
  if (!invoice) return <div></div>;
  return (
    <div className="mx-auto p-16 max-w-[800px]">
      <div className="flex items-center justify-between mb-8 px-3">
        <div>
          <span className="text-2xl">Invoice: {invoice.id}</span>
          <br />
          <span>Date</span>: {new Date(invoice.updated_at || new Date()).toLocaleTimeString()}{' '}
          {new Date(invoice.updated_at || new Date()).toLocaleDateString()}
          <br />
        </div>
        <div className="text-right">
          <img src="/static/logo.png" width={150} height={150} alt="" />
        </div>
      </div>

      <div className="flex justify-between mb-8 px-3">
        <div>
          Best ChiangMai Restaurant
          <br />
          12/1 NB Building Nimmanhemin
          <br />
          Suthep A. Muang Chiang Mai 50200
          <br />
          best@chiangmai.com
          <br />
          +66 55-700-5115
        </div>
        <div className="text-right">
          Chiang Mai University
          <br />
          Street 12
          <br />
          10000 City
          <br />
          @Chiangmai
        </div>
      </div>

      <div className="border border-t-2 border-gray-200 mb-8 px-3"></div>

      <div className="mb-8 px-3">
        <p>Thanks for your order. Please find your order details below.</p>
      </div>

      {order &&
        order.map(product => (
          <div className="grid grid-cols-3 mb-4 bg-gray-200 px-3 py-2">
            <div className="font-medium text-left">{product.food.name}</div>
            <div className="font-medium text-center">{product.amount} pcs.</div>
            <div className="font-medium text-right">{fCurrency(product.food.price * product.amount)}</div>
          </div>
        ))}

      <div className="flex justify-between items-center mb-2 px-3">
        <div className="text-2xl leading-none">
          <span className="">Total</span>:
        </div>
        <div className="text-2xl text-right font-medium">{fCurrency(invoice.total)}</div>
      </div>

      <div className="flex mb-8 justify-end px-3">
        <div className="text-right w-1/2 px-0 leading-tight">
          <small className="text-xs">
            Best Regards,
            <br />
            Best ChiangMai Restaurant
          </small>
        </div>
      </div>

      <div className="mb-8 px-3"></div>

      <div className="mb-8 text-4xl text-center px-3">
        <span>Thank you!</span>
      </div>
    </div>
  );
}
