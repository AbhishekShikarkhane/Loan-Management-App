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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 5
  }
});

// Create Document Component
const DashboardPDF = ({ stats }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Dashboard Report</Text>
        
        <Text style={styles.subtitle}>Financial Overview</Text>
        <View style={styles.row}>
          <Text style={styles.text}>Total Credit:</Text>
          <Text style={styles.text}>{stats?.totalCredit?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || '₹0'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Total Debit:</Text>
          <Text style={styles.text}>{stats?.totalDebit?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || '₹0'}</Text>
        </View>
        
        <Text style={styles.subtitle}>Loan Statistics</Text>
        <View style={styles.row}>
          <Text style={styles.text}>Pending Loans:</Text>
          <Text style={styles.text}>{stats?.pendingLoans || 0}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Overdue EMIs:</Text>
          <Text style={styles.text}>{stats?.overdueEMIs || 0}</Text>
        </View>
        
        <Text style={styles.subtitle}>User Statistics</Text>
        <View style={styles.row}>
          <Text style={styles.text}>Total Users:</Text>
          <Text style={styles.text}>{stats?.userCount || 0}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>New Users:</Text>
          <Text style={styles.text}>{stats?.newUsers || 0}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Inactive Users:</Text>
          <Text style={styles.text}>{stats?.inactiveUsers || 0}</Text>
        </View>
        
        <Text style={styles.subtitle}>Top Performer</Text>
        <View style={styles.row}>
          <Text style={styles.text}>Name:</Text>
          <Text style={styles.text}>{stats?.topUser?.name || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Balance:</Text>
          <Text style={styles.text}>{stats?.topUser?.balance?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || '₹0'}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default DashboardPDF;