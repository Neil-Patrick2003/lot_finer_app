// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import axiosConfig from '../../Helper/axiosConfig';

// export default function Chat({ navigation }) {
//   const [chats, setChats] = useState([]);
//   const [filteredChats, setFilteredChats] = useState([]);
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     fetchChat();
//   }, []);

//   useEffect(() => {
//     handleSearch(search);
//   }, [search, chats]);

//   const fetchChat = async () => {
//     try {
//       const response = await axiosConfig.get('/agent/chat');
//       if (response.status === 200) {
//         const data = response.data.data || [];
//         setChats(data);
//         setFilteredChats(data);
//       }
//     } catch (error) {
//       console.error('Error loading chats:', error);
//     }
//   };

//   const handleSearch = (text) => {
//     setSearch(text);
//     if (text.trim() === '') {
//       setFilteredChats(chats);
//     } else {
//       const filtered = chats.filter((chat) =>
//         chat.chatmate_name?.toLowerCase().includes(text.toLowerCase())
//       );
//       setFilteredChats(filtered);
//     }
//   };

//   const renderChatItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.chatCard}
//       onPress={() => navigation.navigate('SingleChat', { chatId: item.channel_id })}
//     >
//       {item.chatmate_avatar ? (
//         <Image source={{ uri: item.chatmate_avatar }} style={styles.avatar} />
//       ) : (
//         <View style={styles.fallbackAvatar}>
//           <Text style={styles.fallbackText}>
//             {item.chatmate_name?.charAt(0)?.toUpperCase() || 'U'} {item.id}
//           </Text>
//         </View>
//       )}
//       <View style={styles.chatInfo}>
//         <Text style={styles.chatName}>{item.chatmate_name}</Text>
//         <Text style={styles.chatMessage} numberOfLines={1}>
//           {item.last_message || 'Start the conversation...'}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Messages</Text>

//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search chatmate..."
//         value={search}
//         onChangeText={handleSearch}
//       />

//       {filteredChats.length > 0 ? (
//         <FlatList
//           data={filteredChats}
//           keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}          renderItem={renderChatItem}
//           contentContainerStyle={styles.chatList}
//         />
//       ) : (
//         <Text style={styles.emptyText}>No chats found.</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 20,
//     paddingTop: 60,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   searchInput: {
//     height: 45,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   chatList: {
//     paddingBottom: 20,
//   },
//   chatCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     borderRadius: 12,
//     backgroundColor: '#f9f9f9',
//     marginBottom: 10,
//     elevation: 1,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 15,
//     backgroundColor: '#ddd',
//   },
//   fallbackAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 15,
//     backgroundColor: '#999',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fallbackText: {
//     fontSize: 20,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   chatInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   chatName: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   chatMessage: {
//     color: '#555',
//     fontSize: 14,
//   },
//   emptyText: {
//     textAlign: 'center',
//     marginTop: 40,
//     fontSize: 16,
//     color: '#aaa',
//   },
// });
