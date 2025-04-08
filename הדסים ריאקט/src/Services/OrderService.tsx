import { AxiosResponse } from "axios";
import apiClient from "../api/apiClient";
import { Order } from "../Models/types";

const OrderService = {
  // קבלת כל ההזמנות
  getAll: async (): Promise<Order[]> => {
    try {
      const token = localStorage.getItem("token");
      const response: AxiosResponse<Order[]> = await apiClient.get("/Order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // קבלת הזמנה לפי מזהה
  getById: async (id: number): Promise<Order> => {
    try {
      const token = localStorage.getItem("token");
      const response: AxiosResponse<Order> = await apiClient.get(`/Order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      throw error;
    }
  },

  // הוספת הזמנה חדשה
  add: async (orderData: Order): Promise<Order> => {
    try {
      const token = localStorage.getItem("token");

      const formData = new URLSearchParams();
      formData.append("UserId", orderData.userId.toString());
      formData.append("SupplierID", orderData.supplierID.toString());
      formData.append("OrderDate", orderData.orderDate.toString());
      formData.append("Status", orderData.status.toString());

      const response: AxiosResponse<Order> = await apiClient.post("/Order", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error adding order:", error);
      throw error;
    }
  },

  // קבלת הזמנות לפי מזהה ספק
  getBySupplierId: async (supplierId: number): Promise<Order[]> => {
    try {
      const token = localStorage.getItem("token");
      const response: AxiosResponse<Order[]> = await apiClient.get(`/Order/supplier/${supplierId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by supplier ID:", error);
      throw error;
    }
  },

  // קבלת הזמנות עם סטטוס Pending
  getPendingOrders: async (): Promise<Order[]> => {
    try {
      const token = localStorage.getItem("token");
      const response: AxiosResponse<Order[]> = await apiClient.get("/Order/user/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching pending orders:", error);
      throw error;
    }
  },

  // שינוי סטטוס הזמנה ל-Completed
  changeStatusToComplete: async (orderId: number): Promise<Order> => {
    try {
      const token = localStorage.getItem("token");
      const response: AxiosResponse<Order> = await apiClient.put(`/Order/status-complete/${orderId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating order status to Completed:", error);
      throw error;
    }
  },

  // שינוי סטטוס הזמנה ל-In_Progress
  changeStatusToInProgress: async (orderId: number): Promise<Order> => {
    try {
      const token = localStorage.getItem("token");
      const response: AxiosResponse<Order> = await apiClient.put(`/Order/status-inprogress/${orderId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating order status to In_Progress:", error);
      throw error;
    }
  }
};

export default OrderService;
