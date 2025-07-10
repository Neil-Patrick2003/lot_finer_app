import { Dimensions, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

const { width } = Dimensions.get('window');

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    name: 'Neil Patrick Mulingbayan',
    message: 'Hello Neil '
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
    name: 'Neil Patrick Mulingbayan',
    message: 'Good evening'


  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    name: 'Neil Patrick Mulingbayan',
    message: 'Hello there,'

  },
];


const Item = ({ name, message }) => (
    <View style={styles.itemWrapper}>
      <View style={styles.message_container}>
        <View style={styles.icon}></View>
  
        <View style={styles.message}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.message_text}>{message}</Text>
        </View>
      </View>
    </View>
  );


export default function Home () {
  return (
    <View style={styles.container}>
      <View>
        <TextInput style={styles.input} placeholder="Search" />
      </View>
      <View>
        {/* //FlatList */}
        <FlatList
            data={DATA}
            renderItem={({item}) => <Item name={item?.name} message={item.message} />}
            keyExtractor={item => item.id}
        />
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: width * 0.05,
  },

  input: {
    backgroundColor: '#efeded',
    borderRadius: 18,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },

  message_container: {
    display: 'flex',
    flexDirection: "row",
    paddingBottom: 8,
    paddingTop: 8
  },

  icon: {
    height:  60,
    width: 60, 
    borderRadius: 100,
    backgroundColor: "gray",
    
  },

  message: {
    padding: 8
  },

  name: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16
  },

  message_text: {
    color: "gray",
    fontSize: 14,
    marginTop: 2
  }






});
