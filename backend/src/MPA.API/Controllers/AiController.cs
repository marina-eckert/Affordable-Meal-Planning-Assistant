using Microsoft.AspNetCore.Mvc;
using OpenAI.Chat;

namespace MPA.API.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AiController : ControllerBase
    {
        private readonly ChatClient _chat;

        public AiController(IConfiguration config)
        {
            var apiKey = config["OpenAI:ApiKey"];
            _chat = new ChatClient("gpt-4.1-mini", apiKey);
        }

        public class ChatRequest
        {
            public required string Message { get; set; }
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest req)
        {
            var result = await _chat.CompleteChatAsync(req.Message);

            return Ok(new
            {
                reply = result.Value.Content[0].Text
            });
        }
    }
}
