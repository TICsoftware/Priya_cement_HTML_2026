using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Priya_cement_MVC.Models;
using Priya_cement_MVC.Classes;
using Priya_cement_BusinessLogic.BAL;
using Priya_cement_BusinessLogic;
using Priya_cement_MVC.Helpers;

namespace Priya_cement_MVC.Controllers;

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
