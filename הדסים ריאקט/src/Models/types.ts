export interface Supplier
{
    id:number
    companyName:string
    phoneNumber:string 
    representativeName:string  
    password:string
    role:string
    email:string
    products?: Product[];
};
export interface User
{
    Id:number
    Name:string
    Password:string
    Email:string
    Role:string

};
export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    totalPrice: number;
  };

export enum States {
    InProcess,
    Completed,
    Pending
}
export interface Product
{
   id:number
   name:string
   price:number
   minimumQty:number
};
// ממשק עבור הזמנה (Order)
export interface Order {
    id: number; // מזהה ההזמנה
    userId: number; // מזהה בעל המכולת (User)
    supplierID: number; // מזהה הספק (Supplier)
    orderDate: string; // תאריך הזמנה
    status: 'Pending' | 'In_Progress' | 'Completed'; // סטטוס הזמנה
    // completedDate?: Date; // תאריך סיום הזמנה (אם הסטטוס הוא Completed)
    user?: User; // אובייקט המשתמש המוגדר כ-BelongsTo (לא חובה להיות כאן לפי הצורך)
    supplier?: Supplier; // אובייקט הספק המוגדר כ-BelongsTo (לא חובה להיות כאן לפי הצורך)
    products?: Product[]; // רשימת המוצרים בהזמנה
  };
  export interface SupplierProduct {
    Id: number;
    SupplierID: number;
    ProductID: number;
  }
  