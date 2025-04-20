using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace erettsegiprojekt
{
    public partial class LoginForm : Form
    {
        public LoginForm()
        {
            InitializeComponent(); 
            button1.Click += (sender, e) => loginbutton();
        }

        private void pictureBox1_Click(object sender, EventArgs e)
        {

        }
        HttpRequests httpRequests = new HttpRequests();
        async void loginbutton()
        {
            bool loginsuccess = await httpRequests.Login(textBox1.Text, textBox2.Text);
            if (loginsuccess)
            {
                this.Hide();
                MainForm felulet = new MainForm();
                felulet.Show();
            }
            else
            {
                MessageBox.Show("Hibás felhasználónév vagy jelszó!");
            }
        }

        private void label2_Click(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            this.Hide();
            SignUpForm regisztracio = new SignUpForm();
            regisztracio.Show();

        }

        private void checkBox2_CheckedChanged(object sender, EventArgs e)
        {
            if (checkBox2.Checked)
            {
                textBox2.PasswordChar = '\0';
            }
            else
            {
                textBox2.PasswordChar = '*';
            }
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }
    }
}
