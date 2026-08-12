using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
// using Nekta_MVC.Models;

namespace Nekta_MVC.Controllers;

public class SolutionsController : Controller
{
    private readonly ILogger<SolutionsController> _logger;

    public SolutionsController(ILogger<SolutionsController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

 

  
}
