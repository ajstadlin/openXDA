﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GSF.Data.Model;

namespace openXDA.Model
{
    public class GroupMeter
    {
        [PrimaryKey(true)]
        public int ID { get; set; }
        public int MeterID { get; set; }
        public int GroupID { get; set; }
    }
}
