import { Text, TouchableOpacity, View } from "react-native";

export default function NewScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>New screen</Text>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={{ color: 'blue', marginTop: 20 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
