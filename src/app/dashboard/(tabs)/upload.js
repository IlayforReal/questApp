import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getDatabase, ref, set, push } from 'firebase/database';
import { app } from '../../../../firebase'; // Import the initialized app from firebase.js

const Upload = () => {
  const [postContent, setPostContent] = useState(''); // For task content
  const [skillRequired, setSkillRequired] = useState(''); // For skill required
  const [deadline, setDeadline] = useState(''); // For deadline
  const [amount, setAmount] = useState(''); // For amount
  const [category, setCategory] = useState(''); // For category selection
  const [loading, setLoading] = useState(false); // For button state

  const handlePost = async () => {
    if (!postContent.trim() || !skillRequired.trim() || !deadline.trim() || !amount.trim() || !category.trim()) {
      Alert.alert('Error', 'Please fill in all fields!');
      return;
    }

    setLoading(true); // Start loading indicator
    const db = getDatabase(app); // Use the imported app (already initialized)
    const newQuestRef = push(ref(db, 'quests')); // Save to the "quests" path
    try {
      await set(newQuestRef, {
        content: postContent.trim(),
        skillRequired: skillRequired.trim(),
        deadline: deadline.trim(),
        amount: amount.trim(),
        category: category.trim(),
        createdAt: new Date().toISOString(),
        status: 'pending', // Optional field
      });
      Alert.alert('Success', 'Quest posted successfully!');
      setPostContent(''); // Clear content field
      setSkillRequired(''); // Clear skill field
      setDeadline(''); // Clear deadline field
      setAmount(''); // Clear amount field
      setCategory(''); // Clear category field
    } catch (err) {
      Alert.alert('Error', err.message);
      console.error('Error saving data:', err); // Log error for debugging
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Post Quest</Text>

        <TextInput
          style={styles.input}
          placeholder="Post a task..."
          placeholderTextColor="#888"
          multiline
          height={150}
          numberOfLines={10}
          value={postContent}
          onChangeText={setPostContent}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterBox} onPress={() => setCategory('Personal')}>
            <Text style={styles.label}>Personal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBox} onPress={() => setCategory('Event Assistant')}>
            <Text style={styles.label}>Event Assistant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBox} onPress={() => setCategory('Printing')}>
            <Text style={styles.label}>Printing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBox} onPress={() => setCategory('Pick-up & Delivery')}>
            <Text style={styles.label}>Pick-up & Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBox} onPress={() => setCategory('Lost & Found')}>
            <Text style={styles.label}>Lost & Found</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBox} onPress={() => setCategory('Tutoring')}>
            <Text style={styles.label}>Tutoring</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Skill required</Text>
          <TextInput
            style={styles.input}
            placeholder="Skill required"
            placeholderTextColor="#888"
            value={skillRequired}
            onChangeText={setSkillRequired}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Deadline for completion</Text>
          <TextInput
            style={styles.input}
            placeholder="Deadline"
            placeholderTextColor="#888"
            value={deadline}
            onChangeText={setDeadline}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#888"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <TouchableOpacity
          style={[styles.postButton, loading && { opacity: 0.5 }]} // Dim button during loading
          onPress={handlePost}
          disabled={loading} // Disable button while loading
        >
          <Text style={styles.postButtonText}>
            {loading ? 'Saving...' : 'Post'} {/* Show saving text */}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes up all available space
    backgroundColor: '#cbd2da',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1, // Allows ScrollView to grow and fill the screen properly
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0f3c73',
    paddingHorizontal: 5,
    marginBottom: 20,
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    padding: 15,
    fontSize: 16,
    color: 'black',
    textAlignVertical: 'top',
    marginBottom: 5,
    elevation: 3,
  },
  filterContainer: {
    flexDirection: 'row', 
    marginVertical: 10,
  },
  filterBox: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10, 
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 1, 
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    textAlign: 'left', 
  },
  postButton: {
    backgroundColor: '#0f3c73',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  postButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});


export default Upload;
