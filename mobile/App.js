import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';
import ServicesScreen from './screens/ServicesScreen';
import CartScreen from './screens/CartScreen';
import AccountScreen from './screens/AccountScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerTitle: 'EkoNzims' }}
      />
    </Stack.Navigator>
  );
}

function ProductsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Products" 
        component={ProductsScreen}
        options={{ headerTitle: 'Nos Produits' }}
      />
    </Stack.Navigator>
  );
}

function ServicesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Services" 
        component={ServicesScreen}
        options={{ headerTitle: 'Nos Services' }}
      />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ headerTitle: 'Mon Panier' }}
      />
    </Stack.Navigator>
  );
}

function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Account" 
        component={AccountScreen}
        options={{ headerTitle: 'Mon Compte' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'ProductsTab') {
              iconName = focused ? 'bag' : 'bag-outline';
            } else if (route.name === 'ServicesTab') {
              iconName = focused ? 'hammer' : 'hammer-outline';
            } else if (route.name === 'CartTab') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'AccountTab') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#27ae60',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="HomeTab" 
          component={HomeStack}
          options={{ tabBarLabel: 'Accueil' }}
        />
        <Tab.Screen 
          name="ProductsTab" 
          component={ProductsStack}
          options={{ tabBarLabel: 'Produits' }}
        />
        <Tab.Screen 
          name="ServicesTab" 
          component={ServicesStack}
          options={{ tabBarLabel: 'Services' }}
        />
        <Tab.Screen 
          name="CartTab" 
          component={CartStack}
          options={{ tabBarLabel: 'Panier' }}
        />
        <Tab.Screen 
          name="AccountTab" 
          component={AccountStack}
          options={{ tabBarLabel: 'Compte' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
