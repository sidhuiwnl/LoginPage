import { Text, View } from "react-native";

export default function HomePage() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black", // optional for contrast
            }}
        >
            <Text style={{ color: "white", fontSize: 24 }}>Home Page</Text>
        </View>
    );
}
