import axios from "axios";
import { Supplier } from "../Models/types";

// כתובת ה-API של הספקים
const API_URL = "https://localhost:7193/api/Supplier";

// הגדרת סוג אובייקט SupplierService
interface SupplierService {
  getAll: () => Promise<Supplier[]>;
  getById: (id: number) => Promise<Supplier>;
  add: (supplierData: Supplier) => Promise<Supplier>;
}

const SupplierService: SupplierService = {
  // פונקציה לקבלת כל הספקים
  getAll: async (): Promise<Supplier[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // פונקציה לקבלת ספק לפי מזהה
  getById: async (id: number): Promise<Supplier> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // פונקציה להוספת ספק חדש
  add: async (supplierData: Supplier): Promise<Supplier> => {
    try {
      // יצירת נתונים בפורמט URLSearchParams
      const formData = new URLSearchParams();
      formData.append("CompanyName", supplierData.companyName);
      formData.append("PhoneNumber", supplierData.phoneNumber);
      formData.append("RepresentativeName", supplierData.representativeName);
      formData.append("Email", supplierData.email);
      formData.append("Password", supplierData.password);
      formData.append("Role", supplierData.role);

      // אם אין מוצרים, נשלח ערך ריק
      if (supplierData.products && supplierData.products.length > 0) {
        const productNames = supplierData.products.map((product) => product.name).join(", ");
        formData.append("Products", productNames);
      } else {
        formData.append("Products", "");  // שליחת ערך ריק אם אין מוצרים
      }

      // שליחה לסרוויס עם HTTP POST
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error adding supplier:", error);
      throw error;
    }
  },
};

export default SupplierService;
