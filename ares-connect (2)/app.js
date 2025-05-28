import { registerRootComponent } from 'expo';
import { createElement } from 'react';
import { createApp } from 'expo-router/build/app';

// This is the entry point for the Expo app
const App = createApp({
  // Define your app configuration here if needed
});

// Register the root component
registerRootComponent(App);