﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GSF.Data.Model;

namespace openXDA.Model
{
    public class Meter
    {
        [PrimaryKey(true)]
        public int ID { get; set; }

        [StringLength(50)]
        public string AssetKey { get; set; }

        [Label("Location")]
        public int MeterLocationID { get; set; }

        [Searchable]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(200)]
        public string Alias { get; set; }

        [StringLength(12)]
        public string ShortName { get; set; }

        [StringLength(200)]
        public string Make { get; set; }

        [StringLength(200)]
        public string Model { get; set; }

        [StringLength(200)]
        public string TimeZone { get; set; }

        public string Description { get; set; }
    }

    public class MeterDetail : Meter
    {
        public string Location { get; set; }

        public string TimeZoneLabel
        {
            get
            {
                try
                {
                    if (TimeZone != "UTC")
                        return TimeZoneInfo.FindSystemTimeZoneById(TimeZone).ToString();
                }
                catch
                {
                    // Do not fail if the time zone cannot be found --
                    // instead, fall through to the logic below to
                    // find the label for UTC
                }

                return TimeZoneInfo.GetSystemTimeZones()
                    .Where(info => info.Id == "UTC")
                    .DefaultIfEmpty(TimeZoneInfo.Utc)
                    .First()
                    .ToString();
            }
        }
    }
}
