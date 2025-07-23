import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker, Polygon } from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const PropertyTypes = [
  {
    name: "Apartment",
    subTypes: ["Penthouse", "Loft", "Bedspace", "Room"]
  },
  {
    name: "Commercial",
    subTypes: ["Retail", "Offices", "Building", "Warehouse", "Serviced Office", "Coworking Space"]
  },
  {
    name: "Condominium",
    subTypes: ["Loft", "Studio", "Penthouse", "Other", "Condotel"]
  },
  {
    name: "House",
    subTypes: ["Townhouse", "Beach House", "Single Family House", "Villas"]
  },
  {
    name: "Land",
    subTypes: ["Beach Lot", "Memorial Lot", "Agricultural Lot", "Commercial Lot", "Residential Lot", "Parking Lot"]
  }
];

const PropertyListingScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: '',
    property_sub_type: '',
    price: '',
    address: '',
    lot_area: '',
    floor_area: '',
    total_rooms: '',
    total_bedrooms: '',
    total_bathrooms: '',
    car_slots: '',
    isPresell: false,
    feature_name: [],
    boundary: [],
    pin: [],
    agent_ids: [],
    allowMultipleAgent: false
  });

  const [selectedType, setSelectedType] = useState(null);
  const [featureInput, setFeatureInput] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [allowMultipleAgents, setAllowMultipleAgents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [region] = useState({
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [boundaryCoordinates, setBoundaryCoordinates] = useState([]);
  const [pinLocation, setPinLocation] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const API_BASE_URL = 'http://192.168.254.106:8000/api/agent';

  useEffect(() => {
    const setAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error setting auth token:', error);
      }
    };
    setAuthToken();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      let agentsData = [];
      
      if (Array.isArray(response.data)) {
        agentsData = response.data;
      } else if (response.data.agents && Array.isArray(response.data.agents)) {
        agentsData = response.data.agents;
      } else if (response.data.id) {
        agentsData = [response.data];
      }

      setAgents(agentsData);
      
    } catch (error) {
      console.error('Error loading agents:', error);
      let errorMessage = 'Failed to load agents';
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const pickMainImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera roll permissions to upload images');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setMainImage(result.assets[0].uri);
    }
  };

  const pickAdditionalImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera roll permissions to upload images');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setAdditionalImages([...additionalImages, ...newImages]);
    }
  };

  const removeAdditionalImage = (index) => {
    const newImages = [...additionalImages];
    newImages.splice(index, 1);
    setAdditionalImages(newImages);
  };

  const handleTypeSelect = (typeName) => {
    const selected = PropertyTypes.find(type => type.name === typeName);
    setSelectedType(selected);
    setFormData({ ...formData, property_type: typeName, property_sub_type: '' });
  };

   const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    
    if (isDrawing) {
      const newBoundary = [...boundaryCoordinates, { latitude, longitude }];
      setBoundaryCoordinates(newBoundary);
      setFormData({
        ...formData,
        boundary: newBoundary
      });
    } else {
      setPinLocation({ latitude, longitude });
      setFormData({ 
        ...formData, 
        pin: [{ latitude, longitude }]
      });
    }
  };

  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
    if (!isDrawing) {
      setBoundaryCoordinates([]);
      setFormData({...formData, boundary: []});
    }
  };

  const addFeature = () => {
    if (featureInput.trim() !== '') {
      setFormData({
        ...formData,
        feature_name: [...formData.feature_name, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    const updatedFeatures = formData.feature_name.filter((_, i) => i !== index);
    setFormData({ ...formData, feature_name: updatedFeatures });
  };

  const toggleAgentSelection = (id) => {
    if (allowMultipleAgents) {
      if (selectedAgents.includes(id)) {
        setSelectedAgents(selectedAgents.filter(agentId => agentId !== id));
      } else {
        setSelectedAgents([...selectedAgents, id]);
      }
    } else {
      setSelectedAgents(selectedAgents.includes(id) ? [] : [id]);
    }
  };

  const toggleAllowMultipleAgents = () => {
    const newValue = !allowMultipleAgents;
    setAllowMultipleAgents(newValue);
    setFormData({
      ...formData,
      allowMultipleAgent: newValue
    });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.title) {
      errors.title = 'Title is required';
      isValid = false;
    }
    if (!formData.description) {
      errors.description = 'Description is required';
      isValid = false;
    }
    if (!formData.property_type) {
      errors.property_type = 'Property type is required';
      isValid = false;
    }
    if (!formData.property_sub_type) {
      errors.property_sub_type = 'Property subtype is required';
      isValid = false;
    }
    if (!formData.price) {
      errors.price = 'Price is required';
      isValid = false;
    }
    if (!formData.address) {
      errors.address = 'Address is required';
      isValid = false;
    }
    if (!mainImage) {
      errors.mainImage = 'Main image is required';
      isValid = false;
    }
    if (!formData.boundary || formData.boundary.length < 3) {
      errors.boundary = 'Please draw a boundary with at least 3 points';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token not found');

      const data = new FormData();

      // Format boundary for backend
      const formattedBoundary = boundaryCoordinates.map(coord => ({
        lat: coord.latitude,
        lng: coord.longitude
      }));

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'boundary') {
            data.append(key, JSON.stringify(formattedBoundary));
          } else if (key === 'pin') {
            data.append(key, JSON.stringify(value));
          } else if (Array.isArray(value)) {
            value.forEach(item => data.append(`${key}[]`, item));
          } else {
            data.append(key, value);
          }
        }
      });

      // Append images
      if (mainImage) {
        const mainImageName = mainImage.split('/').pop();
        data.append('image_url', {
          uri: mainImage,
          name: mainImageName,
          type: 'image/jpeg'
        });
      }

      additionalImages.forEach((img, index) => {
        const imgName = img.split('/').pop() || `image_${index}.jpg`;
        data.append('image_urls[]', {
          uri: img,
          name: imgName,
          type: 'image/jpeg'
        });
      });

      const response = await axios.post(`${API_BASE_URL}/postproperty`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });

      if (response.data) {
        Alert.alert('Success', 'Property listed successfully!');
        resetForm();
      }
    } catch (error) {
      console.error('Submission error:', error);
      handleSubmissionError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      property_type: '',
      property_sub_type: '',
      price: '',
      address: '',
      lot_area: '',
      floor_area: '',
      total_rooms: '',
      total_bedrooms: '',
      total_bathrooms: '',
      car_slots: '',
      isPresell: false,
      feature_name: [],
      boundary: [],
      pin: [],
      agent_ids: [],
      allowMultipleAgent: false
    });
    setMainImage(null);
    setAdditionalImages([]);
    setSelectedAgents([]);
    setBoundaryCoordinates([]);
    setPinLocation(null);
    setIsDrawing(false);
    setFieldErrors({});
  };

  const handleSubmissionError = (error) => {
    let errorMessage = 'Failed to list property';
    
    if (error.response) {
      if (error.response.status === 422) {
        // Handle Laravel validation errors
        const validationErrors = error.response.data.errors;
        errorMessage = Object.values(validationErrors).flat().join('\n');
        
        // Map backend errors to field errors
        const newFieldErrors = {};
        Object.keys(validationErrors).forEach(key => {
          newFieldErrors[key] = validationErrors[key][0];
        });
        setFieldErrors(newFieldErrors);
      } 
      else if (error.response.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        navigation.navigate('Login');
      }
      else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    Alert.alert('Error', errorMessage);
  };

  return ( 
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List Property</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Information</Text>
        
        <View style={styles.toggleContainer}>
          <Text>Is this a pre-sell property?</Text>
          <TouchableOpacity 
            style={[styles.toggle, formData.isPresell ? styles.toggleActive : null]}
            onPress={() => setFormData({
              ...formData, 
              isPresell: !formData.isPresell
            })}
          >
            <View style={[styles.toggleCircle, formData.isPresell ? styles.toggleCircleActive : null]} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.input, 
            fieldErrors.title && styles.inputError
          ]}
          placeholder="Property Title"
          value={formData.title}
          onChangeText={(text) => {
            setFormData({...formData, title: text});
            setFieldErrors({...fieldErrors, title: null});
          }}
        />
        {fieldErrors.title && (
          <Text style={styles.errorText}>{fieldErrors.title}</Text>
        )}

        <TextInput
          style={[
            styles.input, 
            {height: 100},
            fieldErrors.description && styles.inputError
          ]}
          placeholder="Detailed Description"
          multiline
          value={formData.description}
          onChangeText={(text) => {
            setFormData({...formData, description: text});
            setFieldErrors({...fieldErrors, description: null});
          }}
        />
        {fieldErrors.description && (
          <Text style={styles.errorText}>{fieldErrors.description}</Text>
        )}

        <TouchableOpacity 
          style={styles.imageUpload} 
          onPress={pickMainImage}
        >
          {mainImage ? (
            <Image source={{uri: mainImage}} style={styles.imagePreview} resizeMode="cover" />
          ) : (
            <View style={styles.imageUploadPlaceholder}>
              <MaterialIcons name="add-a-photo" size={40} color="#999" />
              <Text>Upload Main Property Image</Text>
            </View>
          )}
        </TouchableOpacity>
        {fieldErrors.mainImage && (
          <Text style={styles.errorText}>{fieldErrors.mainImage}</Text>
        )}

        <Text style={styles.label}>Property Type</Text>
        <View style={styles.typeContainer}>
          {PropertyTypes.map((type) => (
            <TouchableOpacity
              key={type.name}
              style={[
                styles.typeButton,
                formData.property_type === type.name && styles.typeButtonActive,
                fieldErrors.property_type && formData.property_type !== type.name && styles.typeButtonError
              ]}
              onPress={() => {
                handleTypeSelect(type.name);
                setFieldErrors({...fieldErrors, property_type: null});
              }}
            >
              <Text style={formData.property_type === type.name ? styles.typeButtonTextActive : styles.typeButtonText}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {fieldErrors.property_type && (
          <Text style={styles.errorText}>{fieldErrors.property_type}</Text>
        )}

        {selectedType && (
          <View style={styles.subtypeContainer}>
            <Text style={styles.label}>Property Subtype</Text>
            <Picker
              selectedValue={formData.property_sub_type}
              onValueChange={(itemValue) => {
                setFormData({...formData, property_sub_type: itemValue});
                setFieldErrors({...fieldErrors, property_sub_type: null});
              }}
              style={[
                styles.picker,
                fieldErrors.property_sub_type && styles.inputError
              ]}
            >
              <Picker.Item label="Select subtype..." value="" />
              {selectedType.subTypes.map((subType) => (
                <Picker.Item key={subType} label={subType} value={subType} />
              ))}
            </Picker>
            {fieldErrors.property_sub_type && (
              <Text style={styles.errorText}>{fieldErrors.property_sub_type}</Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing</Text>
        
        <TextInput
          style={[
            styles.input, 
            fieldErrors.price && styles.inputError
          ]}
          placeholder="Price (₱)"
          keyboardType="numeric"
          value={formData.price}
          onChangeText={(text) => {
            setFormData({...formData, price: text});
            setFieldErrors({...fieldErrors, price: null});
          }}
        />
        {fieldErrors.price && (
          <Text style={styles.errorText}>{fieldErrors.price}</Text>
        )}

        <TextInput
          style={[
            styles.input, 
            fieldErrors.address && styles.inputError
          ]}
          placeholder="Full Address"
          value={formData.address}
          onChangeText={(text) => {
            setFormData({...formData, address: text});
            setFieldErrors({...fieldErrors, address: null});
          }}
        />
        {fieldErrors.address && (
          <Text style={styles.errorText}>{fieldErrors.address}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        
        <View style={styles.detailRow}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Lot Area (sqm)"
            keyboardType="numeric"
            value={formData.lot_area}
            onChangeText={(text) => setFormData({...formData, lot_area: text})}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Floor Area (sqm)"
            keyboardType="numeric"
            value={formData.floor_area}
            onChangeText={(text) => setFormData({...formData, floor_area: text})}
          />
        </View>

        <View style={styles.detailRow}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Total Rooms"
            keyboardType="numeric"
            value={formData.total_rooms}
            onChangeText={(text) => setFormData({...formData, total_rooms: text})}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Bedrooms"
            keyboardType="numeric"
            value={formData.total_bedrooms}
            onChangeText={(text) => setFormData({...formData, total_bedrooms: text})}
          />
        </View>

        <View style={styles.detailRow}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Bathrooms"
            keyboardType="numeric"
            value={formData.total_bathrooms}
            onChangeText={(text) => setFormData({...formData, total_bathrooms: text})}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Car Slots"
            keyboardType="numeric"
            value={formData.car_slots}
            onChangeText={(text) => setFormData({...formData, car_slots: text})}
          />
        </View>

        <Text style={styles.label}>Additional Images</Text>
        <TouchableOpacity style={styles.addImageButton} onPress={pickAdditionalImages}>
          <Text style={styles.addImageButtonText}>+ Add Images</Text>
        </TouchableOpacity>

        <ScrollView horizontal style={styles.additionalImagesContainer}>
          {additionalImages.map((image, index) => (
            <View key={index} style={styles.additionalImageWrapper}>
              <Image source={{uri: image}} style={styles.additionalImage} resizeMode="cover" />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => removeAdditionalImage(index)}
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.label}>Features</Text>
        <View style={styles.featureInputContainer}>
          <TextInput
            style={[styles.input, {flex: 1}]}
            placeholder="Add a feature (e.g. Balcony, Maid's Room)"
            value={featureInput}
            onChangeText={setFeatureInput}
            onSubmitEditing={addFeature}
          />
          <TouchableOpacity style={styles.addFeatureButton} onPress={addFeature}>
            <Text style={styles.addFeatureButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresContainer}>
          {formData.feature_name.map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
              <TouchableOpacity onPress={() => removeFeature(index)}>
                <Ionicons name="close" size={16} color="#333" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Map Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Map Location</Text>
        {fieldErrors.boundary && (
          <Text style={styles.errorText}>{fieldErrors.boundary}</Text>
        )}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={handleMapPress}
          >
            {pinLocation && <Marker coordinate={pinLocation} />}
            {boundaryCoordinates.length > 0 && (
              <Polygon
                coordinates={boundaryCoordinates}
                strokeColor="#FF0000"
                fillColor="rgba(255,0,0,0.2)"
                strokeWidth={2}
              />
            )}
          </MapView>
          <TouchableOpacity 
            style={styles.drawBoundaryButton}
            onPress={toggleDrawing}
          >
            <Text style={styles.drawBoundaryButtonText}>
              {isDrawing ? 'Finish Drawing' : 'Draw Boundary'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
   

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assign Agents</Text>
        
        <TouchableOpacity 
          style={styles.toggleAgentModeButton}
          onPress={toggleAllowMultipleAgents}
        >
          <Text style={styles.toggleAgentModeButtonText}>
            {allowMultipleAgents ? 'Switch to Single Agent' : 'Switch to Multiple Agents'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loadAgentsButton}
          onPress={loadAgents}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loadAgentsButtonText}>Load Agents</Text>
          )}
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : agents.length > 0 ? (
          <View style={styles.agentsList}>
            {agents.map(agent => (
              <TouchableOpacity
                key={agent.id}
                style={[
                  styles.agentItem,
                  selectedAgents.includes(agent.id) && styles.agentItemSelected
                ]}
                onPress={() => toggleAgentSelection(agent.id)}
              >
                <Text style={styles.agentName}>{agent.name || 'No name'}</Text>
                <Text style={styles.agentEmail}>{agent.email || 'No email'}</Text>
                {selectedAgents.includes(agent.id) && (
                  <View style={styles.agentSelectedIndicator}>
                    <Ionicons name="checkmark" size={20} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.noAgentsText}>No agents available</Text>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Property</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
  },
  halfInput: {
    flex: 1,
    marginRight: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
  imageUpload: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  imageUploadPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  typeButton: {
    padding: 10,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  typeButtonError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  typeButtonText: {
    color: '#333',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  subtypeContainer: {
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  addImageButton: {
    backgroundColor: '#5C7934',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  addImageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  additionalImagesContainer: {
    marginBottom: 15,
  },
  additionalImageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  additionalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  addFeatureButton: {
    backgroundColor: '#d9a924',
    padding: 10,
    borderRadius: 8,
    marginLeft: 5,
    height: 45,
    justifyContent: 'center',
  },
  addFeatureButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    padding: 8,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    marginRight: 5,
  },
  mapContainer: {
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  drawBoundaryButton: {
    backgroundColor: '#315431',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  drawBoundaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  toggleAgentModeButton: {
    backgroundColor: '#d9a924',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleAgentModeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadAgentsButton: {
    backgroundColor: '#537c4c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  loadAgentsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  agentsList: {
    marginBottom: 15,
  },
  agentItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    position: 'relative',
  },
  agentItemSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0fff0',
  },
  agentName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  agentEmail: {
    color: '#666',
  },
  agentSelectedIndicator: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#93c36b',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#5C7934',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 15,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noAgentsText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
    fontStyle: 'italic',
  },
});

export default PropertyListingScreen;