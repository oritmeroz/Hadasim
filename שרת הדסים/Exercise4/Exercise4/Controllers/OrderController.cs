using Microsoft.AspNetCore.Mvc;
using Repository.Entities;
using Service.Dtos;
using Service.Interfaces;
using System.Collections.Generic;

namespace Exercise4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrderController(IOrderService service)
        {
            _service = service;
        }

        // GET: api/<OrderController>
        [HttpGet]
        public IEnumerable<OrderDto> Get()
        {
            return _service.GetAll();
        }

        // GET api/<OrderController>/5
        [HttpGet("{id}")]
        public OrderDto Get(int id)
        {
            return _service.Get(id);
        }

        // POST api/<OrderController>
        [HttpPost]
        public void Post([FromForm] OrderDto value)
        {
            _service.Add(value);
        }

        
        [HttpGet("supplier/{supplierId}")]
        public IEnumerable<OrderDto> GetOrdersBySupplierId(int supplierId)
        {
            return _service.GetOrdersBySupplierId(supplierId);
        }

       
        
        [HttpGet("user/pending")]
        public IEnumerable<OrderDto> GetPendingOrders()
        {
            return _service.GetPendingOrders();
        }
        [HttpPut("status-complete/{orderId}")]
        public IActionResult ChangeStatusToComplete(int orderId)
        {
            try
            {
                var updatedOrder = _service.ChangeStatusToComplete(orderId); // קריאה לשירות לאישור קבלת הזמנה
                return Ok(updatedOrder); // החזרת הזמנה מעודכנת
            }
            catch (Exception ex)
            {
                return BadRequest($"Error confirming order: {ex.Message}");
            }
        }
        [HttpPut("status-inprogress/{orderId}")]
        public IActionResult ChangeStatusToInProgress(int orderId)
        {
            try
            {
                var updatedOrder = _service.ChangeStatusToInProgress(orderId); // קריאה לשירות
                return Ok(updatedOrder); // החזרת הזמנה עם סטטוס מעודכן
            }
            catch (Exception ex)
            {
                return BadRequest($"Error changing order status to In_Progress: {ex.Message}");
            }
        }
    }
}
