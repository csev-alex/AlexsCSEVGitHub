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
    borderColor: '#4CBC88',
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
  // Compact version for Project Info row - shorter height
  projectInfoBox: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
  },
  projectInfoValue: {
    fontSize: 8,
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
    height: 75,
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
    backgroundColor: '#a36eff',
    padding: 6,
  },
  revenueBody: {
    backgroundColor: '#f3e8ff',
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
  // Revenue bar styles for chart (lighter green for charging profit)
  chartBarRevenue: {
    backgroundColor: '#86efac',
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

  // Monthly customer profit for chart
  const monthlyProfit = results.revenue?.monthlyCustomerFinalRevenue ?? 0;

  // Calculate monthly booking revenue for Hotel/Hospitality
  const isHotel = project.revenueSettings?.industryType === 'Hotel/Hospitality';
  const monthlyBookingProfit = isHotel
    ? (project.revenueSettings?.additionalMonthlyBookings ?? 20) *
      (project.revenueSettings?.bookingProfit ?? 100) *
      ((project.revenueSettings?.bookingMargin ?? 75) / 100)
    : 0;

  // Calculate max cost for chart scaling - January to December order
  const monthlyData = [
    { label: 'Jan', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit, bookingProfit: monthlyBookingProfit },
    { label: 'Feb', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit, bookingProfit: monthlyBookingProfit },
    { label: 'Mar', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit, bookingProfit: monthlyBookingProfit },
    { label: 'Apr', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit, bookingProfit: monthlyBookingProfit },
    { label: 'May', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit, bookingProfit: monthlyBookingProfit },
    { label: 'Jun', delivery: monthly.summer.totalEvPirCost, supply: monthly.summer.supplyCharge, isSummer: true, profit: monthlyProfit, bookingProfit: monthlyBookingProfit },
    { label: 'Jul', delivery: monthly.summer.totalEvPirCost, supply: monthly.summer.supplyCharge, isSummer: true, profit: monthlyProfit, bookingProfit: monthlyBookingProfit },
    { label: 'Aug', delivery: monthly.summer.totalEvPirCost, supply: monthly.summer.supplyCharge, isSummer: true, profit: monthlyProfit, bookingProfit: monthlyBookingProfit },
    { label: 'Sep', delivery: monthly.summer.totalEvPirCost, supply: monthly.summer.supplyCharge, isSummer: true, profit: monthlyProfit, bookingProfit: monthlyBookingProfit },
    { label: 'Oct', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit, bookingProfit: monthlyBookingProfit },
    { label: 'Nov', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit, bookingProfit: monthlyBookingProfit },
    { label: 'Dec', delivery: monthly.winter.totalEvPirCost, supply: monthly.winter.supplyCharge, isSummer: false, profit: monthlyProfit, bookingProfit: monthlyBookingProfit },
  ];


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

        {/* Project Info - Compact row */}
        <View style={styles.summaryGrid}>
          <View style={styles.projectInfoBox}>
            <Text style={styles.summaryLabel}>Project</Text>
            <Text style={styles.projectInfoValue}>{project.name || 'N/A'}</Text>
          </View>
          <View style={styles.projectInfoBox}>
            <Text style={styles.summaryLabel}>Customer</Text>
            <Text style={styles.projectInfoValue}>{project.customerName || 'N/A'}</Text>
          </View>
          <View style={styles.projectInfoBox}>
            <Text style={styles.summaryLabel}>Address</Text>
            <Text style={styles.projectInfoValue}>{project.projectAddress || 'N/A'}</Text>
          </View>
          <View style={styles.projectInfoBox}>
            <Text style={styles.summaryLabel}>Service Class</Text>
            <Text style={styles.projectInfoValue}>{project.serviceClass}</Text>
          </View>
          <View style={styles.projectInfoBox}>
            <Text style={styles.summaryLabel}>Metering</Text>
            <Text style={styles.projectInfoValue}>{project.meteringType === 'separate' ? 'Separate' : 'Combined'}</Text>
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
                <Text style={styles.seasonTitle}>Charging Revenue</Text>
                <Text style={[styles.seasonSubtitle, { color: '#fff' }]}>
                  ${results.revenue?.costToDriverPerKwh.toFixed(2)}/kWh Charged {results.revenue?.percentTimeChargingDrivers}% of Time
                </Text>
              </View>
              <View style={styles.revenueBody}>
                <Text style={styles.sectionLabel}>REVENUE</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Annual Billable kWh</Text>
                  <Text style={styles.rowValue}>{formatKwh(results.estimatedAnnualKwh)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Annual Gross Rev</Text>
                  <Text style={[styles.rowValue, styles.revenuePositive]}>{formatCurrency(results.revenue?.grossRevenue ?? 0)}</Text>
                </View>

                <Text style={styles.sectionLabel}>DEDUCTIONS</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Processing Fees</Text>
                  <Text style={[styles.rowValue, styles.revenueNegative]}>-{formatCurrency(results.revenue?.networkFeeAmount ?? 0)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Site Rev Share ({results.revenue?.customerRevSharePercent}%)</Text>
                  <Text style={styles.rowValue}>{formatCurrency(results.revenue?.customerNetChargingRevenue ?? 0)}</Text>
                </View>
                {/* Blank row to align with Winter TOU section */}
                <View style={[styles.row, { backgroundColor: '#f3e8ff' }]}>
                  <Text style={styles.rowLabel}> </Text>
                  <Text style={styles.rowValue}> </Text>
                </View>

                <Text style={styles.sectionLabel}>COSTS</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Annual Delivery Cost</Text>
                  <Text style={[styles.rowValue, styles.revenueNegative]}>-{formatCurrency(results.yearly.totalEvPirCost)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Annual Supply Cost</Text>
                  <Text style={[styles.rowValue, styles.revenueNegative]}>-{formatCurrency(results.yearly.totalSupplyCharge)}</Text>
                </View>
                {/* Spacer rows to align with Winter DELIVERY section */}
                <View style={[styles.row, { backgroundColor: '#f3e8ff' }]}>
                  <Text style={styles.rowLabel}> </Text>
                  <Text style={styles.rowValue}> </Text>
                </View>
                <View style={[styles.row, { backgroundColor: '#f3e8ff' }]}>
                  <Text style={styles.rowLabel}> </Text>
                  <Text style={styles.rowValue}> </Text>
                </View>

                <Text style={styles.sectionLabel}>PROFITABILITY</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Annual Charging Net</Text>
                  <Text style={[styles.rowValue, (results.revenue?.customerFinalRevenue ?? 0) >= 0 ? styles.revenuePositive : styles.revenueNegative]}>{formatCurrency(results.revenue?.customerFinalRevenue ?? 0)}</Text>
                </View>

                {/* Monthly Charging Net - Green when positive, Red when negative */}
                <View style={[styles.totalRow, (results.revenue?.monthlyCustomerFinalRevenue ?? 0) >= 0 ? styles.revenueTotalRow : { backgroundColor: '#dc2626' }]}>
                  <Text style={[styles.totalLabel, { color: '#fff' }]}>Monthly Charging Net</Text>
                  <Text style={[styles.totalValue, { color: '#fff' }]}>{formatCurrency(results.revenue?.monthlyCustomerFinalRevenue ?? 0)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Hotel/Hospitality Booking Revenue Section - only show when industry is Hotel/Hospitality */}
        {project.revenueSettings?.industryType === 'Hotel/Hospitality' && (() => {
          const bookings = project.revenueSettings?.additionalMonthlyBookings ?? 20;
          const profit = project.revenueSettings?.bookingProfit ?? 100;
          const margin = project.revenueSettings?.bookingMargin ?? 75;
          const effectiveProfitPerBooking = profit * (margin / 100);
          const monthlyBookingRevenue = bookings * effectiveProfitPerBooking;
          const annualBookingRevenue = monthlyBookingRevenue * 12;
          return (
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#f0fdf4',
              borderWidth: 1,
              borderColor: '#4CBC88',
              borderRadius: 3,
              padding: 5,
              marginBottom: 4,
              gap: 20,
            }}>
              <View style={styles.assumptionItem}>
                <Text style={[styles.assumptionLabel, { color: '#000', fontWeight: 'bold' }]}>INCREMENTAL HOTEL BOOKINGS</Text>
              </View>
              <View style={styles.assumptionItem}>
                <Text style={styles.assumptionLabel}>Add'l Bookings/Mo:</Text>
                <Text style={styles.assumptionValue}>{bookings}</Text>
              </View>
              <View style={styles.assumptionItem}>
                <Text style={styles.assumptionLabel}>Profit/Booking:</Text>
                <Text style={styles.assumptionValue}>{formatCurrency(effectiveProfitPerBooking)}</Text>
              </View>
              <View style={styles.assumptionItem}>
                <Text style={styles.assumptionLabel}>Add'l Monthly Profit:</Text>
                <Text style={[styles.assumptionValue, { color: '#166534' }]}>{formatCurrency(monthlyBookingRevenue)}</Text>
              </View>
              <View style={styles.assumptionItem}>
                <Text style={styles.assumptionLabel}>Add'l Annual Profit:</Text>
                <Text style={[styles.assumptionValue, { color: '#166534' }]}>{formatCurrency(annualBookingRevenue)}</Text>
              </View>
            </View>
          );
        })()}

        {/* Monthly Waterfall Chart */}
        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { marginBottom: 6 }]}>ESTIMATED SITE PROFITABILITY</Text>
          {(() => {
            // Calculate waterfall values for each month
            const waterfallData = monthlyData.map(month => {
              // Waterfall: start at 0, subtract delivery, subtract supply, add/subtract charging profit, add booking profit
              const afterDelivery = -month.delivery;
              const afterSupply = afterDelivery - month.supply;
              const afterChargingProfit = afterSupply + month.profit;
              const finalValue = afterChargingProfit + month.bookingProfit;

              return {
                ...month,
                afterDelivery,
                afterSupply,
                afterChargingProfit,
                finalValue,
              };
            });

            // Find the range for scaling - ensure 0 is always included and add padding
            const allValues = waterfallData.flatMap(d => [0, d.afterDelivery, d.afterSupply, d.afterChargingProfit, d.finalValue]);
            const dataMin = Math.min(...allValues);
            const dataMax = Math.max(...allValues);

            // Add 12% padding on each side for labels
            const padding = (dataMax - dataMin) * 0.12;
            const minValue = dataMin - padding;
            const maxValue = dataMax + padding;
            const range = maxValue - minValue;

            // Format as short currency - always in thousands with 1 decimal
            const formatShort = (val: number) => {
              const absVal = Math.abs(val);
              const kVal = (absVal / 1000).toFixed(1);
              return val < 0 ? `-$${kVal}k` : `$${kVal}k`;
            };

            // Convert value to Y position percentage (0% = top, 100% = bottom)
            const toPercent = (val: number) => range > 0 ? ((maxValue - val) / range) * 100 : 50;
            const zeroLineY = toPercent(0);

            return (
              <>
                <View style={[styles.chartWrapper, { position: 'relative' }]}>
                  {/* Y-axis label for $0 */}
                  <View style={{ width: 36, position: 'relative', height: 75 }}>
                    <Text style={{
                      position: 'absolute',
                      top: `${zeroLineY - 5}%`,
                      right: 2,
                      fontSize: 6,
                      color: '#000',
                      fontWeight: 'bold',
                    }}>$0</Text>
                  </View>
                  <View style={[styles.chartArea, { position: 'relative', flex: 1 }]}>
                    {/* Monthly waterfall bars */}
                    {waterfallData.map((month, idx) => {
                      const zeroY = toPercent(0);
                      const deliveryY = toPercent(month.afterDelivery);
                      const supplyY = toPercent(month.afterSupply);
                      const chargingY = toPercent(month.afterChargingProfit);
                      const finalY = toPercent(month.finalValue);

                      // Bar positioning - center the group of bars
                      const hasBooking = month.bookingProfit > 0;
                      const barWidth = 6;
                      const barGap = 2;
                      const numBars = hasBooking ? 4 : 3;
                      const totalWidth = numBars * barWidth + (numBars - 1) * barGap;
                      const startX = (30 - totalWidth) / 2; // center in ~30px column

                      return (
                        <View
                          key={idx}
                          style={[
                            styles.chartColumn,
                            month.isSummer ? styles.chartColumnSummer : styles.chartColumnWinter,
                            { position: 'relative' }
                          ]}
                        >
                          {/* X-axis line segment at $0 - light gray, rendered first so it's behind bars */}
                          <View style={{
                            position: 'absolute',
                            top: `${zeroY}%`,
                            left: 0,
                            right: 0,
                            height: 1,
                            backgroundColor: '#d1d5db',
                          }} />
                          {/* Delivery bar - no label */}
                          <View style={{
                            position: 'absolute',
                            top: `${Math.min(zeroY, deliveryY)}%`,
                            height: `${Math.max(Math.abs(deliveryY - zeroY), 2)}%`,
                            left: startX,
                            width: barWidth,
                            backgroundColor: '#d1d5db',
                          }} />

                          {/* Supply bar - no label */}
                          <View style={{
                            position: 'absolute',
                            top: `${Math.min(deliveryY, supplyY)}%`,
                            height: `${Math.max(Math.abs(supplyY - deliveryY), 2)}%`,
                            left: startX + barWidth + barGap,
                            width: barWidth,
                            backgroundColor: '#4b5563',
                          }} />

                          {/* Charging profit bar with label - color matches bar */}
                          <View style={{
                            position: 'absolute',
                            top: `${Math.min(supplyY, chargingY)}%`,
                            height: `${Math.max(Math.abs(chargingY - supplyY), 2)}%`,
                            left: startX + 2 * (barWidth + barGap),
                            width: barWidth,
                            backgroundColor: month.profit >= 0 ? '#4CBC88' : '#ef4444',
                          }} />
                          <Text style={{
                            position: 'absolute',
                            top: month.profit >= 0 ? `${Math.max(chargingY - 8, 1)}%` : `${Math.min(chargingY + 1, 88)}%`,
                            left: startX + 2 * (barWidth + barGap) - 2,
                            fontSize: 5,
                            color: month.profit >= 0 ? '#276347' : '#ef4444',
                          }}>{formatShort(month.profit)}</Text>

                          {/* Booking profit bar with label - color matches bar */}
                          {hasBooking && (
                            <>
                              <View style={{
                                position: 'absolute',
                                top: `${Math.min(chargingY, finalY)}%`,
                                height: `${Math.max(Math.abs(finalY - chargingY), 2)}%`,
                                left: startX + 3 * (barWidth + barGap),
                                width: barWidth,
                                backgroundColor: '#4CBC88',
                              }} />
                              <Text style={{
                                position: 'absolute',
                                top: `${Math.max(finalY - 8, 1)}%`,
                                left: startX + 3 * (barWidth + barGap) - 2,
                                fontSize: 5,
                                color: '#4CBC88',
                              }}>{formatShort(month.bookingProfit)}</Text>
                            </>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Net values row - positioned above month labels */}
                <View style={{ flexDirection: 'row', marginTop: 2, alignItems: 'center' }}>
                  <Text style={{ width: 36, fontSize: 5, color: '#000', fontWeight: 'bold', textAlign: 'right', paddingRight: 2 }}>MONTHLY PROFIT</Text>
                  {waterfallData.map((month, idx) => (
                    <View key={idx} style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{
                        fontSize: 6,
                        fontWeight: 'bold',
                        color: month.finalValue >= 0 ? '#166534' : '#dc2626',
                      }}>
                        {formatShort(month.finalValue)}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Month labels - no border */}
                <View style={{ flexDirection: 'row', marginLeft: 36 }}>
                  {monthlyData.map((month, idx) => (
                    <Text key={idx} style={[styles.chartLabel, { flex: 1 }]}>{month.label}</Text>
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
                    <View style={[styles.legendBox, { backgroundColor: monthlyProfit >= 0 ? '#4CBC88' : '#ef4444' }]} />
                    <Text style={styles.legendText}>Charging Net</Text>
                  </View>
                  {isHotel && (
                    <View style={styles.legendItem}>
                      <View style={[styles.legendBox, { backgroundColor: '#4CBC88' }]} />
                      <Text style={styles.legendText}>Booking Profit</Text>
                    </View>
                  )}
                </View>
              </>
            );
          })()}
        </View>

        {/* Site Summary */}
        <View style={[styles.annualBox, { padding: 6, backgroundColor: '#B9BAB8' }]}>
          <Text style={[styles.annualTitle, { marginBottom: 4, color: '#000' }]}>Estimated Site Summary</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {/* MONTHLY Box */}
            <View style={{ flex: 1, backgroundColor: '#ECECEC', borderRadius: 4, padding: 6 }}>
              <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#000', marginBottom: 3 }}>MONTHLY TOTALS</Text>
              {/* Top row */}
              <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                <View style={{ width: '33%' }}>
                  <Text style={{ fontSize: 5, color: '#000' }}>Delivery</Text>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#212529' }}>{formatCurrency(yearly.totalEvPirCost / 12)}</Text>
                </View>
                <View style={{ width: '33%' }}>
                  <Text style={{ fontSize: 5, color: '#000' }}>Supply</Text>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#212529' }}>{formatCurrency(yearly.totalSupplyCharge / 12)}</Text>
                </View>
                <View style={{ width: '34%' }}>
                  <Text style={{ fontSize: 5, color: '#000' }}>Energy Cost</Text>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#212529' }}>{formatCurrency(yearly.totalWithSupply / 12)}</Text>
                </View>
              </View>
              {/* Bottom row */}
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '33%' }}>
                  <Text style={{ fontSize: 5, color: '#000' }}>Charging Net</Text>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: (results.revenue?.monthlyCustomerFinalRevenue ?? 0) >= 0 ? '#166534' : '#dc2626' }}>{formatCurrency(results.revenue?.monthlyCustomerFinalRevenue ?? 0)}</Text>
                </View>
                {isHotel && (
                  <View style={{ width: '33%' }}>
                    <Text style={{ fontSize: 5, color: '#000' }}>Booking Profit</Text>
                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#166534' }}>{formatCurrency(monthlyBookingProfit)}</Text>
                  </View>
                )}
                <View style={{ width: isHotel ? '34%' : '33%' }}>
                  <Text style={{ fontSize: 5, color: '#000' }}>Site Total Profit</Text>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: ((results.revenue?.monthlyCustomerFinalRevenue ?? 0) + (isHotel ? monthlyBookingProfit : 0)) >= 0 ? '#166534' : '#dc2626' }}>{formatCurrency((results.revenue?.monthlyCustomerFinalRevenue ?? 0) + (isHotel ? monthlyBookingProfit : 0))}</Text>
                </View>
              </View>
            </View>

            {/* ANNUAL Box */}
            <View style={{ flex: 1, backgroundColor: '#ECECEC', borderRadius: 4, padding: 6 }}>
              <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#000', marginBottom: 3 }}>ANNUAL TOTALS</Text>
              {/* Top row */}
              <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                <View style={{ width: '33%' }}>
                  <Text style={{ fontSize: 5, color: '#000' }}>Delivery</Text>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#212529' }}>{formatCurrency(yearly.totalEvPirCost)}</Text>
                </View>
                <View style={{ width: '33%' }}>
                  <Text style={{ fontSize: 5, color: '#000' }}>Supply</Text>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#212529' }}>{formatCurrency(yearly.totalSupplyCharge)}</Text>
                </View>
                <View style={{ width: '34%' }}>
                  <Text style={{ fontSize: 5, color: '#000' }}>Energy Cost</Text>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#212529' }}>{formatCurrency(yearly.totalWithSupply)}</Text>
                </View>
              </View>
              {/* Bottom row */}
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '33%' }}>
                  <Text style={{ fontSize: 5, color: '#000' }}>Charging Net</Text>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: (results.revenue?.customerFinalRevenue ?? 0) >= 0 ? '#166534' : '#dc2626' }}>{formatCurrency(results.revenue?.customerFinalRevenue ?? 0)}</Text>
                </View>
                {isHotel && (
                  <View style={{ width: '33%' }}>
                    <Text style={{ fontSize: 5, color: '#000' }}>Booking Profit</Text>
                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#166534' }}>{formatCurrency(monthlyBookingProfit * 12)}</Text>
                  </View>
                )}
                <View style={{ width: isHotel ? '34%' : '33%' }}>
                  <Text style={{ fontSize: 5, color: '#000' }}>Site Total Profit</Text>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: ((results.revenue?.customerFinalRevenue ?? 0) + (isHotel ? monthlyBookingProfit * 12 : 0)) >= 0 ? '#166534' : '#dc2626' }}>{formatCurrency((results.revenue?.customerFinalRevenue ?? 0) + (isHotel ? monthlyBookingProfit * 12 : 0))}</Text>
                </View>
              </View>
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
