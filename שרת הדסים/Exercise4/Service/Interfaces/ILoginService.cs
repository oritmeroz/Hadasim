using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.Dtos;

namespace Service.Interfaces

{

    public interface ILoginService
    {
        string GenerateToken(object person); // מקבל או UserDto או SupplierDto ומייצר טוקן
        string Authenticate(string email, string password); // מחזיר רק את ה-token כטקסט
    }
}
