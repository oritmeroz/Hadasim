import React, { useState, useEffect } from "react";
import OrderService from "../Services/OrderService";
import { Order } from "../Models/types";
import { getSupplierIdFromToken } from "../Util/AuthService"; // ייבוא הפונקציה

const SupplierOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrdersBySupplier = async () => {
    try {
      const supplierId = Number(getSupplierIdFromToken());  // המרת ה־SupplierId למספר
      console.log(supplierId);
      if (!supplierId) {
        console.error("מזהה ספק לא נמצא בטוקן.");
        return;
      }
  
      setLoading(true);
      const orders = await OrderService.getBySupplierId(supplierId);
  
      // כאן תדפיס את הנתונים שהתקבלו מהשרת לפני העיבוד
      console.log("הזמנות שהתקבלו מהשרת:", orders);
  
      setOrders(orders);
    } catch (error) {
      console.error("שגיאה בשליפת הזמנות של ספק:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async (orderId: number) => {
    try {
      await OrderService.changeStatusToInProgress(orderId);
  
      // שליפת ההזמנות מחדש מהשרת כדי שהמסך יתעדכן
      await fetchOrdersBySupplier();
    } catch (error) {
      console.error("שגיאה בשינוי סטטוס ההזמנה:", error);
    }
  };
  

  // פונקציה להמיר אובייקט Date למחרוזת תקנית
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return "תאריך לא תקין"; // אם אין תאריך, מחזירים תאריך לא תקין
    
    // נוודא שהתאריך תקני עם new Date, אם לא, נחזיר "תאריך לא תקין"
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "תאריך לא תקין"; 

    // מחזירים את התאריך בפורמט יום/חודש/שנה בעברית
    return parsedDate.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    fetchOrdersBySupplier();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">ההזמנות שלך</h2>
      <div className="order-grid">
        {loading ? (
          <p>טעינה...</p>
        ) : orders.length === 0 ? (
          <p>לא נמצאו הזמנות עבור ספק זה.</p>
        ) : (
          orders.map((order) => {
            // המרת התאריכים למחרוזת תקנית
            const formattedOrderDate = formatDate(order.orderDate); // תאריך הזמנה
            // const formattedCompletedDate = formatDate(order.completedDate); // תאריך השלמה

            return (
              order && (
                <div key={order.id} className="order-card">
                  <h3>הזמנה #{order.id}</h3>
                  <p>תאריך הזמנה: {formattedOrderDate}</p>
                  <p>סטטוס: {order.status}</p>
                  {/* <p>תאריך השלמה: {formattedCompletedDate}</p> */}
                  {order.status !== "In_Progress" && (
                    <button onClick={() => handleApproveOrder(order.id)}>אישור הזמנה</button>
                  )}
                </div>
              )
            );
          })
        )}
      </div>
    </div>
  );
};

export default SupplierOrdersPage;
