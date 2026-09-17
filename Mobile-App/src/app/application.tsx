import { router } from 'expo-router';
import axios from 'axios';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type FormData = {
  fullName: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  guardianName: string;
  phone: string;
  aadhaar: string;
  email: string;
  address: string;
  place: string;
  postalName: string;
  pincode: string;
  district: string;
  institutionName: string;
  institutionDistrict: string;
  course: string;
  studentId: string;
};

type InputFieldProps = {
  label: string;
  field: keyof FormData;
  value: string;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  onChangeText: (field: keyof FormData, value: string) => void;
};

function InputField({
  label,
  field,
  value,
  placeholder,
  keyboardType = 'default',
  onChangeText,
}: InputFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => onChangeText(field, text)}
        placeholder={placeholder}
        placeholderTextColor="#98A2B3"
        keyboardType={keyboardType}
        autoCapitalize="words"
      />
    </View>
  );
}

export default function ApplicationScreen() {
  const [form, setForm] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    guardianName: '',
    phone: '',
    aadhaar: '',
    email: '',
    address: '',
    place: '',
    postalName: '',
    pincode: '',
    district: '',
    institutionName: '',
    institutionDistrict: '',
    course: '',
    studentId: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim()) {
      Alert.alert('Missing Field', 'Please enter your full name.');
      return;
    }

    if (!form.dateOfBirth.trim()) {
      Alert.alert('Missing Field', 'Please enter your date of birth.');
      return;
    }

    if (!form.age.trim()) {
      Alert.alert('Missing Field', 'Please enter your age.');
      return;
    }

    const age = Number(form.age);

    if (!Number.isInteger(age) || age < 5 || age > 100) {
      Alert.alert(
        'Invalid Age',
        'Please enter a valid age between 5 and 100.'
      );
      return;
    }

    if (!form.gender.trim()) {
      Alert.alert('Missing Field', 'Please enter your gender.');
      return;
    }

    if (!form.guardianName.trim()) {
      Alert.alert('Missing Field', 'Please enter the guardian name.');
      return;
    }

    if (!form.phone.trim()) {
      Alert.alert('Missing Field', 'Please enter your phone number.');
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      Alert.alert(
        'Invalid Phone',
        'Phone number must contain exactly 10 digits.'
      );
      return;
    }

    if (!form.aadhaar.trim()) {
      Alert.alert('Missing Field', 'Please enter the Aadhaar number.');
      return;
    }

    if (!/^\d{12}$/.test(form.aadhaar.trim())) {
      Alert.alert(
        'Invalid Aadhaar',
        'Aadhaar number must contain exactly 12 digits.'
      );
      return;
    }

    if (!form.email.trim()) {
      Alert.alert('Missing Field', 'Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!form.address.trim()) {
      Alert.alert('Missing Field', 'Please enter your address.');
      return;
    }

    if (!form.place.trim()) {
      Alert.alert('Missing Field', 'Please enter your place.');
      return;
    }

    if (!form.postalName.trim()) {
      Alert.alert('Missing Field', 'Please enter your postal name.');
      return;
    }

    if (!form.pincode.trim()) {
      Alert.alert('Missing Field', 'Please enter your pincode.');
      return;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      Alert.alert(
        'Invalid Pincode',
        'Pincode must contain exactly 6 digits.'
      );
      return;
    }

    if (!form.district.trim()) {
      Alert.alert('Missing Field', 'Please enter your district.');
      return;
    }

    if (!form.institutionName.trim()) {
      Alert.alert(
        'Missing Field',
        'Please enter your institution name.'
      );
      return;
    }

    if (!form.institutionDistrict.trim()) {
      Alert.alert(
        'Missing Field',
        'Please enter your institution district.'
      );
      return;
    }

    if (!form.course.trim()) {
      Alert.alert('Missing Field', 'Please enter your course.');
      return;
    }

    if (!form.studentId.trim()) {
      Alert.alert(
        'Missing Field',
        'Please enter your roll number / student ID.'
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
         'http://localhost:5000/api/applications',
        {
          ...form,
          age,
        },
        {
          timeout: 10000,
        }
      );

      if (response.data.success) {
        router.push('/success');
      } else {
        Alert.alert(
          'Submission Failed',
          response.data.message || 'Application could not be submitted.'
        );
      }
    } catch (error) {
      console.error('Submission error:', error);

      Alert.alert(
        'Connection Error',
        'Could not connect to the server. Make sure the backend is running and your phone is connected to the same Wi-Fi network as this computer.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Bus Concession Application</Text>

        <Text style={styles.subtitle}>
          Enter your details carefully before submitting.
        </Text>

        <Text style={styles.sectionTitle}>Personal Information</Text>

        <InputField
          label="Full Name"
          field="fullName"
          value={form.fullName}
          placeholder="Enter your full name"
          onChangeText={updateField}
        />

        <InputField
          label="Date of Birth"
          field="dateOfBirth"
          value={form.dateOfBirth}
          placeholder="DD/MM/YYYY"
          onChangeText={updateField}
        />

        <InputField
          label="Age"
          field="age"
          value={form.age}
          placeholder="Enter your age"
          keyboardType="numeric"
          onChangeText={updateField}
        />

        <InputField
          label="Gender"
          field="gender"
          value={form.gender}
          placeholder="Male / Female / Other"
          onChangeText={updateField}
        />

        <InputField
          label="Aadhaar Number"
          field="aadhaar"
          value={form.aadhaar}
          placeholder="12-digit Aadhaar number"
          keyboardType="numeric"
          onChangeText={updateField}
        />

        <Text style={styles.sectionTitle}>Guardian Information</Text>

        <InputField
          label="Guardian Name"
          field="guardianName"
          value={form.guardianName}
          placeholder="Enter guardian name"
          onChangeText={updateField}
        />

        <InputField
          label="Phone Number"
          field="phone"
          value={form.phone}
          placeholder="10-digit phone number"
          keyboardType="phone-pad"
          onChangeText={updateField}
        />

        <InputField
          label="Email"
          field="email"
          value={form.email}
          placeholder="Enter email address"
          keyboardType="email-address"
          onChangeText={updateField}
        />

        <Text style={styles.sectionTitle}>Address</Text>

        <InputField
          label="Address"
          field="address"
          value={form.address}
          placeholder="House name / street / address"
          onChangeText={updateField}
        />

        <InputField
          label="Place"
          field="place"
          value={form.place}
          placeholder="Enter your place"
          onChangeText={updateField}
        />

        <InputField
          label="Postal Name"
          field="postalName"
          value={form.postalName}
          placeholder="Enter post office"
          onChangeText={updateField}
        />

        <InputField
          label="Pincode"
          field="pincode"
          value={form.pincode}
          placeholder="6-digit pincode"
          keyboardType="numeric"
          onChangeText={updateField}
        />

        <InputField
          label="District"
          field="district"
          value={form.district}
          placeholder="Enter district"
          onChangeText={updateField}
        />

        <Text style={styles.sectionTitle}>Institution Details</Text>

        <InputField
          label="Institution Name"
          field="institutionName"
          value={form.institutionName}
          placeholder="Enter institution name"
          onChangeText={updateField}
        />

        <InputField
          label="Institution District"
          field="institutionDistrict"
          value={form.institutionDistrict}
          placeholder="Enter institution district"
          onChangeText={updateField}
        />

        <InputField
          label="Course"
          field="course"
          value={form.course}
          placeholder="Enter your course"
          onChangeText={updateField}
        />

        <InputField
          label="Roll Number / Student ID"
          field="studentId"
          value={form.studentId}
          placeholder="Enter roll number / student ID"
          onChangeText={updateField}
        />

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.buttonPressed,
            submitting && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          Please verify all information before submitting.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#172B4D',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#667085',
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#208AEF',
    marginTop: 20,
    marginBottom: 15,
  },

  fieldContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 7,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#101828',
  },

  submitButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  footer: {
    textAlign: 'center',
    color: '#667085',
    fontSize: 13,
    marginTop: 18,
  },
});