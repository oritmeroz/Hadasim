using AutoMapper;
using Repository.Entities;
using Repository.Interfaces;
using Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services
{
    class OrderService : IOrderService
    {
        private readonly IOrderRepository _repository; // שינויים כאן - משתמשים ב- IOrderRepository
        private readonly IMapper _mapper;

        public OrderService(IOrderRepository repository, IMapper mapper) // שינויים כאן - משתמשים ב- IOrderRepository
        {
            _repository = repository; // שינויים כאן - משתמשים ב- IOrderRepository
            _mapper = mapper;
        }

      

        public OrderDto Get(int id)
        {
            return _mapper.Map<OrderDto>(_repository.Get(id));
        }

        public List<OrderDto> GetAll()
        {
            return _mapper.Map<List<OrderDto>>(_repository.GetAll());
        }
        public OrderDto Add(OrderDto item)
        {
            return _mapper.Map<OrderDto>(_repository.Add(_mapper.Map<Order>(item)));
        }
        // פונקציה להחזרת הזמנות לפי ספק
        public List<OrderDto> GetOrdersBySupplierId(int supplierId)
        {
            var orders = _repository.GetOrdersBySupplierId(supplierId); // עכשיו עובדים עם IOrderRepository
            return _mapper.Map<List<OrderDto>>(orders);
        }

      
        
        public List<OrderDto> GetPendingOrders()
        {
            var orders = _repository.GetPendingOrders();
            return _mapper.Map<List<OrderDto>>(orders);
        }
        public OrderDto ChangeStatusToComplete(int orderId)
        {
            var order = _repository.ChangeStatusToComplete(orderId); // קריאה לפונקציה ברפוזיטורי
            return _mapper.Map<OrderDto>(order); // החזרת אובייקט DTO מעודכן
        }
        public OrderDto ChangeStatusToInProgress(int orderId)
        {
            var order = _repository.ChangeStatusToInProgress(orderId);
            return _mapper.Map<OrderDto>(order);
        }

    }
}
