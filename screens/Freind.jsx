import { Text, TouchableOpacity, View } from "react-native";

export default function Freind({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => navigation.navigate('NewScreen')}>
        <Text style={{ fontSize: 18, color: 'blue' }}>Go to New Screen</Text>
      </TouchableOpacity>
    </View>
  );
}
