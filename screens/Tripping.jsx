import React from "react";
import { Text, TouchableOpacity, View, StyleSheet, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const sellersData = [
    {
        id: '1',
        sellerName: 'John Doe',
        propertyDetails: 'Modern Villa in LA',
        meetingDate: '2023-10-15',
        meetingTime: '10:00 AM',
        propertyDescription: 'A beautiful modern villa located in the heart of Los Angeles with 4 bedrooms and 3 bathrooms.',
        image: 'https://images.unsplash.com/photo-1560448070-4561d88d83e4?auto=format&fit=crop&w=400&q=80',
        location: 'Los Angeles, CA',
    },
    {
        id: '2',
        sellerName: 'Jane Smith',
        propertyDetails: 'City Apartment in NY',
        meetingDate: '2023-10-16',
        meetingTime: '2:00 PM',
        propertyDescription: 'A cozy city apartment with stunning views of the skyline, featuring 2 bedrooms and 2 baths.',
        image: 'https://images.unsplash.com/photo-1572120360610-d971b9b8f27f?auto=format&fit=crop&w=400&q=80',
        location: 'New York, NY',
    },
    {
        id: '3',
        sellerName: 'Alice Johnson',
        propertyDetails: 'Beach House in Miami',
        meetingDate: '2023-10-17',
        meetingTime: '1:00 PM',
        propertyDescription: 'A charming beach house just steps from the ocean, with 3 bedrooms and a large patio.',
        image: 'https://images.unsplash.com/photo-1501183638714-4e0ab6f969c9?auto=format&fit=crop&w=400&q=80',
        location: 'Miami, FL',
    },
];

export default function Tripping() {
    const navigation = useNavigation();

    const handleAccept = (seller) => {
        alert(`Meeting accepted with ${seller.sellerName} for ${seller.propertyDetails}`);
    };

    const handleDecline = (seller) => {
        alert(`Meeting declined with ${seller.sellerName}`);
    };

    const handleViewProperty = (property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    const renderSellerItem = ({ item }) => (
        <View style={styles.sellerCard}>
            <Image source={{ uri: item.image }} style={styles.propertyImage} />
            <Text style={styles.sellerName}>{item.sellerName}</Text>
            <Text style={styles.propertyDetails}>{item.propertyDetails}</Text>
            <Text style={styles.meetingInfo}>Meeting Date: {item.meetingDate}</Text>
            <Text style={styles.meetingInfo}>Meeting Time: {item.meetingTime}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item)}>
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineButton} onPress={() => handleDecline(item)}>
                    <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewButton} onPress={() => handleViewProperty(item)}>
                    <Text style={styles.buttonText}>View</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tripping Requests</Text>
            <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Recent</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={sellersData}
                keyExtractor={(item) => item.id}
                renderItem={renderSellerItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f6f6f6',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#5B7931', // Main color
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    filterButton: {
        backgroundColor: '#E5BC2B', // Highlight color
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    filterText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContainer: {
        paddingBottom: 20,
    },
    sellerCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },
    propertyImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 10,
    },
    sellerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5B7931', // Main color
    },
    propertyDetails: {
        fontSize: 16,
        color: '#555',
        marginVertical: 5,
    },
    meetingInfo: {
        fontSize: 14,
        color: '#777',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#5B7931', // Main color
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
        alignItems: 'center',
    },
    declineButton: {
        flex: 1,
        backgroundColor: '#E5BC2B', // Highlight color
        padding: 10,
        borderRadius: 5,
        marginLeft: 5,
        alignItems: 'center',
    },
    viewButton: {
        flex: 1,
        backgroundColor: '#3498db', // Color for view button
        padding: 10,
        borderRadius: 5,
        marginLeft: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

