import { AxiosResponse } from "axios";
import apiClient from "../api/apiClient";
import { User } from "../Models/types"; // ודא שהנתיב נכון

const UserService = {
  // קבלת כל המשתמשים
  getAll: async (): Promise<User[]> => {
    try {
      const token = localStorage.getItem("token");
      const response: AxiosResponse<User[]> = await apiClient.get("/User", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // קבלת משתמש לפי מזהה
  getById: async (id: number): Promise<User> => {
    try {
      const token = localStorage.getItem("token");
      const response: AxiosResponse<User> = await apiClient.get(`/User/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },

  // הוספת משתמש חדש
  add: async (userData: User): Promise<User> => {
    try {
      const token = localStorage.getItem("token");

      const formData = new URLSearchParams();
      formData.append("Name", userData.Name);
      formData.append("Password", userData.Password);
      formData.append("Email", userData.Email);
      formData.append("Role", userData.Role);

      const response: AxiosResponse<User> = await apiClient.post("/User", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  },
};

export default UserService;
