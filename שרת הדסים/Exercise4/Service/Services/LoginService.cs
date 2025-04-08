using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Repository.Entities;
using Service.Dtos;
using Service.Interfaces;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace Service.Services
{
    public class LoginService : ILoginService
    {
        private readonly IUserService _userService;
        private readonly ISupplierService _supplierService;
        private readonly IConfiguration _config;

        public LoginService(IUserService userService, ISupplierService supplierService, IConfiguration config)
        {
            _userService = userService;
            _supplierService = supplierService;
            _config = config;
        }

        public string GenerateToken(object person)
        {
            // יצירת טוקן עבור משתמש או ספק
            if (person is UserDto user)
            {
                if (string.IsNullOrEmpty(user.Email))
                {
                    throw new ArgumentNullException("Email", "Email cannot be null or empty.");
                }

                if (string.IsNullOrEmpty(user.Role))
                {
                    throw new ArgumentNullException("Role", "Role cannot be null or empty.");
                }

                var claims = new[]
                {
                   new Claim("Name", user.Name),  // שמות עם אותיות גדולות
                   new Claim("Email", user.Email),
                   new Claim("Role", user.Role),
                   new Claim("UserId", user.Id.ToString()),

                    new Claim("UserId", user.Id.ToString())
                };

                return GenerateJwtToken(claims);
            }
            else if (person is SupplierDto supplier)
            {
                if (string.IsNullOrEmpty(supplier.Email))
                {
                    throw new ArgumentNullException("Email", "Email cannot be null or empty.");
                }

                if (string.IsNullOrEmpty(supplier.Role))
                {
                    throw new ArgumentNullException("Role", "Role cannot be null or empty.");
                }

                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, supplier.RepresentativeName),
                    new Claim(ClaimTypes.Email, supplier.Email),
                    new Claim(ClaimTypes.Role, supplier.Role),
                    new Claim("CompanyName", supplier.CompanyName),
                    new Claim("SupplierId", supplier.Id.ToString())
                };

                return GenerateJwtToken(claims);
            }

            throw new ArgumentException("Invalid user type.");
        }

        public string GenerateJwtToken(Claim[] claims)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(45),
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string Authenticate(string email, string password)
        {
            // קודם מחפשים בטבלת המשתמשים
            var user = _userService.GetAll().FirstOrDefault(x => x.Email == email && x.Password == password);
            if (user != null)
            {
                // יצירת טוקן והחזרתו
                var userDto = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role,
                    Password = null // לא מחזירים סיסמה
                };

                var token = GenerateToken(userDto); // יצירת טוקן עבור המשתמש
                return token; // מחזירים רק את ה-token
            }

            // אם לא נמצא, נבדוק אם מדובר בספק
            var supplier = _supplierService.GetAll().FirstOrDefault(x => x.Email == email && x.Password == password);
            if (supplier != null)
            {
                // יצירת טוקן והחזרתו
                var supplierDto = new SupplierDto
                {
                    Id = supplier.Id,
                    CompanyName = supplier.CompanyName,
                    RepresentativeName = supplier.RepresentativeName,
                    Email = supplier.Email,
                    Role = supplier.Role,
                    PhoneNumber = supplier.PhoneNumber,
                    Password = null // לא מחזירים סיסמה
                };

                var token = GenerateToken(supplierDto); // יצירת טוקן עבור הספק
                return token; // מחזירים רק את ה-token
            }

            // אם לא נמצא אף אחד
            return null;
        }
    }
}