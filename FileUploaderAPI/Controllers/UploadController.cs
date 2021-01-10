using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FileUploaderAPI.Controllers
{
    [ApiController]
    public class UploadController : ControllerBase
    {

        [HttpPost, DisableRequestSizeLimit]
        [Route("api/Upload/UploadFiles")]
        public IActionResult UploadFiles()
        {
            try
            {
                var file = Request.Form.Files[0];
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "Resources");
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine("Resources", fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}