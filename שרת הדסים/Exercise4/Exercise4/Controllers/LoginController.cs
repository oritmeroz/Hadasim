﻿using Microsoft.AspNetCore.Mvc;
using Service.Dtos;
using Service.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MasterEvents.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost]
        public IActionResult Login([FromForm] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest("Identifier (email/phone) and password are required.");
            }

            var token = _loginService.Authenticate(loginDto.Email, loginDto.Password);
            if (token != null)
            {
                return Ok(new { Token = token });
            }
            return Unauthorized("Invalid credentials");
        }
        [HttpGet("{token}/getRole")]
        public IActionResult GetRoleFromToken(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return BadRequest("Token is required");
            }

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "Role" || c.Type == ClaimTypes.Role);

                if (roleClaim == null)
                {
                    return NotFound("Role not found in token");
                }

                return Ok(roleClaim.Value);
            }
            catch (Exception ex)
            {
                return BadRequest($"Invalid token: {ex.Message}");
            }
        }
       
    }
}
