using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface IOrderService : IService<OrderDto>
    {
        // החזרת הזמנות לפי מזהה ספק
        List<OrderDto> GetOrdersBySupplierId(int supplierId);
        List<OrderDto> GetPendingOrders();
        OrderDto ChangeStatusToComplete(int orderId);
        OrderDto ChangeStatusToInProgress(int orderId);


    }
}
