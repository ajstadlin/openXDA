﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace openXDA.Model
{
    public class EmailGroupSecurityGroup
    {
        public int ID { get; set; }
        public int EmailGroupID { get; set; }
        public int SecurityGroupID { get; set; }
    }
}