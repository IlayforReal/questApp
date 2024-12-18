import React, { useState } from "react"; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native'; 
import AntDesign from '@expo/vector-icons/AntDesign'; 
import { useRouter } from "expo-router"; 

const Account = () => {
    const [accountType, setAccountType] = useState(''); // State for selected account type
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
    const router = useRouter();

    // Account types list
    const accountOptions = ['GCash', 'Landbank', 'BPI'];

    // Function to handle account type selection
    const handleSelectAccountType = (type) => {
        setAccountType(type);
        setModalVisible(false); // Close the modal after selection
    };

    return (
        <View style={styles.container}>
            {/* Account Type Section */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Account Type</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.inputWithIcon}
                        placeholder="Select Account Type"
                        placeholderTextColor="#888"
                        value={accountType} // Display selected account type
                        editable={false} // Prevent manual input
                    />
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <AntDesign name="caretdown" size={20} color="black" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modal to select account type */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={accountOptions}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => handleSelectAccountType(item)}
                                >
                                    <Text style={styles.optionText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Account Number Section */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Account Number</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.inputWithIcon}
                        placeholder="Enter Account Number or ID"
                        placeholderTextColor="#888"
                    />
                </View>
            </View>

            {/* Next Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('verification')}
            >
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
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
    inputContainer: {
        width: '90%',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        height: 40,
        paddingHorizontal: 10,
    },
    inputWithIcon: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    icon: {
        marginLeft: 10,
    },
    button: {
        width: '90%',
        height: 35,
        backgroundColor: '#0f3c73',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay effect
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    option: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
});

export default Account;
