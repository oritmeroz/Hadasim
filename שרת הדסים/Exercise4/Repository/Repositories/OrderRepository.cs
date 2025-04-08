using Repository.Entities;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly IContext _context;

        public OrderRepository(IContext context)
        {
            _context = context;
        }

        public Order Add(Order item)
        {
            _context.Orders.Add(item);
            _context.Save();
            return item;
        }

      

        public List<Order> GetAll()
        {
            return _context.Orders.ToList();
        }
        public Order Get(int id)
        {
            return _context.Orders.FirstOrDefault(x => x.Id == id);
        }
        public List<Order> GetOrdersBySupplierId(int supplierId)
        {
            return _context.Orders.Where(o => o.SupplierID == supplierId).ToList();
        }

       
      
        // פונקציה שמחזירה לבעל מכולת את כל ההזמנות הקיימות זה אומר שהספק עדיין לא אישר אותן
        public List<Order> GetPendingOrders()
        {
            return _context.Orders
                .Where(o =>  o.Status == Status.Pending)
                .ToList();
        }
        public Order ChangeStatusToComplete(int orderId)
        {
            var order = _context.Orders.FirstOrDefault(o => o.Id == orderId);

            if (order == null)
            {
                throw new Exception("ההזמנה לא נמצאה.");
            }

            // עדכון סטטוס ההזמנה ל-"Completed"
            order.Status = Status.Completed;

            //// עדכון תאריך ההשלמה
            //order.CompletedDate = DateTime.Now;

            // שמירה בבסיס הנתונים
            _context.Save();

            // אפשרות לעדכן את הספק כאן
            // לדוגמה, לשלוח הודעה לספק שההזמנה התקבלה (אם יש צורך)

            return order;
        }
        public Order ChangeStatusToInProgress(int orderId)
        {
            var order = _context.Orders.FirstOrDefault(o => o.Id == orderId);

            if (order == null)
            {
                throw new Exception("ההזמנה לא נמצאה.");
            }

            // עדכון סטטוס ההזמנה ל-"In_Progress"
            order.Status = Status.In_Progress;

            // ניתן לעדכן כאן גם תאריך אם צריך (נניח תאריך אישור ההזמנה)

            // שמירה בבסיס הנתונים
            _context.Save();

            return order;
        }

    }
}
