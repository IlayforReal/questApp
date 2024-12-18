import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getDatabase, ref, push, set } from 'firebase/database'; // Import necessary functions
import app from '../../firebase'; // Go up two levels if firebase.js is directly in the root



const Register = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const saveData = async () => {
    // Get database reference
    const db = getDatabase(app);
    const userRef = ref(db, 'users/'); // You can modify this path as needed

    const newUserRef = push(userRef); // Add a new entry under 'users'
    set(newUserRef, {
      firstName,
      lastName,
      age,
      phoneNumber,
      email,
      password,
    }).then(() => {
      Alert.alert('Registration successful');
      router.push('account');  // Navigate to the next screen
    }).catch((error) => {
      console.error("Error writing to database:", error);
      Alert.alert('Error saving data', error.message);
    });
  };

  const handleRegister = async () => {
    const userData = { firstName, lastName, age, phoneNumber, email, password, confirmPassword };

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!firstName || !lastName || !age || !phoneNumber || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Save data to Firebase Realtime Database
      await saveData();
    } catch (error) {
      console.error(error);
      alert('Error during registration');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.floatingContainer}>
        <Text style={styles.title}>Create an Account</Text>
        <View style={styles.nameContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor="#888"
            value={age}
            onChangeText={setAge}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => router.push('login')}>
            Login
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
    backgroundColor: 'white',
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
    marginTop: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '105%',
    marginBottom: 20,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    fontSize: 16,
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
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: 'white',
    marginTop: 40,
    marginBottom: 40,
    textAlign: 'center',
  },
});

export default Register;
