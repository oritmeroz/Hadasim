import React, { useState, useEffect } from "react";
import OrderService from "../Services/OrderService";
import OrderItemService from "../Services/OrderItemService";
import SupplierService from "../Services/SupplierService";
import ProductService from "../Services/ProductService";
import { Order, OrderItem, Supplier, Product } from "../Models/types";
import { getUserIdFromToken } from "../Util/AuthService"; // מייבא את הפונקציה לשאוב את ה-userId

const UserOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<"all" | "pending" | "create" | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [checkedProducts, setCheckedProducts] = useState<number[]>([]);
  const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});
  
  // שליפת ה-userId מתוך הטוקן
  const userId = getUserIdFromToken();

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const data = await OrderService.getAll();
      setOrders(data);
      setView("all");
    } catch (error) {
      console.error("שגיאה בקבלת ההזמנות:", error);
      alert("שגיאה בקבלת ההזמנות. אנא נסה מאוחר יותר.");
    }
  };

  // Fetch pending orders
  const fetchPendingOrders = async () => {
    try {
      const data = await OrderService.getPendingOrders();
      setOrders(data);
      setView("pending");
    } catch (error) {
      console.error("שגיאה בקבלת הזמנות ממתינות:", error);
      alert("שגיאה בקבלת הזמנות ממתינות. אנא נסה מאוחר יותר.");
    }
  };

  // Complete order
  const handleCompleteOrder = async (orderId: number) => {
    try {
      await OrderService.changeStatusToComplete(orderId);
      view === "pending" ? fetchPendingOrders() : fetchOrders();
    } catch (error) {
      console.error("שגיאה בהשלמת ההזמנה:", error);
      alert("שגיאה בהשלמת ההזמנה. אנא נסה מאוחר יותר.");
    }
  };

  // Fetch products for selected supplier
  const handleSupplierClick = async (supplierId: number) => {
    setSelectedSupplierId(supplierId);
    try {
      const data = await ProductService.getById(supplierId);
      setProducts([data]); // עטוף את ה-product במערך
      setCheckedProducts([]);
      setProductQuantities({});
    } catch (error) {
      console.error("שגיאה בקבלת המוצרים:", error);
      alert("שגיאה בקבלת המוצרים של הספק. אנא נסה מאוחר יותר.");
    }
  };

  // Handle checkbox change (product selection)
  const handleCheckboxChange = (productId: number) => {
    setCheckedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle quantity change for products
  const handleQuantityChange = (productId: number, increment: boolean) => {
    setProductQuantities((prev) => {
      const currentQty = prev[productId] || 1;
      const newQty = increment ? currentQty + 1 : Math.max(1, currentQty - 1);
      return { ...prev, [productId]: newQty };
    });
  };

  const handleOrderSubmit = async () => {
    if (!selectedSupplierId || checkedProducts.length === 0) {
      alert("נא לבחור מוצרים להזמנה.");
      return;
    }

    const orderItems: OrderItem[] = checkedProducts.map((productId) => {
      const product = products.find((p) => p.id === productId);
      const quantity = productQuantities[productId] || 1;
      return {
        id: 0,
        orderId: 0, // This will be updated after the order is created
        productId: productId,
        quantity: quantity,
        totalPrice: (product?.price || 0) * quantity,
      };
    });

    const newOrder: Order = {
      id: 0,
      userId: userId || 0,  // אם אין יוזר, המשתמש ישלח כ-0
      supplierID: selectedSupplierId,
      orderDate: new Date().toISOString(),  // המרת התאריך לפורמט ISO
      status: "Pending",
      products: products.filter((p) => checkedProducts.includes(p.id || 0)),
    };
    console.log("User ID שנשלח: ", userId);

    console.log("הזמנה לפני שליחה: ", newOrder);
    try {
      console.log("שליחה של הזמנה חדשה: ", newOrder);

      const orderResponse = await OrderService.add(newOrder); // Create the order

      if (!orderResponse) {
        alert("שגיאה ביצירת ההזמנה. אנא נסה שוב.");
        return;
      }

      console.log("ההזמנה נוצרה בהצלחה, נתוני התשובה: ", orderResponse);

      const updatedOrderItems = orderItems.map((item) => ({
        ...item,
        orderId: orderResponse.id,
      }));

      for (const orderItem of updatedOrderItems) {
        console.log("הוספת פריט הזמנה: ", orderItem);
        await OrderItemService.add(orderItem); // Add each order item
      }

      alert("ההזמנה נשלחה בהצלחה!");
      fetchOrders();
      setView("all");

    } catch (error: any) {
      if (error.response) {
        console.error("שגיאה ביצירת ההזמנה:", error.response.data);
        alert("שגיאה ביצירת ההזמנה: " + JSON.stringify(error.response.data.errors));

        const errors = error.response.data.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            console.log(`שדה ${key} בעייתי: ${errors[key].join(", ")}`);
          });
        }
      } else {
        console.error("שגיאה ביצירת ההזמנה:", error);
        alert("שגיאה ביצירת ההזמנה. אנא נסה שוב.");
      }
    }
  };

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchOrders();
    const fetchSuppliers = async () => {
      try {
        const data = await SupplierService.getAll();
        setSuppliers(data);
      } catch (error) {
        console.error("שגיאה בקבלת ספקים:", error);
        alert("שגיאה בקבלת ספקים. אנא נסה מאוחר יותר.");
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ההזמנות שלך</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          ההזמנויות שלי
        </button>
        <button
          onClick={fetchPendingOrders}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          הזמנות שלא הושלמו
        </button>
        <button
          onClick={() => setView("create")}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          צור הזמנה חדשה
        </button>
      </div>

      {view === "create" ? (
        <div>
          <h2>בחר ספק</h2>
          <ul>
            {suppliers.map((supplier) => (
              <li key={supplier.id} onClick={() => handleSupplierClick(supplier.id)}>
                {supplier.companyName}
              </li>
            ))}
          </ul>

          {selectedSupplierId && (
            <>
              <h3>בחר מוצרים לספק {selectedSupplierId}</h3>
              <ul>
                {products.map((product) => (
                  <li key={product.id}>
                    <input
                      type="checkbox"
                      checked={checkedProducts.includes(product.id || 0)}
                      onChange={() => handleCheckboxChange(product.id || 0)}
                    />
                    {product.name} - מחיר: {product.price}, מינימום כמות: {product.minimumQty}

                    <div>
                      <button
                        onClick={() => handleQuantityChange(product.id || 0, false)}
                        disabled={(productQuantities[product.id || 0] || product.minimumQty) <= product.minimumQty}
                      >
                        -
                      </button>
                      <span>{productQuantities[product.id || 0] || product.minimumQty}</span>
                      <button onClick={() => handleQuantityChange(product.id || 0, true)}>+</button>
                    </div>
                  </li>
                ))}
              </ul>

              <button onClick={handleOrderSubmit}>הגש הזמנה</button>
            </>
          )}
        </div>
      ) : (
        view && (
          <div className="grid gap-4">
            {orders.length === 0 ? (
              <p>לא נמצאו הזמנות.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="border border-gray-300 rounded-xl p-4 shadow-md bg-white">
                  <div className="flex flex-col gap-2 text-right">
                    <p><strong>מספר הזמנה:</strong> {order.id}</p>
                    <p><strong>מזהה ספק:</strong> {order.supplierID}</p>
                    <p><strong>תאריך יצירה:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p><strong>סטטוס:</strong> {order.status}</p>

                    {order.status !== "Completed" && view === "all" && (
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="self-start mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        השלם הזמנה
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )
      )}
    </div>
  );
};

export default UserOrdersPage;
