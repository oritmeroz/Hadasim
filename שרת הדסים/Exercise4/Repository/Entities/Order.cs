using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entities
{
    public enum Status
    {
    Pending, In_Progress, Completed
    }
    public class Order
    {
        public int Id { get; set; }
        [ForeignKey("UserId")]
        public int UserId { get; set; }
        public virtual User User { get; set; }
        [ForeignKey("SupplierID")]
        public int SupplierID { get; set; }
        public virtual Supplier Supplier { get; set; }
        public DateTime OrderDate { get; set; }
        public Status Status { get; set; }
        //public DateTime CompletedDate { get; set; }
        public List<Product> Products;
    }
}
