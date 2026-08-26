using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
// using Nekta_MVC.Models;

namespace Nekta_MVC.Controllers;

public class FinancialInformationController : Controller
{
    private readonly ILogger<FinancialInformationController> _logger;

    public FinancialInformationController(ILogger<FinancialInformationController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

 

  
}
