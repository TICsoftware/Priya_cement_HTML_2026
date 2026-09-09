using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
// using Nekta_MVC.Models;

namespace Nekta_MVC.Controllers;

public class PressReleasesController : Controller
{
    private readonly ILogger<PressReleasesController> _logger;

    public PressReleasesController(ILogger<PressReleasesController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

 

  
}
