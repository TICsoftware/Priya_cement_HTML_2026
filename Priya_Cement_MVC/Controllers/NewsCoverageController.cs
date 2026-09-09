using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
// using Nekta_MVC.Models;

namespace Nekta_MVC.Controllers;

public class NewsCoverageController : Controller
{
    private readonly ILogger<NewsCoverageController> _logger;

    public NewsCoverageController(ILogger<NewsCoverageController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

 

  
}
