﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GSF.Data.Model;

namespace openXDA.Model
{
    [TableName("DefaultAlarmRangeLimit")]
    public class DefaultAlarmRangeLimit
    {
        [PrimaryKey(true)]
        public int ID { get; set; }
        public int MeasurementTypeID { get; set; }
        public int MeasurementCharacteristicID { get; set; }
        public int AlarmTypeID { get; set; }
        public int Severity { get; set; }
        public float High { get; set; }
        public float Low { get; set; }
        public int RangeInclusive { get; set; }
        public int PerUnit { get; set; }
    }
}
