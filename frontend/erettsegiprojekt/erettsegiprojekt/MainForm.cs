using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text.Json;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace erettsegiprojekt
{
    public partial class MainForm : Form
    {

        public MainForm()
        {
            InitializeComponent();
            updateGridView();
        }

        private async void updateGridView()
        {
            List<Alkatresz> alkatreszek = new List<Alkatresz>();
            string apiUrl = "http://127.1.1.1:3000/parts";

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    
                    HttpResponseMessage response = await client.GetAsync(apiUrl);

                    
                    if (response.IsSuccessStatusCode)
                    {
                        // Read the response content as a JSON string
                        string jsonResponse = await response.Content.ReadAsStringAsync();

                        // Deserialize the JSON into a list of Alkatresz objects
                        alkatreszek = JsonSerializer.Deserialize<List<Alkatresz>>(jsonResponse);

                        // Bind the list to the DataGridView
                        dataGridView1.DataSource = null; // Clear any existing data
                        dataGridView1.DataSource = alkatreszek;
                    }
                    else
                    {
                        // Handle HTTP response errors
                        MessageBox.Show($"Hiba történt az adatok lekérdezésekor: {response.StatusCode} - {response.ReasonPhrase}");
                    }
                }
            }
            catch (HttpRequestException httpEx)
            {
                // Handle network-related errors
                MessageBox.Show($"Hálózati hiba történt: {httpEx.Message}");
            }
            catch (JsonException jsonEx)
            {
                // Handle JSON deserialization errors
                MessageBox.Show($"Hiba történt az adatok feldolgozása során: {jsonEx.Message}");
            }
            catch (Exception ex)
            {
                // Handle any other unexpected errors
                MessageBox.Show($"Ismeretlen hiba történt: {ex.Message}");
            }
        }


        private async void newButton_Click(object sender, EventArgs e)
        {
            // Validate input
            string id1 = textBox1.Text.Trim();
            string name = textBox2.Text.Trim();
            string price = textBox3.Text.Trim();
            int stock = textBox4.Text.Trim();

           

            // Create the new item
            Alkatresz newItem = new Alkatresz
            {
                
                nev = name,
                ar = price,
                raktarkeszlet = stock
            };

            try
            {
                // API URL for adding the new item
                string apiUrl = "http://127.1.1.1:3000/parts";

                using (HttpClient client = new HttpClient())
                {
                    // Serialize the new item to JSON
                    string json = JsonSerializer.Serialize(newItem);
                    StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                    // Send POST request to the server
                    HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                    if (response.IsSuccessStatusCode)
                    {
                        // Add the new item to the DataGridView
                        List<Alkatresz> alkatreszek = dataGridView1.DataSource as List<Alkatresz>;
                        alkatreszek.Add(newItem);

                        // Rebind the updated list to the DataGridView
                        dataGridView1.DataSource = null;
                        dataGridView1.DataSource = alkatreszek;

                        MessageBox.Show("Az új alkatrész sikeresen hozzáadva az adatbázishoz.");

                        // Clear the textboxes
                        textBox1.Clear();
                        textBox2.Clear();
                        textBox3.Clear();
                        textBox4.Clear();
                    }
                    else
                    {
                        MessageBox.Show($"Hiba történt az új alkatrész hozzáadásakor: {response.StatusCode} - {response.ReasonPhrase}");
                    }
                }
            }
            catch (HttpRequestException httpEx)
            {
                MessageBox.Show($"Hálózati hiba történt: {httpEx.Message}");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Ismeretlen hiba történt: {ex.Message}");
            }
        }


        private void updateButton_Click(object sender, EventArgs e)
        {

        }

        private async void deleteButton_Click(object sender, EventArgs e)
{
    // Ensure a row is selected
    if (dataGridView1.SelectedRows.Count > 0)
    {
        // Get the selected row
        DataGridViewRow selectedRow = dataGridView1.SelectedRows[0];

        // Get the bound item (Alkatresz) from the selected row
        Alkatresz selectedItem = selectedRow.DataBoundItem as Alkatresz;

        if (selectedItem != null)
        {
            // Confirm deletion
            DialogResult result = MessageBox.Show("Biztosan törölni szeretnéd a kijelölt elemet?", "Megerősítés", MessageBoxButtons.YesNo);
            if (result == DialogResult.Yes)
            {
                try
                {
                    // API URL for deleting the item
                    string apiUrl = $"http://127.1.1.1:3000/parts/{selectedItem.id}";

                    using (HttpClient client = new HttpClient())
                    {
                        // Send DELETE request to the server
                        HttpResponseMessage response = await client.DeleteAsync(apiUrl);

                        if (response.IsSuccessStatusCode)
                        {
                            // Remove the item from the data source (List<Alkatresz>)
                            List<Alkatresz> alkatreszek = dataGridView1.DataSource as List<Alkatresz>;
                            alkatreszek.Remove(selectedItem);

                            // Rebind the updated list to the DataGridView
                            dataGridView1.DataSource = null;
                            dataGridView1.DataSource = alkatreszek;

                            MessageBox.Show("Az elem sikeresen törölve lett az adatbázisból.");
                        }
                        else
                        {
                            MessageBox.Show($"Hiba történt az elem törlésekor: {response.StatusCode} - {response.ReasonPhrase}");
                        }
                    }
                }
                catch (HttpRequestException httpEx)
                {
                    MessageBox.Show($"Hálózati hiba történt: {httpEx.Message}");
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Ismeretlen hiba történt: {ex.Message}");
                }
            }
        }
    }
    else
    {
        MessageBox.Show("Kérlek válassz ki egy elemet a törléshez!");
    }
}

        private void label1_Click(object sender, EventArgs e)
        {

        }
    }
}
