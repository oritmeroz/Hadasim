using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
      
        
        Order ChangeStatusToComplete(int orderId);
        List<Order> GetPendingOrders();
        List<Order> GetOrdersBySupplierId(int supplierId);
        Order ChangeStatusToInProgress(int orderId);
    }
}
