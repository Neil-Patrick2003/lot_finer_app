import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosConfig from "../Helper/axiosConfig";

export default function Tripping() {
  const navigation = useNavigation();
  const [trippings, setTrippings] = useState([]);
  const [filter, setFilter] = useState("today");

  useEffect(() => {
    fetchTrippings();
  }, []);

  const fetchTrippings = async () => {
    try {
      const response = await axiosConfig.get("/agent/tripping");
      if (response.status === 200) {
        setTrippings(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading trippings:", error);
      Alert.alert("Error", "Failed to load trippings.");
    }
  };

  const updateTrippingStatus = async (id, action) => {
    try {
      const response = await axiosConfig.put(`/agent/tripping/${id}/${action}`);
      if (response.status === 200) {
        Alert.alert("Success", `Inquiry ${action}ed successfully.`);
        fetchTrippings();
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      console.error("Update error:", message);
      Alert.alert("Error", message);
    }
  };

  const handleAccept = (tripping) => {
    Alert.alert(
      "Confirm",
      `Accept meeting with ${tripping.buyer?.name || "Buyer"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => updateTrippingStatus(tripping.inquiry_id, "accept"),
        },
      ]
    );
  };

  const handleDecline = (tripping) => {
    Alert.alert(
      "Confirm",
      `Decline meeting with ${tripping.buyer?.name || "Buyer"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => updateTrippingStatus(tripping.inquiry_id, "decline"),
        },
      ]
    );
  };

  const handleViewProperty = (property) => {
    navigation.navigate("PropertyDetails", { property });
  };

  const getVisitStatusText = (visitDate) => {
  if (!visitDate) return "No Date";

  const visit = new Date(visitDate);
  const today = new Date();

  // Remove time portion for comparison
  visit.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInMs = visit - today;
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Tomorrow";
  if (diffInDays === -1) return "Visited yesterday";
  if (diffInDays < 0) return `Visited ${Math.abs(diffInDays)} days ago`;
  if (diffInDays > 1) return `In ${diffInDays} days`;
};


  const renderItem = ({ item }) => (
    <View style={styles.sellerCard}>
      {item.property?.image_url && (
        <Image
          source={{ uri: `http://192.168.0.109/storage/${item.property.image_url}` }}
          style={styles.propertyImage}
        />
      )}
      <Text style={styles.sellerName}>{item.buyer?.name || "Unknown Buyer"}</Text>
      <Text style={styles.propertyDetails}>{item.property?.title || "No Title"}</Text>
      <Text style={styles.meetingInfo}>Date: {item.visit_date || "N/A"}</Text>
      <Text style={styles.meetingInfo}>Time: {item.visit_time || "N/A"}</Text>
      <Text style={styles.meetingInfo}>Status: {item.status}</Text>

      <View style={styles.buttonContainer}>
         <View style={[styles.statusBox]}>
            <Text style={styles.statusText}>{getVisitStatusText(item.visit_date)}</Text>
        </View>

        {item.status === "Pending" && (
          <>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAccept(item)}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => handleDecline(item)}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tripping Requests</Text>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "today" && { backgroundColor: "#5B7931" }]}
          onPress={() => setFilter("today")}
        >
          <Text style={styles.filterText}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "recent" && { backgroundColor: "#5B7931" }]}
          onPress={() => setFilter("recent")}
        >
          <Text style={styles.filterText}>Recent</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trippings.filter(item => {
          const today = new Date().toISOString().split("T")[0];
          if (filter === "today") {
            return item.visit_date === today;
          } else {
            return true;
          }
        })}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f6f6f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#5B7931",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: "#E5BC2B",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  sellerCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  propertyImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B7931",
  },
  propertyDetails: {
    fontSize: 16,
    color: "#555",
    marginVertical: 5,
  },
  meetingInfo: {
    fontSize: 14,
    color: "#777",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#5B7931",
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: "center",
  },
  declineButton: {
    flex: 1,
    backgroundColor: "#E5BC2B",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  viewButton: {
    flex: 1,
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

statusBox: {
  flex: 1,
  backgroundColor: "#ccc",
  padding: 10,
  borderRadius: 5,
  alignItems: "center",
},
});


