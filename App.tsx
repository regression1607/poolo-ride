import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor="#f9fafb" translucent={false} />
        <AppNavigator />
      </AuthProvider>
    </Provider>
  );
}
