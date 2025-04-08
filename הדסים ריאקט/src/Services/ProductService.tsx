import axios from "axios";
import { Product } from "../Models/types";
// כתובת ה-API של המוצרים
const API_URL = "https://localhost:7193/api/Product";

// הגדרת סוג אובייקט ProductService
interface ProductService {
  getAll: () => Promise<Product[]>; // קבלת כל המוצרים
  getById: (id: number) => Promise<Product>; // קבלת מוצר לפי מזהה
  add: (productData: Product) => Promise<Product>; // הוספת מוצר חדש
}

const ProductService: ProductService = {
  // פונקציה לקבלת כל המוצרים
  getAll: async (): Promise<Product[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // פונקציה לקבלת מוצר לפי מזהה
  getById: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // פונקציה להוספת מוצר חדש
  add: async (productData: Product): Promise<Product> => {
    try {
      // יצירת נתונים בפורמט URLSearchParams
      const formData = new URLSearchParams();
      formData.append("Name", productData.name);
      formData.append("Price", productData.price.toString());
      formData.append("MinimumQty", productData.minimumQty.toString());

      // שליחה לסרוויס עם HTTP POST
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',  // נוודא שהכותרת מתאימה
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }
};

export default ProductService;