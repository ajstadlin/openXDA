﻿<?xml version="1.0" ?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" />

    <xsl:template match="/">
        <html>
        <head>
            <title>Fault detected on <xsl:value-of select="/EventDetail/Line/Name" /> (<xsl:value-of select="/EventDetail/Line/AssetKey" />)</title>

            <style>
                th, td {
                  border-spacing: 0;
                  border-collapse: collapse;
                  padding-left: 5px;
                  padding-right: 5px
                }

                .fault-details {
                  margin-left: 1cm
                }

                .fault-header {
                  font-size: 120%;
                  font-weight: bold;
                  text-decoration: underline
                }

                table {
                  border-spacing: 0;
                  border-collapse: collapse
                }

                table.left tr th, table.left tr td {
                  border: 1px solid black
                }

                table.center tr th, table.center tr td {
                  border: 1px solid black;
                  text-align: center
                }
            </style>
        </head>
        <body>
            <xsl:for-each select="/EventDetail/Faults/Fault">
                <span class="fault-header">Fault <xsl:value-of select="@num" /></span> - <format type="System.DateTime" spec="yyyy-MM-dd HH:mm:ss.fffffff"><xsl:value-of select="SummaryData[1]/Inception" /></format>
                <div class="fault-details">
                    <xsl:variable name="deDistance" select="SummaryData/DoubleEndedDistance" />

                    <table>
                        <xsl:for-each select="SummaryData">
                            <tr>
                                <td><xsl:if test="position() = 1">DFRs:</xsl:if></td>
                                <td><xsl:value-of select="MeterKey" /> at <xsl:value-of select="StationName" /> triggered at <format type="System.DateTime" spec="HH:mm:ss.fffffff"><xsl:value-of select="EventStartTime" /></format> (<a><xsl:attribute name="href">http://pqdashboard/openSEE.aspx?eventid=<xsl:value-of select="EventID" /></xsl:attribute>click for waveform</a>)</td>
                            </tr>
                        </xsl:for-each>

                        <tr>
                            <td>&amp;nbsp;</td>
                            <td>&amp;nbsp;</td>
                        </tr>

                        <xsl:for-each select="SummaryData">
                            <tr>
                                <td><xsl:if test="position() = 1">Files:</xsl:if></td>
                                <td><xsl:value-of select="FileName" /></td>
                            </tr>
                        </xsl:for-each>

                        <tr>
                            <td>&amp;nbsp;</td>
                            <td>&amp;nbsp;</td>
                        </tr>

                        <tr>
                            <td>Line:</td>
                            <td><xsl:value-of select="/EventDetail/Line/Name" /> (<format type="System.Double" spec="0.00"><xsl:value-of select="/EventDetail/Line/Length" /></format> miles)</td>
                        </tr>
                    </table>

                    <br />

                    <table class="left">
                        <tr>
                            <td style="border: 0"></td>
                            <xsl:for-each select="SummaryData">
                                <td style="text-align: center"><xsl:value-of select="StationName" /> - <xsl:value-of select="MeterKey" /></td>
                            </xsl:for-each>
                        </tr>
                        <tr>
                            <td style="border: 0; text-align: right">Fault Type:</td>
                            <xsl:for-each select="SummaryData">
                                <td><xsl:value-of select="FaultType" /></td>
                            </xsl:for-each>
                        </tr>
                        <tr>
                            <td style="border: 0; text-align: right">Inception Time:</td>
                            <xsl:for-each select="SummaryData">
                                <td><format type="System.DateTime" spec="HH:mm:ss.fffffff"><xsl:value-of select="Inception" /></format></td>
                            </xsl:for-each>
                        </tr>
                        <tr>
                            <td style="border: 0; text-align: right">Fault Duration:</td>
                            <xsl:for-each select="SummaryData">
                                <td><format type="System.Double" spec="0.000"><xsl:value-of select="DurationMilliseconds" /></format> msec (<format type="System.Double" spec="0.00"><xsl:value-of select="DurationCycles" /></format> cycles)</td>
                            </xsl:for-each>
                        </tr>
                        <tr>
                            <td style="border: 0; text-align: right">Fault Current:</td>
                            <xsl:for-each select="SummaryData">
                                <td><format type="System.Double" spec="0.0"><xsl:value-of select="FaultCurrent" /></format> Amps (RMS)</td>
                            </xsl:for-each>
                        </tr>
                        <tr>
                            <td style="border: 0; text-align: right">Prefault Current:</td>
                            <xsl:for-each select="SummaryData">
                                <td><format type="System.Double" spec="0.0"><xsl:value-of select="PrefaultCurrent" /></format> Amps (RMS)</td>
                            </xsl:for-each>
                        </tr>
                        <tr>
                            <td style="border: 0; text-align: right">Postfault Current:</td>
                            <xsl:for-each select="SummaryData">
                                <td><format type="System.Double" spec="0.0"><xsl:value-of select="PostfaultCurrent" /></format> Amps (RMS)</td>
                            </xsl:for-each>
                        </tr>
                        <tr>
                            <td style="border: 0; text-align: right">Distance Method:</td>
                            <xsl:for-each select="SummaryData">
                                <td><xsl:value-of select="Algorithm" /></td>
                            </xsl:for-each>
                        </tr>
                        <tr>
                            <td style="border: 0; text-align: right">Single-ended Distance:</td>
                            <xsl:for-each select="SummaryData">
                                <td><format type="System.Double" spec="0.000"><xsl:value-of select="SingleEndedDistance" /></format> miles</td>
                            </xsl:for-each>
                        </tr>
                        <xsl:if test="count($deDistance) &gt; 0">
                            <tr>
                                <td style="border: 0; text-align: right">Double-ended Distance:</td>
                                <xsl:for-each select="SummaryData">
                                    <td>
                                        <xsl:if test="DoubleEndedDistance">
                                            <format type="System.Double" spec="0.000"><xsl:value-of select="DoubleEndedDistance" /></format> miles
                                        </xsl:if>
                                    </td>
                                </xsl:for-each>
                            </tr>
                            <tr>
                                <td style="border: 0; text-align: right">Double-ended Angle:</td>
                                <xsl:for-each select="SummaryData">
                                    <td>
                                        <xsl:if test="DoubleEndedDistance">
                                            <format type="System.Double" spec="0.000"><xsl:value-of select="DoubleEndedAngle" /></format>&amp;deg;
                                        </xsl:if>
                                    </td>
                                </xsl:for-each>
                            </tr>
                        </xsl:if>
                        <tr>
                            <td style="border: 0; text-align: right">openXDA Event ID:</td>
                            <xsl:for-each select="SummaryData">
                                <td><xsl:value-of select="EventID" /></td>
                            </xsl:for-each>
                        </tr>
                    </table>
                </div>

                <br />
            </xsl:for-each>

            <hr />

            <table class="center" style="width: 600px">
                <tr>
                    <th style="border: 0; border-bottom: 1px solid black; border-right: 1px solid black; text-align: center">Line Parameters:</th>
                    <th>Value:</th>
                    <th>Per Mile:</th>
                </tr>
                <tr>
                    <th>Length (Mi)</th>
                    <td><pre><format type="System.Double" spec="0.##"><xsl:value-of select="/EventDetail/Line/Length" /></format></pre></td>
                    <td><pre>1.0</pre></td>
                </tr>
                <tr>
                    <th>
                        Pos-Seq Imp<br />
                        Z1 (Ohm)<br />
                        (LLL,LLLG,LL,LLG)
                    </th>
                    <td>
                        <pre><format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/Z1" /></format>&amp;ang;<format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/A1" /></format>&amp;deg;<br /><format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/R1" /></format>+j<format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/X1" /></format></pre>
                    </td>
                    <td>
                        <pre><format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/Z1 div /EventDetail/Line/Length" /></format>&amp;ang;<format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/A1" /></format>&amp;deg;<br /><format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/R1 div /EventDetail/Line/Length" /></format>+j<format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/Z1 div /EventDetail/Line/Length" /></format></pre>
                    </td>
                </tr>
                <tr>
                    <th>
                        Zero-Seq Imp<br />
                        Z0 (Ohm)
                    </th>
                    <td>
                        <pre><format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/Z0" /></format>&amp;ang;<format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/A0" /></format>&amp;deg;<br /><format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/R0" /></format>+j<format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/X0" /></format></pre>
                    </td>
                    <td>
                        <pre><format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/Z0 div /EventDetail/Line/Length" /></format>&amp;ang;<format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/A0" /></format>&amp;deg;<br /><format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/R0 div /EventDetail/Line/Length" /></format>+j<format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/X0 div /EventDetail/Line/Length" /></format></pre>
                    </td>
                </tr>
                <tr>
                    <th>
                        Loop Imp<br />
                        ZS (Ohm)<br />
                        (LG)
                    </th>
                    <td>
                        <pre><format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/ZS" /></format>&amp;ang;<format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/AS" /></format>&amp;deg;<br /><format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/RS" /></format>+j<format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/XS" /></format></pre>
                    </td>
                    <td>
                        <pre><format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/ZS div /EventDetail/Line/Length" /></format>&amp;ang;<format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/AS" /></format>&amp;deg;<br /><format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/RS div /EventDetail/Line/Length" /></format>+j<format type="System.Double" spec="0.####"><xsl:value-of select="/EventDetail/Line/XS div /EventDetail/Line/Length" /></format></pre>
                    </td>
                </tr>
            </table>
        </body>
    </html>
</xsl:template>

</xsl:stylesheet>