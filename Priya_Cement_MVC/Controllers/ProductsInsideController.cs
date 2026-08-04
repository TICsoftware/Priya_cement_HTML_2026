using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
// using Nekta_MVC.Models;

namespace Nekta_MVC.Controllers;

public class ProductsInsideController : Controller
{
    private readonly ILogger<ProductsInsideController> _logger;

    public ProductsInsideController(ILogger<ProductsInsideController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

 

  
}
