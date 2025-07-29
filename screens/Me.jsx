import { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import axiosInstance, { API_ENDPOINTS } from "../Helper/axiosConfig";

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [filterType, setFilterType] = useState("toSeller");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.INQUIRIES); // Replace with API_ENDPOINTS.INQUIRIES when ready
      if (response.status === 200) {
        setInquiries(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading inquiries:", error);
      Alert.alert("Error", "Failed to load inquiries.");
    }
  };

  const handleUpdate = (id, action) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${action} this inquiry?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await axiosInstance.put(API_ENDPOINTS.INQUIRIES2);
              if (response.status === 200) {
                Alert.alert("Success", `Inquiry ${action}ed successfully.`);
                fetchInquiries();
              }
            } catch (error) {
              const message =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Something went wrong. Please try again.";
              console.error("Update error:", message);
              Alert.alert("Error", message);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const inquiriesToSeller = inquiries.filter((inq) => inq.buyer_id === null);
  const inquiriesFromBuyer = inquiries.filter((inq) => inq.buyer_id !== null);

  const renderItem = ({ item }) => {
    const isBuyerInquiry = item.buyer_id !== null;
    const person = isBuyerInquiry ? item.buyer : item.seller;

    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.property?.title || "No Title"}</Text>
        <Text style={styles.subText}>
          Status: <Text style={styles.statusValue}>{item.status}</Text>
        </Text>
        <Text style={styles.subText}>
          Location: {item.property?.address || "Unknown"}
        </Text>
        <Text style={styles.subText}>
          {isBuyerInquiry ? "From Buyer" : "To Seller"}:{" "}
          <Text style={styles.bold}>{person?.name || "N/A"}</Text>
        </Text>
        <Text style={styles.subText}>Email: {person?.email || "N/A"}</Text>

        {item.property?.image_url && (
          <Image
            source={{ uri: `${API_ENDPOINTS.STORAGE}/${item.property.image_url}` }}
            style={styles.image}
          />
        )}

        <View style={styles.actionContainer}>
          {item.status === "Pending" ? (
            isBuyerInquiry ? (
              <>
                <TouchableOpacity
                  onPress={() => handleUpdate(item.id, "accept")}
                  style={styles.acceptBtn}
                >
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleUpdate(item.id, "decline")}
                  style={styles.declineBtn}
                >
                  <Text style={styles.btnText}>Decline</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => handleUpdate(item.id, "cancel")}
                style={styles.cancelBtn}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            )
          ) : (
            <Text style={styles.statusText}>{item.status}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inquiries</Text>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterBtn, filterType === "toSeller" && styles.activeFilter]}
          onPress={() => setFilterType("toSeller")}
        >
          <Text style={styles.filterText}>
            My Inquiries ({inquiriesToSeller.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filterType === "fromBuyer" && styles.activeFilter]}
          onPress={() => setFilterType("fromBuyer")}
        >
          <Text style={styles.filterText}>
            Received Inquiries ({inquiriesFromBuyer.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filterType === "toSeller" ? inquiriesToSeller : inquiriesFromBuyer}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.noData}>No inquiries found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4F7FA",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1f2937",
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 2,
  },
  statusValue: {
    fontWeight: "600",
    color: "#111",
  },
  bold: {
    fontWeight: "bold",
    color: "#1f2937",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 12,
  },
  actionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  acceptBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  declineBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: "#F59E0B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    paddingVertical: 4,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: "#60A5FA",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  noData: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#9CA3AF",
  },
});