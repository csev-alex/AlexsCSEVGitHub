import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { CalculationResult } from '../../types';
import {
  formatCurrency,
  formatPercent,
  formatKwh,
  formatKw,
  getTierLabel,
  formatDate,
} from '../../utils/formatters';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#4CBC88',
  },
  logoImage: {
    width: 130,
    height: 35,
    objectFit: 'contain',
  },
  reportInfo: {
    textAlign: 'right',
  },
  reportTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#212529',
  },
  reportDate: {
    fontSize: 7,
    color: '#868e96',
    marginTop: 2,
  },
  // Project info - compact inline with better spacing
  projectInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  projectInfoItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    marginRight: 4,
  },
  projectLabel: {
    color: '#666',
    fontSize: 7,
  },
  projectValue: {
    fontWeight: 'bold',
    fontSize: 7,
    marginLeft: 3,
    maxWidth: 80,
  },
  // Usage assumptions summary
  usageAssumptions: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 3,
    padding: 5,
    marginBottom: 8,
    gap: 20,
  },
  assumptionItem: {
    flexDirection: 'row',
  },
  assumptionLabel: {
    fontSize: 7,
    color: '#666',
  },
  assumptionValue: {
    fontSize: 7,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  // Equipment summary
  summaryGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  summaryBox: {
    flex: 1,
    padding: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
  },
  summaryLabel: {
    fontSize: 7,
    color: '#666',
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#212529',
  },
  // Three column layout
  threeColumn: {
    flexDirection: 'row',
    gap: 6,
  },
  columnNarrow: {
    flex: 0.35,
  },
  columnWide: {
    flex: 0.30,
  },
  // Season cards
  seasonCard: {
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  summerHeader: {
    backgroundColor: '#fed7aa',
    padding: 6,
  },
  winterHeader: {
    backgroundColor: '#bfdbfe',
    padding: 6,
  },
  seasonTitle: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  seasonSubtitle: {
    fontSize: 7,
    color: '#666',
  },
  summerBody: {
    backgroundColor: '#fff7ed',
    padding: 6,
  },
  winterBody: {
    backgroundColor: '#eff6ff',
    padding: 6,
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 3,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: '#ffffff',
    marginBottom: 1,
    borderRadius: 2,
  },
  rowLabel: {
    fontSize: 8,
    color: '#555',
  },
  rowValue: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 4,
    marginTop: 3,
    borderRadius: 2,
  },
  summerTotalRow: {
    backgroundColor: '#fed7aa', // Dark orange to match summer header
  },
  winterTotalRow: {
    backgroundColor: '#bfdbfe', // Dark blue to match winter header
  },
  totalLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  // Chart - Vertical bar chart
  chartContainer: {
    marginTop: 6,
    marginBottom: 6,
  },
  chartTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  chartWrapper: {
    flexDirection: 'row',
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    height: 85,
    alignItems: 'flex-end',
  },
  chartColumn: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chartColumnSummer: {
    backgroundColor: '#fff7ed',
  },
  chartColumnWinter: {
    backgroundColor: '#eff6ff',
  },
  chartBarWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  chartBar: {
    width: 22,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  chartBarDelivery: {
    backgroundColor: '#d1d5db', // Light gray
    width: '100%',
  },
  chartBarSupply: {
    backgroundColor: '#4b5563', // Dark gray
    width: '100%',
  },
  chartValueLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  chartLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 6,
    color: '#666',
    paddingTop: 2,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  legendBox: {
    width: 8,
    height: 8,
    borderRadius: 1,
  },
  legendText: {
    fontSize: 6,
    color: '#666',
  },
  // Annual totals
  annualBox: {
    backgroundColor: '#4CBC88',
    padding: 10,
    borderRadius: 4,
    marginTop: 6,
  },
  annualTitle: {
    fontSize: 8,
    color: '#fff',
    marginBottom: 6,
  },
  annualGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  annualItem: {
    flex: 1,
  },
  annualLabel: {
    fontSize: 7,
    color: '#a7f3d0',
  },
  annualValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Rates section
  ratesBox: {
    backgroundColor: '#f8f9fa',
    padding: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  ratesTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rateItem: {
    fontSize: 7,
  },
  rateLabel: {
    color: '#666',
  },
  rateValue: {
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 6,
    color: '#666',
    marginTop: 6,
    lineHeight: 1.3,
  },
  // Revenue section styles
  revenueCard: {
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  revenueHeader: {
    backgroundColor: '#4CBC88',
    padding: 6,
  },
  revenueBody: {
    backgroundColor: '#f0fdf4',
    padding: 6,
  },
  revenueTotalRow: {
    backgroundColor: '#4CBC88',
  },
  revenuePositive: {
    color: '#166534',
  },
  revenueNegative: {
    color: '#dc2626',
  },
  revenueHighlight: {
    backgroundColor: '#4CBC88',
    paddingVertical: 3,
    paddingHorizontal: 4,
    marginTop: 3,
    borderRadius: 2,
  },
  revenueMediumRow: {
    backgroundColor: '#86efac',
    paddingVertical: 3,
    paddingHorizontal: 4,
    marginTop: 3,
    borderRadius: 2,
  },
  // Revenue bar styles for chart
  chartBarRevenue: {
    backgroundColor: '#4CBC88',
    width: '100%',
  },
  // Line plot styles
  linePoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#f59e0b',
    position: 'absolute',
  },
  linePlotArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

interface PDFReportProps {
  results: CalculationResult;
}

export const PDFReport: React.FC<PDFReportProps> = ({ results }) => {
  const { project, yearly, ratesUsed, monthly } = results;

  // Monthly profit (customer final revenue after all deductions including energy costs)
  const monthlyProfit = results.revenue?.monthlyCustomerFinalRevenue ?? 0;

  // Calculate max cost for chart scaling - January to December order
  const monthlyData = [
    { label: 'Jan', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit },
    { label: 'Feb', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit },
    { label: 'Mar', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit },
    { label: 'Apr', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit },
    { label: 'May', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit },
    { label: 'Jun', delivery: monthly.summer.totalEvPirCost, supply: monthly.summer.supplyCharge, isSummer: true, profit: monthlyProfit },
    { label: 'Jul', delivery: monthly.summer.totalEvPirCost, supply: monthly.summer.supplyCharge, isSummer: true, profit: monthlyProfit },
    { label: 'Aug', delivery: monthly.summer.totalEvPirCost, supply: monthly.summer.supplyCharge, isSummer: true, profit: monthlyProfit },
    { label: 'Sep', delivery: monthly.summer.totalEvPirCost, supply: monthly.summer.supplyCharge, isSummer: true, profit: monthlyProfit },
    { label: 'Oct', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit },
    { label: 'Nov', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit },
    { label: 'Dec', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit },
  ];

  // Calculate running cumulative net revenue for the line plot
  let runningNetRevenue = 0;
  const monthlyDataWithCumulative = monthlyData.map((month) => {
    runningNetRevenue += month.profit;
    return { ...month, cumulativeNetRevenue: runningNetRevenue };
  });

  // For bar scaling, use max of costs or profit (use absolute value for negative profits)
  const maxBarValue = Math.max(...monthlyData.map(d => Math.max(d.delivery + d.supply, Math.abs(d.profit))));
  // For line scaling, use the range of cumulative values
  const maxCumulativeRevenue = Math.max(...monthlyDataWithCumulative.map(d => d.cumulativeNetRevenue));
  const minCumulativeRevenue = Math.min(...monthlyDataWithCumulative.map(d => d.cumulativeNetRevenue));

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logoImage} src="/csev-logo.png" />
          <View style={styles.reportInfo}>
            <Text style={styles.reportTitle}>EV Phase-In Rate Estimate</Text>
            <Text style={styles.reportDate}>Generated: {formatDate(new Date().toISOString())}</Text>
          </View>
        </View>

        {/* Project Info - Single Line */}
        <View style={styles.projectInfoRow}>
          <View style={styles.projectInfoItem}>
            <Text style={styles.projectLabel}>Project:</Text>
            <Text style={styles.projectValue}>{project.name}</Text>
          </View>
          <View style={styles.projectInfoItem}>
            <Text style={styles.projectLabel}>Customer:</Text>
            <Text style={styles.projectValue}>{project.customerName || 'N/A'}</Text>
          </View>
          <View style={styles.projectInfoItem}>
            <Text style={styles.projectLabel}>Address:</Text>
            <Text style={styles.projectValue}>{project.projectAddress || 'N/A'}</Text>
          </View>
          <View style={styles.projectInfoItem}>
            <Text style={styles.projectLabel}>Service Class:</Text>
            <Text style={styles.projectValue}>{project.serviceClass}</Text>
          </View>
          <View style={styles.projectInfoItem}>
            <Text style={styles.projectLabel}>Metering:</Text>
            <Text style={styles.projectValue}>{project.meteringType === 'separate' ? 'Separate' : 'Combined'}</Text>
          </View>
        </View>

        {/* Usage Assumptions */}
        <View style={styles.usageAssumptions}>
          <View style={styles.assumptionItem}>
            <Text style={styles.assumptionLabel}>EVSE Units:</Text>
            <Text style={styles.assumptionValue}>{project.chargers.reduce((sum, c) => sum + c.quantity, 0)}</Text>
          </View>
          <View style={styles.assumptionItem}>
            <Text style={styles.assumptionLabel}>Total Ports:</Text>
            <Text style={styles.assumptionValue}>{results.totalPorts}</Text>
          </View>
          <View style={styles.assumptionItem}>
            <Text style={styles.assumptionLabel}>Avg Daily Ports Used:</Text>
            <Text style={styles.assumptionValue}>{project.billingInputs.avgDailyPortsUsed}</Text>
          </View>
          <View style={styles.assumptionItem}>
            <Text style={styles.assumptionLabel}>Avg Hrs/Port/Day:</Text>
            <Text style={styles.assumptionValue}>{project.billingInputs.avgHoursPerPortPerDay}</Text>
          </View>
          <View style={styles.assumptionItem}>
            <Text style={styles.assumptionLabel}>Peak Ports Simultaneous:</Text>
            <Text style={styles.assumptionValue}>{project.billingInputs.peakPortsUsed}</Text>
          </View>
        </View>

        {/* Equipment Summary */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Nameplate</Text>
            <Text style={styles.summaryValue}>{formatKw(results.nameplatekW)}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Peak Demand</Text>
            <Text style={styles.summaryValue}>{formatKw(results.peakDemandKw)}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Load Factor</Text>
            <Text style={styles.summaryValue}>{formatPercent(results.loadFactorPercent)}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Rate Tier</Text>
            <Text style={styles.summaryValue}>{getTierLabel(results.tier)}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Annual kWh</Text>
            <Text style={styles.summaryValue}>{formatKwh(results.estimatedAnnualKwh)}</Text>
          </View>
        </View>

        {/* Rates Applied */}
        <View style={styles.ratesBox}>
          <Text style={styles.ratesTitle}>Rates Applied ({getTierLabel(results.tier)})</Text>
          <View style={styles.ratesGrid}>
            <Text style={styles.rateItem}>
              <Text style={styles.rateLabel}>Demand: </Text>
              <Text style={styles.rateValue}>${ratesUsed.demandRate.toFixed(2)}/kW</Text>
            </Text>
            <Text style={styles.rateItem}>
              <Text style={styles.rateLabel}>On-Peak: </Text>
              <Text style={styles.rateValue}>${ratesUsed.onPeakRate.toFixed(5)}/kWh</Text>
            </Text>
            <Text style={styles.rateItem}>
              <Text style={styles.rateLabel}>Off-Peak: </Text>
              <Text style={styles.rateValue}>${ratesUsed.offPeakRate.toFixed(5)}/kWh</Text>
            </Text>
            <Text style={styles.rateItem}>
              <Text style={styles.rateLabel}>Super-Peak: </Text>
              <Text style={styles.rateValue}>${(ratesUsed.superPeakRate ?? 0).toFixed(5)}/kWh</Text>
            </Text>
            <Text style={styles.rateItem}>
              <Text style={styles.rateLabel}>Supply: </Text>
              <Text style={styles.rateValue}>${ratesUsed.supplyRate.toFixed(2)}/kWh</Text>
            </Text>
          </View>
        </View>

        {/* Three Column Layout: Summer, Winter & Revenue */}
        <View style={styles.threeColumn}>
          {/* Summer Column */}
          <View style={styles.columnNarrow}>
            <View style={styles.seasonCard}>
              <View style={styles.summerHeader}>
                <Text style={styles.seasonTitle}>Summer (Jun-Sep)</Text>
                <Text style={styles.seasonSubtitle}>4 months • Monthly Avg</Text>
              </View>
              <View style={styles.summerBody}>
                <Text style={styles.sectionLabel}>USAGE</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>kWh</Text>
                  <Text style={styles.rowValue}>{formatKwh(monthly.summer.totalKwh)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Demand</Text>
                  <Text style={styles.rowValue}>{formatKw(monthly.summer.demandKw)}</Text>
                </View>

                <Text style={styles.sectionLabel}>TOU</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Super-Peak</Text>
                  <Text style={styles.rowValue}>{formatKwh(monthly.summer.superPeakKwh ?? 0)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>On-Peak</Text>
                  <Text style={styles.rowValue}>{formatKwh(monthly.summer.onPeakKwh)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Off-Peak</Text>
                  <Text style={styles.rowValue}>{formatKwh(monthly.summer.offPeakKwh)}</Text>
                </View>

                <Text style={styles.sectionLabel}>DELIVERY</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Demand</Text>
                  <Text style={styles.rowValue}>{formatCurrency(monthly.summer.demandCharge)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Super-Peak</Text>
                  <Text style={styles.rowValue}>{formatCurrency(monthly.summer.superPeakCharge ?? 0)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>On-Peak</Text>
                  <Text style={styles.rowValue}>{formatCurrency(monthly.summer.onPeakCharge)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Off-Peak</Text>
                  <Text style={styles.rowValue}>{formatCurrency(monthly.summer.offPeakCharge)}</Text>
                </View>

                <Text style={styles.sectionLabel}>SUPPLY</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Energy</Text>
                  <Text style={styles.rowValue}>{formatCurrency(monthly.summer.supplyCharge)}</Text>
                </View>

                <View style={[styles.totalRow, styles.summerTotalRow]}>
                  <Text style={styles.totalLabel}>Monthly</Text>
                  <Text style={styles.totalValue}>{formatCurrency(monthly.summer.totalWithSupply)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Winter Column */}
          <View style={styles.columnNarrow}>
            <View style={styles.seasonCard}>
              <View style={styles.winterHeader}>
                <Text style={styles.seasonTitle}>Winter (Oct-May)</Text>
                <Text style={styles.seasonSubtitle}>8 months • Monthly Avg</Text>
              </View>
              <View style={styles.winterBody}>
                <Text style={styles.sectionLabel}>USAGE</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>kWh</Text>
                  <Text style={styles.rowValue}>{formatKwh(monthly.winter.totalKwh)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Demand</Text>
                  <Text style={styles.rowValue}>{formatKw(monthly.winter.demandKw)}</Text>
                </View>

                <Text style={styles.sectionLabel}>TOU</Text>
                <View style={[styles.row, { backgroundColor: '#eff6ff' }]}>
                  <Text style={styles.rowLabel}> </Text>
                  <Text style={styles.rowValue}> </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>On-Peak</Text>
                  <Text style={styles.rowValue}>{formatKwh(monthly.winter.onPeakKwh)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Off-Peak</Text>
                  <Text style={styles.rowValue}>{formatKwh(monthly.winter.offPeakKwh)}</Text>
                </View>

                <Text style={styles.sectionLabel}>DELIVERY</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Demand</Text>
                  <Text style={styles.rowValue}>{formatCurrency(monthly.winter.demandCharge)}</Text>
                </View>
                <View style={[styles.row, { backgroundColor: '#eff6ff' }]}>
                  <Text style={styles.rowLabel}> </Text>
                  <Text style={styles.rowValue}> </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>On-Peak</Text>
                  <Text style={styles.rowValue}>{formatCurrency(monthly.winter.onPeakCharge)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Off-Peak</Text>
                  <Text style={styles.rowValue}>{formatCurrency(monthly.winter.offPeakCharge)}</Text>
                </View>

                <Text style={styles.sectionLabel}>SUPPLY</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Energy</Text>
                  <Text style={styles.rowValue}>{formatCurrency(monthly.winter.supplyCharge)}</Text>
                </View>

                <View style={[styles.totalRow, styles.winterTotalRow]}>
                  <Text style={styles.totalLabel}>Monthly</Text>
                  <Text style={styles.totalValue}>{formatCurrency(monthly.winter.totalWithSupply)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Revenue Column */}
          <View style={styles.columnWide}>
            <View style={styles.revenueCard}>
              <View style={styles.revenueHeader}>
                <Text style={[styles.seasonTitle, { color: '#fff' }]}>Annual Revenue</Text>
                <Text style={[styles.seasonSubtitle, { color: '#a7f3d0' }]}>
                  ${results.revenue?.costToDriverPerKwh.toFixed(2)}/kWh • {results.revenue?.percentTimeChargingDrivers}% paid
                </Text>
              </View>
              <View style={styles.revenueBody}>
                <Text style={styles.sectionLabel}>REVENUE</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Billable kWh</Text>
                  <Text style={styles.rowValue}>{formatKwh(results.revenue?.billableKwh ?? 0)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Gross Revenue</Text>
                  <Text style={[styles.rowValue, styles.revenuePositive]}>{formatCurrency(results.revenue?.grossRevenue ?? 0)}</Text>
                </View>

                <Text style={styles.sectionLabel}>DEDUCTIONS</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Network Fee ({results.revenue?.networkFeePercent}%)</Text>
                  <Text style={[styles.rowValue, styles.revenueNegative]}>-{formatCurrency(results.revenue?.networkFeeAmount ?? 0)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Net After Fee</Text>
                  <Text style={styles.rowValue}>{formatCurrency(results.revenue?.revenueAfterNetworkFee ?? 0)}</Text>
                </View>
                {(results.revenue?.customerRevSharePercent ?? 100) < 100 && (
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Cust Share ({results.revenue?.customerRevSharePercent}%)</Text>
                    <Text style={styles.rowValue}>{formatCurrency(results.revenue?.customerNetChargingRevenue ?? 0)}</Text>
                  </View>
                )}

                <Text style={styles.sectionLabel}>COSTS</Text>
                {/* Energy Costs - aligned with Demand row in Winter */}
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Energy Costs</Text>
                  <Text style={[styles.rowValue, styles.revenueNegative]}>-{formatCurrency(results.revenue?.totalEnergyCost ?? 0)}</Text>
                </View>
                {/* Spacer rows to align with winter's On-Peak, Off-Peak, and Supply section */}
                <View style={[styles.row, { backgroundColor: '#f0fdf4' }]}>
                  <Text style={styles.rowLabel}> </Text>
                  <Text style={styles.rowValue}> </Text>
                </View>
                <View style={[styles.row, { backgroundColor: '#f0fdf4' }]}>
                  <Text style={styles.rowLabel}> </Text>
                  <Text style={styles.rowValue}> </Text>
                </View>
                <View style={[styles.row, { backgroundColor: '#f0fdf4' }]}>
                  <Text style={styles.rowLabel}> </Text>
                  <Text style={styles.rowValue}> </Text>
                </View>
                <View style={[styles.row, { backgroundColor: '#f0fdf4' }]}>
                  <Text style={styles.rowLabel}> </Text>
                  <Text style={styles.rowValue}> </Text>
                </View>

                {/* Annual Cust Revenue - Medium Green */}
                <View style={[styles.totalRow, styles.revenueMediumRow]}>
                  <Text style={[styles.totalLabel, { color: '#166534' }]}>Annual Cust Revenue</Text>
                  <Text style={[styles.totalValue, { color: '#166534' }]}>{formatCurrency(results.revenue?.customerFinalRevenue ?? 0)}</Text>
                </View>

                {/* Monthly Avg Revenue - Dark Green (prominent) - aligned with Monthly row in Winter */}
                <View style={styles.revenueHighlight}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2, paddingHorizontal: 4 }}>
                    <Text style={[styles.totalLabel, { color: '#fff' }]}>Monthly Avg Revenue</Text>
                    <Text style={[styles.totalValue, { color: '#fff' }]}>
                      {formatCurrency(results.revenue?.monthlyCustomerFinalRevenue ?? 0)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Monthly Cost & Profit Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Monthly Cost vs Profit & Running Net Revenue</Text>
          <View style={styles.chartWrapper}>
            <View style={styles.chartArea}>
              {monthlyDataWithCumulative.map((month, idx) => {
                const costTotal = month.delivery + month.supply;
                const costHeight = (costTotal / maxBarValue) * 100;
                const deliveryHeight = costTotal > 0 ? (month.delivery / costTotal) * 100 : 0;
                const supplyHeight = costTotal > 0 ? (month.supply / costTotal) * 100 : 0;
                const profitHeight = (Math.abs(month.profit) / maxBarValue) * 100;
                const isProfitPositive = month.profit >= 0;

                // Calculate running net revenue line position (0-100% where position reflects cumulative value)
                const revenueRange = maxCumulativeRevenue - minCumulativeRevenue;
                const linePosition = revenueRange > 0
                  ? ((month.cumulativeNetRevenue - minCumulativeRevenue) / revenueRange) * 70 + 10 // 10-80% range
                  : 50;

                // Format as short currency (no cents for larger values)
                const formatShort = (val: number) => {
                  if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(1)}k`;
                  return `$${Math.round(val)}`;
                };
                return (
                  <View
                    key={idx}
                    style={[
                      styles.chartColumn,
                      month.isSummer ? styles.chartColumnSummer : styles.chartColumnWinter
                    ]}
                  >
                    <View style={styles.chartBarWrapper}>
                      {/* Running net revenue point */}
                      <View style={{
                        position: 'absolute',
                        bottom: `${linePosition}%`,
                        left: '50%',
                        marginLeft: -3,
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#f59e0b',
                        zIndex: 10,
                      }} />

                      <Text style={[styles.chartValueLabel, { fontSize: 5 }]}>{formatShort(month.cumulativeNetRevenue)}</Text>

                      {/* Cost and Profit bars side by side */}
                      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: '85%', gap: 1 }}>
                        {/* Cost bar (stacked) */}
                        <View style={[styles.chartBar, { height: `${costHeight}%`, width: 10 }]}>
                          <View style={[styles.chartBarSupply, { height: `${supplyHeight}%` }]} />
                          <View style={[styles.chartBarDelivery, { height: `${deliveryHeight}%` }]} />
                        </View>
                        {/* Monthly Profit bar */}
                        <View style={[styles.chartBar, { height: `${profitHeight}%`, width: 10 }]}>
                          <View style={[
                            isProfitPositive ? styles.chartBarRevenue : { backgroundColor: '#ef4444', width: '100%' },
                            { height: '100%' }
                          ]} />
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={styles.chartLabels}>
            {monthlyData.map((month, idx) => (
              <Text key={idx} style={styles.chartLabel}>{month.label}</Text>
            ))}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#d1d5db' }]} />
              <Text style={styles.legendText}>Delivery</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#4b5563' }]} />
              <Text style={styles.legendText}>Supply</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#4CBC88' }]} />
              <Text style={styles.legendText}>Monthly Profit</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#f59e0b', borderRadius: 4 }]} />
              <Text style={styles.legendText}>Running Net Revenue</Text>
            </View>
          </View>
        </View>

        {/* Annual Totals */}
        <View style={styles.annualBox}>
          <Text style={styles.annualTitle}>Estimated Annual Cost Summary</Text>
          <View style={styles.annualGrid}>
            <View style={styles.annualItem}>
              <Text style={styles.annualLabel}>Delivery (EV PIR)</Text>
              <Text style={styles.annualValue}>{formatCurrency(yearly.totalEvPirCost)}</Text>
            </View>
            <View style={styles.annualItem}>
              <Text style={styles.annualLabel}>Supply</Text>
              <Text style={styles.annualValue}>{formatCurrency(yearly.totalSupplyCharge)}</Text>
            </View>
            <View style={styles.annualItem}>
              <Text style={styles.annualLabel}>Total Annual</Text>
              <Text style={styles.annualValue}>{formatCurrency(yearly.totalWithSupply)}</Text>
            </View>
            <View style={styles.annualItem}>
              <Text style={styles.annualLabel}>Avg Monthly</Text>
              <Text style={styles.annualValue}>{formatCurrency(yearly.totalWithSupply / 12)}</Text>
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          DISCLAIMER: This report provides estimates only based on the inputs provided and current published rate structures.
          Actual costs may vary based on utility rate changes, actual usage patterns, and other factors.
        </Text>
      </Page>
    </Document>
  );
};

export default PDFReport;
