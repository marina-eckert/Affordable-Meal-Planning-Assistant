using System.Text;
using System.Text.Json;
using MPA.API.DTOs;

namespace MPA.API.Services
{
    public class GeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GeminiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["GEMINI_API_KEY"];
        }

        public async Task<string> GetChatResponseAsync(string userMessage)
        {
            var cleanKey = _apiKey?.Trim();

            if (string.IsNullOrEmpty(cleanKey))
                return "Server Error: API Key is missing.";

            // WE ARE USING THE MODEL FOUND IN YOUR LIST: gemini-2.0-flash
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={cleanKey}";

            var payload = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = userMessage } } }
                }
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(payload), 
                Encoding.UTF8, 
                "application/json");

            try 
            {
                var response = await _httpClient.PostAsync(url, jsonContent);

                if (!response.IsSuccessStatusCode)
                {
                    // If this happens, it will tell us exactly why
                    var errorBody = await response.Content.ReadAsStringAsync();
                    return $"Google Error ({response.StatusCode}): {errorBody}";
                }

                var responseString = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(responseString);
                
                // Extract the bot's reply
                return doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString() ?? "No response text.";
            }
            catch (Exception ex)
            {
                return $"System Error: {ex.Message}";
            }
        }
    }
}