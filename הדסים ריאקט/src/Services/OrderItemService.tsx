import { AxiosResponse } from "axios";
import apiClient from "../api/apiClient";
import { OrderItem } from "../Models/types";

const OrderItemService = {
  // קבלת כל פריטי ההזמנה
  getAll: async (): Promise<OrderItem[]> => {
    try {
      const token = localStorage.getItem("token");
      const response: AxiosResponse<OrderItem[]> = await apiClient.get("/OrderItem", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching order items:", error);
      throw error;
    }
  },

  // קבלת פריט הזמנה לפי מזהה
  getById: async (id: number): Promise<OrderItem> => {
    try {
      const token = localStorage.getItem("token");
      const response: AxiosResponse<OrderItem> = await apiClient.get(`/OrderItem/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching order item with ID ${id}:`, error);
      throw error;
    }
  },

  // הוספת פריט הזמנה חדש
  add: async (orderItemData: OrderItem): Promise<OrderItem> => {
    try {
      const token = localStorage.getItem("token");

      const formData = new URLSearchParams();
      formData.append("OrderId", orderItemData.orderId.toString());
      formData.append("ProductId", orderItemData.productId.toString());
      formData.append("Quantity", orderItemData.quantity.toString());
      formData.append("TotalPrice", orderItemData.totalPrice.toString());

      const response: AxiosResponse<OrderItem> = await apiClient.post("/OrderItem", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error adding order item:", error);
      throw error;
    }
  },

  // קבלת פריטי הזמנה לפי מזהה הזמנה
  getByOrderId: async (orderId: number): Promise<OrderItem[]> => {
    try {
      const token = localStorage.getItem("token");
      const response: AxiosResponse<OrderItem[]> = await apiClient.get(`/OrderItem/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching order items by order ID:", error);
      throw error;
    }
  },

 

};

export default OrderItemService;
