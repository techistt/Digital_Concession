import { router } from 'expo-router';
import axios from 'axios';
import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

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

type SelectedFile = {
  uri: string;
  name?: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
};

type FormState = {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  guardianName: string;
  phone: string;
  aadhaarNumber: string;
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

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
}) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#98A2B3"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
};

export default function ApplicationScreen() {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    guardianName: '',
    phone: '',
    aadhaarNumber: '',
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

  const [studentPhoto, setStudentPhoto] =
    useState<SelectedFile | null>(null);

  const [studentIdCard, setStudentIdCard] =
    useState<SelectedFile | null>(null);

  const [aadhaarCard, setAadhaarCard] =
    useState<SelectedFile | null>(null);

  const [previousConcessionCard, setPreviousConcessionCard] =
    useState<SelectedFile | null>(null);

  const [institutionApprovalForm, setInstitutionApprovalForm] =
    useState<SelectedFile | null>(null);

  const [rationCard, setRationCard] =
    useState<SelectedFile | null>(null);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const calculateAge = () => {
    if (!form.dateOfBirth) {
      return '';
    }

    const parts = form.dateOfBirth.split('/');

    if (parts.length !== 3) {
      return '';
    }

    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const year = Number(parts[2]);

    if (!day || !month || !year) {
      return '';
    }

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? String(age) : '';
  };

  const age = calculateAge();

  const pickStudentPhoto = async () => {
    try {
      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (
        !result.canceled &&
        result.assets?.length > 0
      ) {
        const file = result.assets[0];

        if (
          file.fileSize &&
          file.fileSize > 5 * 1024 * 1024
        ) {
          Alert.alert(
            'File Too Large',
            'The student photo must be 5 MB or smaller.'
          );
          return;
        }

        setStudentPhoto({
          uri: file.uri,
          fileName: file.fileName ?? undefined,
          mimeType: file.mimeType ?? undefined,
          size: file.fileSize,
        });
      }
    } catch (error) {
      console.error('Photo picker error:', error);

      Alert.alert(
        'Photo Error',
        'Could not open the photo picker.'
      );
    }
  };

  const pickDocument = async (
    setter: React.Dispatch<
      React.SetStateAction<SelectedFile | null>
    >
  ) => {
    try {
      const result =
        await DocumentPicker.getDocumentAsync({
          type: [
            'image/jpeg',
            'image/png',
            'application/pdf',
          ],
          copyToCacheDirectory: true,
        });

      if (
        !result.canceled &&
        result.assets?.length > 0
      ) {
        const file = result.assets[0];

        if (
          file.size &&
          file.size > 5 * 1024 * 1024
        ) {
          Alert.alert(
            'File Too Large',
            'Each document must be 5 MB or smaller.'
          );
          return;
        }

        setter({
          uri: file.uri,
          name: file.name ?? undefined,
          mimeType: file.mimeType ?? undefined,
          size: file.size,
        });
      }
    } catch (error) {
      console.error('Document picker error:', error);

      Alert.alert(
        'Document Error',
        'Could not open the document picker.'
      );
    }
  };

  const validateForm = () => {
    const requiredFields: Array<
      [keyof FormState, string]
    > = [
        ['fullName', 'Full name'],
        ['dateOfBirth', 'Date of birth'],
        ['gender', 'Gender'],
        ['guardianName', 'Guardian name'],
        ['phone', 'Phone number'],
        ['aadhaarNumber', 'Aadhaar number'],
        ['email', 'Email'],
        ['address', 'Address'],
        ['place', 'Place'],
        ['postalName', 'Postal name'],
        ['pincode', 'Pincode'],
        ['district', 'District'],
        ['institutionName', 'Institution name'],
        ['institutionDistrict', 'Institution district'],
        ['course', 'Course'],
        ['studentId', 'Roll number / Student ID'],
      ];

    for (const [field, label] of requiredFields) {
      if (!form[field].trim()) {
        Alert.alert(
          'Missing Information',
          `Please enter ${label}.`
        );
        return false;
      }
    }

    if (!/^\d{10}$/.test(form.phone)) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit phone number.'
      );
      return false;
    }

    if (!/^\d{12}$/.test(form.aadhaarNumber)) {
      Alert.alert(
        'Invalid Aadhaar Number',
        'Please enter a valid 12-digit Aadhaar number.'
      );
      return false;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      Alert.alert(
        'Invalid Pincode',
        'Please enter a valid 6-digit pincode.'
      );
      return false;
    }

    if (!form.email.includes('@')) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );
      return false;
    }

    if (!studentPhoto) {
      Alert.alert(
        'Missing Document',
        'Student photo is required.'
      );
      return false;
    }

    if (!studentIdCard) {
      Alert.alert(
        'Missing Document',
        'Student ID card is required.'
      );
      return false;
    }

    if (!aadhaarCard) {
      Alert.alert(
        'Missing Document',
        'Aadhaar card is required.'
      );
      return false;
    }

    if (!institutionApprovalForm) {
      Alert.alert(
        'Missing Document',
        'Educational Institution Approval Form (Form 1) is required.'
      );
      return false;
    }

    if (!rationCard) {
      Alert.alert(
        'Missing Document',
        'Ration card is required.'
      );
      return false;
    }

    return true;
  };

  const submitApplication = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      Object.entries({
        ...form,
        age,
      }).forEach(([key, value]) => {
        data.append(key, String(value));
      });

      data.append(
        'studentPhoto',
        {
          uri: studentPhoto!.uri,
          name:
            studentPhoto!.fileName ||
            'student-photo.jpg',
          type:
            studentPhoto!.mimeType ||
            'image/jpeg',
        } as any
      );

      data.append(
        'studentIdCard',
        {
          uri: studentIdCard!.uri,
          name:
            studentIdCard!.name ||
            'student-id-card',
          type:
            studentIdCard!.mimeType ||
            'application/pdf',
        } as any
      );

      data.append(
        'aadhaarCard',
        {
          uri: aadhaarCard!.uri,
          name:
            aadhaarCard!.name ||
            'aadhaar-card',
          type:
            aadhaarCard!.mimeType ||
            'application/pdf',
        } as any
      );

      if (previousConcessionCard) {
        data.append(
          'previousConcessionCard',
          {
            uri: previousConcessionCard.uri,
            name:
              previousConcessionCard.name ||
              'previous-concession-card',
            type:
              previousConcessionCard.mimeType ||
              'application/pdf',
          } as any
        );
      }

      data.append(
        'institutionApprovalForm',
        {
          uri: institutionApprovalForm!.uri,
          name:
            institutionApprovalForm!.name ||
            'institution-approval-form-1',
          type:
            institutionApprovalForm!.mimeType ||
            'application/pdf',
        } as any
      );

      data.append(
        'rationCard',
        {
          uri: rationCard!.uri,
          name:
            rationCard!.name ||
            'ration-card',
          type:
            rationCard!.mimeType ||
            'application/pdf',
        } as any
      );

      const debuggerHost = Constants.expoConfig?.hostUri;
      const localhost = debuggerHost?.split(':')[0] || 'localhost';
      const apiUrl = `http://${localhost}:5000/api/applications`;

      const response = await axios.post(
        apiUrl,
        data,
        {
          timeout: 30000,
        }
      );

      if (response.data?.success) {
        Alert.alert(
          'Application Submitted',
          'Your bus concession application has been submitted successfully.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error(
        'Application submission error:',
        error
      );

      const message =
        error?.response?.data?.message ||
        'Could not submit the application. Please try again.';

      Alert.alert(
        'Submission Failed',
        message
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fileName = (
    file: SelectedFile | null,
    fallback: string
  ) => {
    if (!file) {
      return fallback;
    }

    return `✓ ${file.fileName ||
      file.name ||
      'Document selected'
      }`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          Bus Concession Application
        </Text>

        <Text style={styles.subtitle}>
          Please enter your details and upload the
          required documents.
        </Text>

        <Text style={styles.sectionTitle}>
          Personal Information
        </Text>

        <InputField
          label="Full Name"
          value={form.fullName}
          onChangeText={(text) =>
            updateField('fullName', text)
          }
          placeholder="Enter your full name"
        />

        <InputField
          label="Date of Birth"
          value={form.dateOfBirth}
          onChangeText={(text) =>
            updateField('dateOfBirth', text)
          }
          placeholder="DD/MM/YYYY"
          keyboardType="numeric"
        />

        <InputField
          label="Age"
          value={age}
          onChangeText={() => { }}
          placeholder="Calculated automatically"
          keyboardType="numeric"
        />

        <InputField
          label="Gender"
          value={form.gender}
          onChangeText={(text) =>
            updateField('gender', text)
          }
          placeholder="Male / Female / Other"
        />

        <InputField
          label="Guardian Name"
          value={form.guardianName}
          onChangeText={(text) =>
            updateField('guardianName', text)
          }
          placeholder="Enter guardian name"
        />

        <InputField
          label="Phone Number"
          value={form.phone}
          onChangeText={(text) =>
            updateField(
              'phone',
              text.replace(/\D/g, '').slice(0, 10)
            )
          }
          placeholder="10-digit phone number"
          keyboardType="phone-pad"
        />

        <InputField
          label="Aadhaar Number"
          value={form.aadhaarNumber}
          onChangeText={(text) =>
            updateField(
              'aadhaarNumber',
              text.replace(/\D/g, '').slice(0, 12)
            )
          }
          placeholder="12-digit Aadhaar number"
          keyboardType="numeric"
        />

        <InputField
          label="Email"
          value={form.email}
          onChangeText={(text) =>
            updateField('email', text)
          }
          placeholder="example@email.com"
          keyboardType="email-address"
        />

        <Text style={styles.sectionTitle}>
          Address Information
        </Text>

        <InputField
          label="Address"
          value={form.address}
          onChangeText={(text) =>
            updateField('address', text)
          }
          placeholder="Enter your address"
          multiline
        />

        <InputField
          label="Place"
          value={form.place}
          onChangeText={(text) =>
            updateField('place', text)
          }
          placeholder="Enter place"
        />

        <InputField
          label="Postal Name"
          value={form.postalName}
          onChangeText={(text) =>
            updateField('postalName', text)
          }
          placeholder="Enter postal name"
        />

        <InputField
          label="Pincode"
          value={form.pincode}
          onChangeText={(text) =>
            updateField(
              'pincode',
              text.replace(/\D/g, '').slice(0, 6)
            )
          }
          placeholder="6-digit pincode"
          keyboardType="numeric"
        />

        <InputField
          label="District"
          value={form.district}
          onChangeText={(text) =>
            updateField('district', text)
          }
          placeholder="Enter district"
        />

        <Text style={styles.sectionTitle}>
          Institution Information
        </Text>

        <InputField
          label="Institution Name"
          value={form.institutionName}
          onChangeText={(text) =>
            updateField(
              'institutionName',
              text
            )
          }
          placeholder="Enter institution name"
        />

        <InputField
          label="Institution District"
          value={form.institutionDistrict}
          onChangeText={(text) =>
            updateField(
              'institutionDistrict',
              text
            )
          }
          placeholder="Enter institution district"
        />

        <InputField
          label="Course"
          value={form.course}
          onChangeText={(text) =>
            updateField('course', text)
          }
          placeholder="Enter course"
        />

        <InputField
          label="Roll No / Student ID"
          value={form.studentId}
          onChangeText={(text) =>
            updateField('studentId', text)
          }
          placeholder="Enter roll number or student ID"
        />

        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>
            Required Documents
          </Text>

          <Text style={styles.requiredNotice}>
            * Required documents must be uploaded before
            submission.
          </Text>

          <Text style={styles.documentLabel}>
            1. Student Photo *
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.uploadButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={pickStudentPhoto}
          >
            <Text style={styles.uploadButtonText}>
              {fileName(
                studentPhoto,
                '📷 Select Student Photo'
              )}
            </Text>
          </Pressable>

          <Text style={styles.documentLabel}>
            2. Student ID Card *
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.uploadButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              pickDocument(setStudentIdCard)
            }
          >
            <Text style={styles.uploadButtonText}>
              {fileName(
                studentIdCard,
                '🪪 Select Student ID Card'
              )}
            </Text>
          </Pressable>

          <Text style={styles.documentLabel}>
            3. Aadhaar Card *
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.uploadButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              pickDocument(setAadhaarCard)
            }
          >
            <Text style={styles.uploadButtonText}>
              {fileName(
                aadhaarCard,
                '🪪 Select Aadhaar Card'
              )}
            </Text>
          </Pressable>

          <Text style={styles.documentLabel}>
            4. Previous Concession Card
            <Text style={styles.optionalText}>
              {' '}
              (Optional)
            </Text>
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.uploadButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              pickDocument(
                setPreviousConcessionCard
              )
            }
          >
            <Text style={styles.uploadButtonText}>
              {fileName(
                previousConcessionCard,
                '🎫 Select Previous Concession Card'
              )}
            </Text>
          </Pressable>

          <Text style={styles.documentLabel}>
            5. Educational Institution Approval Form
            (Form 1) *
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.uploadButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              pickDocument(
                setInstitutionApprovalForm
              )
            }
          >
            <Text style={styles.uploadButtonText}>
              {fileName(
                institutionApprovalForm,
                '📄 Select Form 1'
              )}
            </Text>
          </Pressable>

          <Text style={styles.documentLabel}>
            6. Ration Card *
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.uploadButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              pickDocument(setRationCard)
            }
          >
            <Text style={styles.uploadButtonText}>
              {fileName(
                rationCard,
                '📄 Select Ration Card'
              )}
            </Text>
          </Pressable>

          <Text style={styles.uploadHint}>
            JPG, PNG or PDF • Maximum 5 MB per file
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            submitting && styles.disabledButton,
            pressed &&
            !submitting &&
            styles.buttonPressed,
          ]}
          onPress={submitApplication}
          disabled={submitting}
        >
          <Text style={styles.submitText}>
            {submitting
              ? 'Submitting...'
              : 'Submit Application'}
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          Please verify all information before
          submitting your application.
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

  multilineInput: {
    height: 100,
    paddingTop: 14,
  },

  uploadSection: {
    marginTop: 10,
    marginBottom: 5,
  },

  requiredNotice: {
    fontSize: 13,
    color: '#667085',
    marginBottom: 18,
  },

  documentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 7,
    lineHeight: 20,
  },

  optionalText: {
    color: '#667085',
    fontWeight: '400',
  },

  uploadButton: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#208AEF',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 16,
  },

  uploadButtonText: {
    color: '#208AEF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  uploadHint: {
    color: '#667085',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
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