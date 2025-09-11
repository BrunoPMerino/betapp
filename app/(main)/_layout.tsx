import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
         <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#000',
                    borderTopWidth: 1,
                    borderTopColor: '#000',
                }
            }}>
            <Tabs.Screen name="home" 
            options={{
                title: "Home",
                tabBarActiveTintColor: "#7a5cff",
                tabBarIcon(props) {
                    return <FontAwesome name="home" size={props.size} color={props.focused ? "#7a5cff" : "grey" } />
                },
            }}
            />
            <Tabs.Screen name="roulette" 
            options={{
                title: "roulette",
                tabBarActiveTintColor: "#7a5cff",
                tabBarIcon(props) {
                    return <MaterialCommunityIcons name="cards" size={props.size} color={props.focused ? "#7a5cff" : "grey" } />
                },
            }}
            />
            <Tabs.Screen name="blackjack" 
            options={{
                title: "blackjack",
                tabBarActiveTintColor: "#7a5cff",
                tabBarIcon(props) {
                    return <MaterialCommunityIcons name="cards" size={props.size} color={props.focused ? "#7a5cff" : "grey" } />
                },
            }}
            />
            <Tabs.Screen name="poker" 
            options={{
                title: "poker",
                tabBarActiveTintColor: "#7a5cff",
                tabBarIcon(props) {
                    return <MaterialCommunityIcons name="cards" size={props.size} color={props.focused ? "#7a5cff" : "grey" } />
                },
            }}
            />
            <Tabs.Screen name="profile"
            options={{
                title: "profile",
                tabBarActiveTintColor: "#7a5cff",
                tabBarIcon(props) {
                    return <FontAwesome name="user" size={props.size} color={props.focused ? "#7a5cff" : "grey" } />
                },
            }}
            />
        </Tabs>
    );
}