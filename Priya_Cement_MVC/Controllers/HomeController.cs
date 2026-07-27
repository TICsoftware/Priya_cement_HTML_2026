using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Nekta_MVC.Models;
using Nekta_MVC.Classes;
using Priya_cement_BusinessLogic.BAL;
using Priya_cement_BusinessLogic;
using Nekta_MVC.Helpers;

namespace Nekta_MVC.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;


    public HomeController(ILogger<HomeController> logger, IConfiguration configuration)
    {
        _logger = logger;
    
       
    }



    public IActionResult Index()
    {
        return View();
    }


}
