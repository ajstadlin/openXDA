﻿//******************************************************************************************************
//  InterruptionDataResource.cs - Gbtc
//
//  Copyright © 2015, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may
//  not use this file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  08/29/2015 - Stephen C. Wills
//       Generated original version of source code.
//
//******************************************************************************************************

using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using FaultData.DataAnalysis;
using FaultData.Database;
using FaultData.DataSets;
using GSF.Collections;

namespace FaultData.DataResources
{
    public class InterruptionDataResource : DataResourceBase<MeterDataSet>
    {
        #region [ Members ]

        // Fields
        private DbAdapterContainer m_dbAdapterContainer;

        private double m_systemFrequency;
        private double m_interruptionThreshold;
        private Dictionary<DataGroup, List<Disturbance>> m_interruptions;

        #endregion

        #region [ Constructors ]

        private InterruptionDataResource(DbAdapterContainer dbAdapterContainer)
        {
            m_dbAdapterContainer = dbAdapterContainer;
        }

        #endregion

        #region [ Properties ]

        [Setting]
        public double SystemFrequency
        {
            get
            {
                return m_systemFrequency;
            }
            set
            {
                m_systemFrequency = value;
            }
        }

        [Setting]
        public double InterruptionThreshold
        {
            get
            {
                return m_interruptionThreshold;
            }
            set
            {
                m_interruptionThreshold = value;
            }
        }

        public Dictionary<DataGroup, List<Disturbance>> Interruptions
        {
            get
            {
                return m_interruptions;
            }
        }

        #endregion

        #region [ Methods ]

        public override void Initialize(MeterDataSet meterDataSet)
        {
            VoltageDisturbanceAnalyzer voltageDisturbanceAnalyzer;

            voltageDisturbanceAnalyzer = new VoltageDisturbanceAnalyzer(IsInterruption, IsMoreSevere, EventClassification.Interruption);
            voltageDisturbanceAnalyzer.Initialize(meterDataSet, m_dbAdapterContainer);

            m_interruptions = voltageDisturbanceAnalyzer.Disturbances;
        }

        private bool IsInterruption(DataPoint dataPoint)
        {
            return dataPoint.Value <= m_interruptionThreshold;
        }

        private bool IsMoreSevere(double mag1, double mag2)
        {
            return mag1 < mag2;
        }

        #endregion

        #region [ Static ]

        // Static Methods
        public static InterruptionDataResource GetResource(MeterDataSet meterDataSet, DbAdapterContainer dbAdapterContainer)
        {
            return meterDataSet.GetResource(() => new InterruptionDataResource(dbAdapterContainer));
        }

        #endregion
    }
}
