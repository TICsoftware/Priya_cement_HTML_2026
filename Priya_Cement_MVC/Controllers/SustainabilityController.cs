using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
// using Nekta_MVC.Models;

namespace Nekta_MVC.Controllers;

public class SustainabilityController : Controller
{
    private readonly ILogger<SustainabilityController> _logger;

    public SustainabilityController(ILogger<SustainabilityController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

 

  
}
