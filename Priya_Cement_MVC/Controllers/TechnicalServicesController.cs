using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
// using Nekta_MVC.Models;

namespace Nekta_MVC.Controllers;

public class TechnicalServicesController : Controller
{
    private readonly ILogger<TechnicalServicesController> _logger;

    public TechnicalServicesController(ILogger<TechnicalServicesController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

 

  
}
