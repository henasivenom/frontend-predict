import React, { useState } from 'react';
    import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
    import { Picker } from '@react-native-picker/picker';

    export default function App() {
    const [age, setAge] = useState('');
    const [bmi, setBmi] = useState('');
    const [children, setChildren] = useState('');
    const [gender, setGender] = useState('male');
    const [smoker, setSmoker] = useState('no');
    const [region, setRegion] = useState('northeast');
    const [prediction, setPrediction] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    

    
    const handleSubmit = async () => {
        try {
          const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              age: parseInt(age),
              sex: gender,
              bmi: parseFloat(bmi),
              children: parseInt(children),
              smoker: smoker,
              region: region,
            }),
          });
      
          const text = await response.text();
          console.log("Raw response:", text);
      
          let data;
          try {
            data = JSON.parse(text);
            console.log(data);
          } catch (err) {
            console.error("Parse error:", err);
            setPrediction("Server error or invalid response.");
            setModalVisible(true);
            return;
          }
      
          if (data.prediction) {
            setPrediction(`₹ ${data.prediction}`);
          } else if (data.detail) {
            setPrediction("Error: " + data.detail); // From FastAPI exception
          } else {
            setPrediction("Unexpected response from server.");
          }
      
          setModalVisible(true);
        } catch (error) {
          console.error("Fetch error:", error);
          setPrediction("Network error. Is the server running?");
          setModalVisible(true);
        }
      };
      

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Medical Insurance Predictor</Text>

      <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} />
      <TextInput style={styles.input} placeholder="BMI" keyboardType="numeric" value={bmi} onChangeText={setBmi} />
      <TextInput style={styles.input} placeholder="Number of Children" keyboardType="numeric" value={children} onChangeText={setChildren} />

      <Text style={styles.label}>Gender</Text>
      <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>

      <Text style={styles.label}>Smoker</Text>
      <Picker selectedValue={smoker} onValueChange={setSmoker} style={styles.picker}>
        <Picker.Item label="No" value="no" />
        <Picker.Item label="Yes" value="yes" />
      </Picker>

      <Text style={styles.label}>Region</Text>
      <Picker selectedValue={region} onValueChange={setRegion} style={styles.picker}>
        <Picker.Item label="Northeast" value="northeast" />
        <Picker.Item label="Northwest" value="northwest" />
        <Picker.Item label="Southeast" value="southeast" />
        <Picker.Item label="Southwest" value="southwest" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Predict Insurance Cost</Text>
      </TouchableOpacity>

      {/* Result Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.resultText}>Predicted Cost: ₹ {prediction}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 24,
      backgroundColor: '#f5f6fa',
      justifyContent: 'center',
    },
    heading: {
      fontSize: 26,
      fontWeight: '700',
      marginBottom: 20,
      textAlign: 'center',
      color: '#2f3640',
    },
    input: {
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 10,
      marginBottom: 12,
      fontSize: 16,
      elevation: 2,
    },
    label: {
      marginTop: 10,
      fontWeight: '600',
      fontSize: 16,
      color: '#2f3640',
    },
    picker: {
      backgroundColor: '#fff',
      borderRadius: 10,
      marginBottom: 12,
      elevation: 2,
    },
    button: {
      backgroundColor: '#0984e3',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: '#fff',
      fontSize: 17,
      fontWeight: '600',
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: 20,
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      elevation: 10,
      alignItems: 'center',
    },
    resultText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#00b894',
      marginBottom: 15,
    },
    closeButton: {
      marginTop: 10,
      backgroundColor: '#d63031',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
  });
