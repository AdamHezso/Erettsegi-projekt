
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

namespace erettsegiprojekt
{
    public partial class MainForm : Form
    {
        // Konstruktor – amikor a MainForm példányosítva van, inicializálja a komponenst és frissíti a táblázatot
        public MainForm()
        {
            InitializeComponent();
            updateGridView(); // Az adatokat betölti a DataGridView-be induláskor
        }

        // Ez a metódus lekéri a szerverről az alkatrészeket, és betölti a DataGridView-be
        private async void updateGridView()
        {
            List<Alkatresz> alkatreszek = new List<Alkatresz>(); // Lista az alkatrészeknek
            string apiUrl = "http://127.1.1.1:3000/parts"; // API végpont

            try
            {
                using (HttpClient client = new HttpClient()) // HTTP-kliens létrehozása
                {
                    // Aszinkron GET kérés a szerver felé
                    HttpResponseMessage response = await client.GetAsync(apiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        // A válasz tartalmának beolvasása stringként
                        string jsonResponse = await response.Content.ReadAsStringAsync();

                        // JSON deszerializálása Alkatresz objektum listává
                        alkatreszek = JsonSerializer.Deserialize<List<Alkatresz>>(jsonResponse);

                        // A kapott adatokat megjelenítjük a táblázatban
                        dataGridView1.DataSource = null; // Régi adat törlése
                        dataGridView1.DataSource = alkatreszek; // Új adat beállítása
                    }
                    else
                    {
                        // Ha nem sikeres a kérés, hibát jelez
                        MessageBox.Show($"Hiba történt az adatok lekérdezésekor: {response.StatusCode} - {response.ReasonPhrase}");
                    }
                }
            }
            catch (HttpRequestException httpEx)
            {
                MessageBox.Show($"Hálózati hiba történt: {httpEx.Message}");
            }
            catch (JsonException jsonEx)
            {
                MessageBox.Show($"Hiba történt az adatok feldolgozása során: {jsonEx.Message}");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Ismeretlen hiba történt: {ex.Message}");
            }
        }

        // Törlés gomb eseménykezelője – a kiválasztott elem törlése
        private async void deleteButton_Click(object sender, EventArgs e)
        {
            if (dataGridView1.SelectedRows.Count > 0)
            {
                DataGridViewRow selectedRow = dataGridView1.SelectedRows[0];
                Alkatresz selectedItem = selectedRow.DataBoundItem as Alkatresz;

                if (selectedItem != null)
                {
                    DialogResult result = MessageBox.Show("Biztosan törölni szeretnéd a kijelölt elemet?", "Megerősítés", MessageBoxButtons.YesNo);
                    if (result == DialogResult.Yes)
                    {
                        try
                        {
                            string apiUrl = $"http://127.1.1.1:3000/parts/{selectedItem.id}";

                            using (HttpClient client = new HttpClient())
                            {
                                // Törlés a szerveren
                                HttpResponseMessage response = await client.DeleteAsync(apiUrl);

                                if (response.IsSuccessStatusCode)
                                {
                                    // A sikeres törlés után frissítjük a listát
                                    List<Alkatresz> alkatreszek = dataGridView1.DataSource as List<Alkatresz>;
                                    alkatreszek.Remove(selectedItem);

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

        // Új alkatrész hozzáadása
        private async void newButton_Click(object sender, EventArgs e)
        {
            string idInput = textBox1.Text.Trim();
            string name = textBox2.Text.Trim();
            string priceInput = textBox3.Text.Trim();
            string stockInput = textBox4.Text.Trim();

            // Validáció: minden mező ki van töltve?
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(priceInput) || string.IsNullOrWhiteSpace(stockInput))
            {
                MessageBox.Show("Minden mezőt ki kell tölteni!");
                return;
            }

            // Ár és készlet ellenőrzése, számok-e
            if (!int.TryParse(priceInput, out int price))
            {
                MessageBox.Show("Az árnak érvényes számnak kell lennie!");
                return;
            }

            if (!int.TryParse(stockInput, out int stock))
            {
                MessageBox.Show("A raktárkészletnek érvényes számnak kell lennie!");
                return;
            }

            // Új objektum létrehozása az API-nak
            var newItem = new
            {
                nev = name,
                ar = price,
                raktarkeszlet = stock
            };

            try
            {
                string apiUrl = "http://127.1.1.1:3000/parts";

                using (HttpClient client = new HttpClient())
                {
                    string json = JsonSerializer.Serialize(newItem);
                    StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                    // Új alkatrész beküldése POST-tal
                    HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                    if (response.IsSuccessStatusCode)
                    {
                        updateGridView(); // Lista frissítése

                        MessageBox.Show("Az új elem sikeresen hozzáadva az adatbázishoz.");

                        // Mezők törlése
                        textBox1.Clear();
                        textBox2.Clear();
                        textBox3.Clear();
                        textBox4.Clear();
                    }
                    else
                    {
                        MessageBox.Show($"Hiba történt az új elem hozzáadásakor: {response.StatusCode} - {response.ReasonPhrase}");
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

        // Módosítás gomb – meglévő alkatrész módosítása
        private async void modifyButton_Click_1(object sender, EventArgs e)
        {
            string idInput = textBox1.Text.Trim();
            string name = textBox2.Text.Trim();
            string priceInput = textBox3.Text.Trim();
            string stockInput = textBox4.Text.Trim();

            // Validáció
            if (string.IsNullOrWhiteSpace(idInput) || string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(priceInput) || string.IsNullOrWhiteSpace(stockInput))
            {
                MessageBox.Show("Minden mezőt ki kell tölteni!");
                return;
            }

            if (!int.TryParse(idInput, out int id))
            {
                MessageBox.Show("Az ID-nak érvényes számnak kell lennie!");
                return;
            }

            if (!int.TryParse(priceInput, out int price))
            {
                MessageBox.Show("Az árnak érvényes számnak kell lennie!");
                return;
            }

            if (!int.TryParse(stockInput, out int stock))
            {
                MessageBox.Show("A raktárkészletnek érvényes számnak kell lennie!");
                return;
            }

            var updatedItem = new
            {
                nev = name,
                ar = price,
                raktarkeszlet = stock
            };

            try
            {
                string apiUrl = $"http://127.1.1.1:3000/parts/{id}";

                using (HttpClient client = new HttpClient())
                {
                    string json = JsonSerializer.Serialize(updatedItem);
                    StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                    HttpResponseMessage response = await client.PutAsync(apiUrl, content);

                    if (response.IsSuccessStatusCode)
                    {
                        updateGridView();
                        MessageBox.Show("Az elem sikeresen módosítva lett az adatbázisban.");
                        textBox1.Clear();
                        textBox2.Clear();
                        textBox3.Clear();
                        textBox4.Clear();
                    }
                    else
                    {
                        MessageBox.Show($"Hiba történt az elem módosításakor: {response.StatusCode} - {response.ReasonPhrase}");
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

        // ID mező változására reagál – betölti a mezőbe tartozó elemet
        private async void textBox1_TextChanged(object sender, EventArgs e)
        {
            string idInput = textBox1.Text.Trim();

            if (!int.TryParse(idInput, out int id))
            {
                textBox2.Clear();
                textBox3.Clear();
                textBox4.Clear();
                return;
            }

            try
            {
                string apiUrl = $"http://127.1.1.1:3000/parts/{id}";

                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(apiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();
                        var item = JsonSerializer.Deserialize<Alkatresz>(jsonResponse);

                        textBox2.Text = item.nev;
                        textBox3.Text = item.ar.ToString();
                        textBox4.Text = item.raktarkeszlet.ToString();
                    }
                    else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        textBox2.Clear();
                        textBox3.Clear();
                        textBox4.Clear();
                        MessageBox.Show("Az ID-hoz tartozó elem nem található.");
                    }
                    else
                    {
                        MessageBox.Show($"Hiba történt az elem lekérdezésekor: {response.StatusCode} - {response.ReasonPhrase}");
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
