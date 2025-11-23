import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from "react-toastify";
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");

      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }

    } catch (err) {
      toast.error("Server error");
      console.log(err);
    }
  };

  const statusHandler = async (event , orderId) =>{
    
  }

  const updateStatus = async (orderId, status) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status
      });

      if (response.data.success) {
        toast.success("Status Updated!");
        fetchAllOrders(); // reload orders
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Orders</h3>

      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">

            <img src={assets.parcel_icon} alt="" />

            {/* FOOD ITEMS */}
            <p className="order-item-food">
              {order.items.map((item, i) =>
                i === order.items.length - 1
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              )}
            </p>

            {/* NAME */}
            <p className="order-item-name">
              {order.address.firstName} {order.address.lastName}
            </p>

            {/* ADDRESS */}
            <div className="order-item-address">
              <p>{order.address.street},</p>
              <p>
                {order.address.city}, {order.address.state},{" "}
                {order.address.country}, {order.address.zipcode}
              </p>
            </div>

            {/* PHONE */}
            <p className="order-item-phone">{order.address.phone}</p>

            {/* AMOUNT */}
            <p><b>${order.amount}</b></p>

            {/* STATUS DROPDOWN */}
            <select
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;