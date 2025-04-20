using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace erettsegiprojekt
{
    public class Alkatresz
    {
        public int id { get; set; }
        public string nev { get; set; }
        public int ar { get; set; }
        public int raktarkeszlet { get; set; }

        public Alkatresz(int id, string nev, int ar, int raktarkeszlet)
        {
            this.id = id;
            this.nev = nev;
            this.ar = ar;
            this.raktarkeszlet = raktarkeszlet;
        }   
    }
}
