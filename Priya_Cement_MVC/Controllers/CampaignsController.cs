using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
// using Nekta_MVC.Models;

namespace Nekta_MVC.Controllers;

public class CampaignsController : Controller
{
    private readonly ILogger<CampaignsController> _logger;

    public CampaignsController(ILogger<CampaignsController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

 

  
}
