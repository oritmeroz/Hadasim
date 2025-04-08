// src/Services/AuthService.ts
import { jwtDecode } from "jwt-decode";

// פונקציה שמחזירה את ה-token מה-localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getSupplierIdFromToken = (): number | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    console.log("🔍 Decoded token:", decoded);

    const supplierId = decoded["SupplierId"];
    
    // בודק האם יש ערך מספרי
    if (supplierId && !isNaN(parseInt(supplierId))) {
      return parseInt(supplierId);
    }

    return null;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
};

// פונקציה שמחזירה את ה-role מתוך הטוקן
export const getRoleFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    console.log("Decoded token:", decoded); // הדפסת התוכן

    // שמירה על המפתח הנכון ל-role
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
};

// פונקציה שבודקת אם המשתמש הוא בעל מכולת (User)
export const isUser = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "User";
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return false;
  }
};
// פונקציה שמחזירה את ה-UserId מתוך הטוקן
export const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    console.log("🔍 Decoded token:", decoded);

    const userId = decoded["UserId"];
    
    // בודק האם יש ערך מספרי
    if (userId && !isNaN(parseInt(userId))) {
      return parseInt(userId);
    }

    return null;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
};