import axios from "axios";
import { SupplierProduct } from "../Models/types";

const API_URL = "https://localhost:7193/api/SupplierProduct";

// טיפוס השירות
interface SupplierProductService {
  add: (supplierId: number, productId: number) => Promise<SupplierProduct>;
  get: (id: number) => Promise<SupplierProduct>;
  getAll: () => Promise<SupplierProduct[]>;
}

const SupplierProductService: SupplierProductService = {
  // יצירת קשר בין ספק למוצר
  add: async (supplierId: number, productId: number): Promise<SupplierProduct> => {
    const formData = new URLSearchParams();
    formData.append("SupplierID", supplierId.toString());
    formData.append("ProductID", productId.toString());

    const token: string | null = localStorage.getItem("token");

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return response.data;
    } catch (error) {
      console.error("שגיאה בקישור בין ספק למוצר:", error);
      throw error;
    }
  },

  // שליפת קשר לפי מזהה
  get: async (id: number): Promise<SupplierProduct> => {
    const token: string | null = localStorage.getItem("token");

    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("שגיאה בשליפת הקשר:", error);
      throw error;
    }
  },

  // שליפת כל הקשרים
  getAll: async (): Promise<SupplierProduct[]> => {
    const token: string | null = localStorage.getItem("token");

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("שגיאה בשליפת כלל הקשרים:", error);
      throw error;
    }
  },
};

export default SupplierProductService;
