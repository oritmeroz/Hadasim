import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SupplierService from "../Services/SupplierService";
import ProductService from "../Services/ProductService";  // הוספנו את הייבוא של ProductService
import { Supplier, Product } from "../Models/types";

const RegisterSupplierPage: React.FC = () => {
  const [supplier, setSupplier] = useState<Supplier>({
    companyName: "",
    phoneNumber: "",
    representativeName: "",
    email: "",
    password: "",
    role: "Supplier",
    id: 0,
    products: [],
  });

  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: "",
    price: 0,
    minimumQty: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    if (newProduct.name.trim() === "") return;

    const productToAdd: Product = {
      ...newProduct,
      id: 0,
      price: Number(newProduct.price),
      minimumQty: Number(newProduct.minimumQty),
    };

    try {
      const addedProduct = await ProductService.add(productToAdd);
      setSupplier((prev) => ({
        ...prev,
        Products: [...(prev.products || []), addedProduct],
      }));

      setNewProduct({ id: 0, name: "", price: 0, minimumQty: 0 });
    } catch (error) {
      setError("שגיאה בהוספת המוצר.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!supplier.companyName || !supplier.phoneNumber || !supplier.representativeName || !supplier.email || !supplier.password) {
      setError("וודא שכל השדות מולאו נכון.");
      setLoading(false);
      return;
    }

    try {
      await SupplierService.add(supplier);
      setSuccess(true);
      setTimeout(() => {
        navigate("/home-page");
      }, 2000);
    } catch (err: any) {
      setError("שגיאה בהרשמה: " + JSON.stringify(err.response.data.errors));
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">הוספת ספק</h2>

        {success && <div className="success-message">הספק הוסף בהצלחה! מעביר לדאשבורד...</div>}

        <form onSubmit={handleSubmit}>
          <input type="text" name="CompanyName" placeholder="שם החברה" value={supplier.companyName} onChange={handleChange} required />
          <input type="text" name="PhoneNumber" placeholder="מספר טלפון" value={supplier.phoneNumber} onChange={handleChange} required />
          <input type="text" name="RepresentativeName" placeholder="שם נציג" value={supplier.representativeName} onChange={handleChange} required />
          <input type="email" name="Email" placeholder="אימייל" value={supplier.email} onChange={handleChange} required />
          <input type="password" name="Password" placeholder="סיסמה" value={supplier.password} onChange={handleChange} required />

          <div className="products-section">
            <h4>הוסף מוצרים</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <input
                type="text"
                name="Name"
                placeholder="שם מוצר"
                value={newProduct.name}
                onChange={handleProductChange}
              />
              <input
                type="number"
                name="Price"
                placeholder="מחיר"
                value={newProduct.price}
                onChange={handleProductChange}
              />
              <input
                type="number"
                name="MinimumQty"
                placeholder="כמות מינימלית"
                value={newProduct.minimumQty}
                onChange={handleProductChange}
              />
              <button type="button" onClick={handleAddProduct}>הוסף מוצר</button>
            </div>

            {supplier.products && supplier.products.length > 0 && (
              <ul>
                {supplier.products.map((product, index) => (
                  <li key={index}>
                    {product.name} | מחיר: {product.price}₪ | מינימום: {product.minimumQty}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "מוסיף ספק..." : "הוסף ספק"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterSupplierPage;
