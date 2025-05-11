using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Windows.Forms;

namespace erettsegiprojekt
{
    public class HttpRequests
    {

        HttpClient client = new HttpClient();
        private async Task<string> Everything(string url, string requestType, object jsonData = null)
        {

            string serverUrl = "http://127.1.1.1:3000/" + url;
            try
            {
                HttpResponseMessage response = null;
                if (requestType.ToLower() == "get")
                {
                    response = await client.GetAsync(serverUrl);
                }
                else if (requestType.ToLower() == "post")
                {
                    string jsonString = JsonConvert.SerializeObject(jsonData);
                    HttpContent sendThis = new StringContent(jsonString, Encoding.UTF8, "Application/JSON");
                    response = await client.PostAsync(serverUrl, sendThis);
                }
                else if (requestType.ToLower() == "put")
                {
                    string jsonString = JsonConvert.SerializeObject(jsonData);
                    HttpContent sendThis = new StringContent(jsonString, Encoding.UTF8, "Application/JSON");
                    response = await client.PutAsync(serverUrl, sendThis);
                }
                else if (requestType.ToLower() == "delete")
                {
                    response = await client.DeleteAsync(serverUrl);
                }
                response.EnsureSuccessStatusCode();
                string stringResult = await response.Content.ReadAsStringAsync();
                return stringResult;

            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
                return "";
            }
        }
        public async Task<string> Registration(string username, string password)
        {
            string url = "register";
            try
            {
                var jsonData = new
                {
                    registerName = username,
                    registerPassword = password
                };

                string result = await Everything(url, "post", jsonData);
                string message = JsonConvert.DeserializeObject<jsonResponseData>(result).message;

                return message;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        }

        public async Task<bool> FillList(List<Alkatresz> alkatreszek)
        {
            string url = "http://127.1.1.1:3000/parts";
            try
            {      
                HttpResponseMessage response = await client.GetAsync(url);
                string result = await response.Content.ReadAsStringAsync();
                string message = JsonConvert.DeserializeObject<jsonResponseData>(result).message;
                Token.token = JsonConvert.DeserializeObject<jsonResponseData>(result).token;
                MessageBox.Show(message);
                return response.IsSuccessStatusCode;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return false;
            }

        }

        public async Task<bool> Login(string username, string password)
        {
            string url = "http://127.1.1.1:3000/login";
            try
            {
                var jsonData = new
                {
                    loginName = username,
                    loginPassword = password
                };

                string json = JsonConvert.SerializeObject(jsonData);
                HttpContent sendthis = new StringContent(json, Encoding.UTF8, "Application/JSON");
                HttpResponseMessage response = await client.PostAsync(url, sendthis);

                string result = await response.Content.ReadAsStringAsync();

                string message = JsonConvert.DeserializeObject<jsonResponseData>(result).message;
                Token.token = JsonConvert.DeserializeObject<jsonResponseData>(result).token;
                MessageBox.Show(message);
                return response.IsSuccessStatusCode;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return false;
            }

        }
    }
}
