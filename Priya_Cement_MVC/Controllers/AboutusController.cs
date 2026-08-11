using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
// using Nekta_MVC.Models;

namespace Nekta_MVC.Controllers;

public class AboutusController : Controller
{
    private readonly ILogger<AboutusController> _logger;

    public AboutusController(ILogger<AboutusController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

 

  
}
