// components/pdf/ApplicationPDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  field: {
    marginBottom: 4,
  }
});

const ApplicationPDF = ({ app }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Life Insurance Application Details</Text>

      <View style={styles.section}>
        <Text style={styles.field}>👤 Name: {app.user?.name}</Text>
        <Text style={styles.field}>📧 Email: {app.user?.email}</Text>
        <Text style={styles.field}>🆔 NID: {app.user?.nid}</Text>
        <Text style={styles.field}>🏠 Address: {app.user?.address}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>👥 Nominee Info</Text>
        <Text style={styles.field}>Name: {app.nominee?.name}</Text>
        <Text style={styles.field}>Relationship: {app.nominee?.relationship}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>🏥 Health</Text>
        <Text style={styles.field}>Health Issues: {app.health?.join(', ') || 'None'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>📄 Policy Details</Text>
        <Text style={styles.field}>Policy: {app.policy?.title || 'N/A'}</Text>
        <Text style={styles.field}>Premium: {app.premium?.amount} BDT / {app.premium?.frequency}</Text>
        <Text style={styles.field}>Status: {app.status}</Text>
        <Text style={styles.field}>Payment: {app.premium?.status}</Text>
      </View>
    </Page>
  </Document>
);

export default ApplicationPDF;
