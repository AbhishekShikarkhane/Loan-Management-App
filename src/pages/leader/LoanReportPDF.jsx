import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  chart: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 5
  }
});

// Create Document Component
const LoanReportPDF = ({ loanStats }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Loan Management Report</Text>
        <Text style={styles.subtitle}>{new Date().toLocaleDateString()}</Text>

        <Text style={styles.subtitle}>Summary</Text>
        <View style={styles.row}>
          <Text style={styles.text}>Total Loans:</Text>
          <Text style={styles.text}>{loanStats?.totalLoans || 0}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Active Loans:</Text>
          <Text style={styles.text}>{loanStats?.activeLoans || 0}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Total Amount:</Text>
          <Text style={styles.text}>${loanStats?.totalAmount?.toFixed(2) || '0.00'}</Text>
        </View>

        <Text style={styles.subtitle}>Status Distribution</Text>
        {Object.entries(loanStats?.statusDistribution || {}).map(([status, count], index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.text}>{status}:</Text>
            <Text style={styles.text}>{count}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default LoanReportPDF;