import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Login = () => {
  const router = useRouter();  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const loginData = { email, password };

    try {
      const response = await fetch('http://192.168.1.40:5000/api/user/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        router.replace('dashboard'); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Error during login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.floatingContainer}>
        <Text style={styles.title}>Quest Board</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={15} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome6 name="lock" size={15} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#888"
          />
        </View>
        <View style={{ marginTop: 10, fontSize: 14, justifyContent: 'center', alignItems: 'center'}}>    
          <TouchableOpacity onPress={() => router.push('recover')}>
            <Text style={[styles.recoverText, styles.link]}> Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('dashboard')}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Don't you have an account?{' '}
          <Text style={styles.link} onPress={() => router.push('register')}>
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f3c73',
    paddingHorizontal: 20,
  },
  floatingContainer: {
    width: '90%',
    backgroundColor: '#cbd2da',
    padding: 30,
    borderRadius: 16,
    elevation: 10,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    marginTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0f3c73',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginBottom: 10,
    marginTop: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#0f3c73',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: 'black',
    marginTop: 30,
    textAlign: 'center',
  },
  link: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 10,
  },
  iconSpacing: {
    marginHorizontal: 25, 
    alignContent: 'space-between',
  },
});
export default Login;