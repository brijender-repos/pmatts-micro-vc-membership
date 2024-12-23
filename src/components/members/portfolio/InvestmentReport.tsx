import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { formatCurrency } from "@/lib/utils";

interface Investment {
  id: string;
  project_name: string;
  investment_type: string;
  amount: number;
  units?: number;
  equity_percentage?: number;
  investment_date: string;
  projects: {
    name: string;
    status: string;
  };
}

interface InvestmentReportProps {
  investments: Investment[];
  totalInvested: number;
  totalReturns: number;
  activeProjects: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #666',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summarySection: {
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  summaryGrid: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    margin: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 16,
  },
  historyTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 30,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTop: '1 solid #666',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 10,
    color: '#666',
  },
});

export const InvestmentReport = ({ investments, totalInvested, totalReturns, activeProjects }: InvestmentReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PMatts Investment Report</Text>
        <Text style={styles.date}>Report Generated: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* Investment Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Investment Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Invested</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalInvested)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Returns</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalReturns)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Active Projects</Text>
            <Text style={styles.summaryValue}>{activeProjects}</Text>
          </View>
        </View>
      </View>

      {/* Investment History */}
      <View>
        <Text style={styles.historyTitle}>Investment History</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Project</Text>
            <Text style={styles.tableCell}>Type</Text>
            <Text style={styles.tableCell}>Amount</Text>
            <Text style={styles.tableCell}>Units</Text>
            <Text style={styles.tableCell}>Equity %</Text>
          </View>
          {investments.map((investment) => (
            <View key={investment.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {new Date(investment.investment_date).toLocaleDateString()}
              </Text>
              <Text style={styles.tableCell}>{investment.project_name}</Text>
              <Text style={styles.tableCell}>
                {investment.investment_type.replace('_', ' ')}
              </Text>
              <Text style={styles.tableCell}>{formatCurrency(investment.amount)}</Text>
              <Text style={styles.tableCell}>{investment.units || '-'}</Text>
              <Text style={styles.tableCell}>
                {investment.equity_percentage ? `${investment.equity_percentage}%` : '-'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          PMatts Innovative Catalysts Federation - Confidential Investment Report
        </Text>
      </View>
    </Page>
  </Document>
);