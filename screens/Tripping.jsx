import { Text, View, StyleSheet } from "react-native";

export default function Tripping() {
    return (
        <View style={styles.container}>
            <Text style={styles.header} >Tripping</Text>
        
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>All</Text>
                <View style={styles.divider} />
                
                <Text style={styles.monthHeader}>July 2025</Text>
                
                {/* Table Header */}
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.headerCell]}>Sun</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Mon</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Tue</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Wed</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Thu</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Fri</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Sat</Text>
                </View>
                
                {/* Table Rows */}
                {[
                    [29, 30, 1, 2, 3, 4, 5],
                    [6, 7, 8, 9, 10, 11, 12],
                    [13, 14, 15, 16, 17, 18, 19],
                    [20, 21, 22, 23, 24, 25, 26],
                    [27, 28, 29, 30, 31, 1, 2]
                ].map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.tableRow}>
                        {row.map((cell, cellIndex) => (
                            <Text key={cellIndex} style={styles.tableCell}>{cell}</Text>
                        ))}
                    </View>
                ))}
                
                <View style={styles.divider} />
                
                <Text style={styles.footerTitle}>Tue Daily House</Text>
                <Text style={styles.footerText}>Petroleum Resources</Text>
                <Text style={styles.footerText}>P.O. Box 1020</Text>
                <Text style={styles.footerText}>Appetite Arts Telecom</Text>
                
                <View style={styles.divider} />
                
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 12,
    },
    monthHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
    },
    headerCell: {
        fontWeight: 'bold',
    },
    footerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    footerText: {
        fontSize: 14,
        marginBottom: 4,
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 12,
    },
});