import axios, { isAxiosError } from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL =
  Platform.OS === "web" ? "http://localhost:5000" : "http://192.168.220.34:5000";

type FormDataType = {
  fullName: string;
  dateOfBirth: string;
  age: string;
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
  travelFrom: string;
  travelTo: string;
};

type SelectedFile = {
  uri: string;
  name?: string;
  fileName?: string;
  mimeType?: string;
  type?: string;
  size?: number;
};

type BackendErrorResponse = {
  success?: boolean;
  message?: string;
  missingDocuments?: string[];
};

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: React.ComponentProps<typeof TextInput>["keyboardType"];
  multiline?: boolean;
  editable?: boolean;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const formatDateOfBirth = (text: string) => {
  const numbers = text.replace(/\D/g, "").slice(0, 8);

  if (numbers.length > 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
  }

  if (numbers.length > 2) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }

  return numbers;
};

const getAadhaarDigits = (text: string) => text.replace(/\D/g, "").slice(0, 12);

const formatAadhaarNumber = (text: string) =>
  getAadhaarDigits(text)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
  editable = true,
}: InputFieldProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        editable={editable}
        autoCapitalize="none"
      />
    </View>
  );
}

export default function ApplicationScreen() {
  const [form, setForm] = useState<FormDataType>({
    fullName: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    guardianName: "",
    phone: "",
    aadhaarNumber: "",
    email: "",
    address: "",
    place: "",
    postalName: "",
    pincode: "",
    district: "",
    institutionName: "",
    institutionDistrict: "",
    course: "",
    studentId: "",
    travelFrom: "",
    travelTo: "",
  });

  const [studentPhoto, setStudentPhoto] = useState<SelectedFile | null>(null);
  const [studentIdCard, setStudentIdCard] = useState<SelectedFile | null>(null);
  const [aadhaarCard, setAadhaarCard] = useState<SelectedFile | null>(null);
  const [previousConcessionCard, setPreviousConcessionCard] =
    useState<SelectedFile | null>(null);
  const [institutionApprovalForm, setInstitutionApprovalForm] =
    useState<SelectedFile | null>(null);
  const [rationCard, setRationCard] = useState<SelectedFile | null>(null);
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof FormDataType, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleDateOfBirthChange = (text: string) => {
    const numbers = text.replace(/\D/g, "").slice(0, 8);
    updateField("dateOfBirth", formatDateOfBirth(text));

    if (numbers.length !== 8) {
      updateField("age", "");
      return;
    }

    const day = Number(numbers.slice(0, 2));
    const month = Number(numbers.slice(2, 4));
    const year = Number(numbers.slice(4, 8));
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);

    const isValidDate =
      birthDate.getFullYear() === year &&
      birthDate.getMonth() === month - 1 &&
      birthDate.getDate() === day;

    if (!isValidDate || year < 1900 || birthDate > today) {
      updateField("age", "");
      return;
    }

    let age = today.getFullYear() - year;
    const birthdayThisYear = new Date(today.getFullYear(), month - 1, day);

    if (birthdayThisYear > today) {
      age -= 1;
    }

    updateField("age", String(age));
  };

  const pickStudentPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];

        if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
          Alert.alert("File too large", "The student photo must be 5 MB or smaller.");
          return;
        }

        setStudentPhoto({
          uri: asset.uri,
          name: asset.fileName || "student-photo.jpg",
          fileName: asset.fileName || "student-photo.jpg",
          mimeType: asset.mimeType || "image/jpeg",
          type: asset.mimeType || "image/jpeg",
          size: asset.fileSize,
        });
      }
    } catch (error) {
      console.error("Photo picker error:", error);
      Alert.alert("Photo error", "Could not open the photo picker.");
    }
  };

  const pickDocument = async (
    setter: React.Dispatch<React.SetStateAction<SelectedFile | null>>,
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];

        if (asset.size && asset.size > MAX_FILE_SIZE) {
          Alert.alert("File too large", "Each document must be 5 MB or smaller.");
          return;
        }

        setter({
          uri: asset.uri,
          name: asset.name,
          fileName: asset.name,
          mimeType: asset.mimeType,
          type: asset.mimeType,
          size: asset.size,
        });
      }
    } catch (error) {
      console.error("Document picker error:", error);
      Alert.alert("Document error", "Could not open the document picker.");
    }
  };

  const appendFile = async (
    data: FormData,
    fieldName: string,
    file: SelectedFile,
    fallbackName: string,
    fallbackType: string,
  ) => {
    const name = file.fileName || file.name || fallbackName;
    const type = file.mimeType || file.type || fallbackType;

    if (Platform.OS === "web") {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      data.append(fieldName, blob, name);
      return;
    }

    data.append(
      fieldName,
      {
        uri: file.uri,
        name,
        type,
      } as unknown as Blob,
    );
  };

  const validateForm = () => {
    const requiredFields: Array<[keyof FormDataType, string]> = [
      ["fullName", "Full name"],
      ["dateOfBirth", "Date of birth"],
      ["age", "Age"],
      ["gender", "Gender"],
      ["guardianName", "Guardian name"],
      ["phone", "Phone number"],
      ["aadhaarNumber", "Aadhaar number"],
      ["email", "Email"],
      ["address", "Address"],
      ["place", "Place"],
      ["postalName", "Postal name"],
      ["pincode", "Pincode"],
      ["district", "District"],
      ["institutionName", "Institution name"],
      ["institutionDistrict", "Institution district"],
      ["course", "Course"],
      ["studentId", "Roll number / Student ID"],
      ["travelFrom", "Travel from"],
      ["travelTo", "Travel to"],
    ];

    for (const [field, label] of requiredFields) {
      if (!form[field].trim()) {
        Alert.alert("Missing information", `Please enter ${label}.`);
        return false;
      }
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.dateOfBirth)) {
      Alert.alert("Invalid date", "Please enter the date of birth in DD/MM/YYYY format.");
      return false;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      Alert.alert("Invalid phone number", "Please enter a valid 10-digit phone number.");
      return false;
    }

    if (!/^\d{12}$/.test(getAadhaarDigits(form.aadhaarNumber))) {
      Alert.alert("Invalid Aadhaar number", "Please enter a valid 12-digit Aadhaar number.");
      return false;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      Alert.alert("Invalid pincode", "Please enter a valid 6-digit pincode.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return false;
    }

    if (!studentPhoto || !studentIdCard || !aadhaarCard || !institutionApprovalForm || !rationCard) {
      Alert.alert("Missing document", "Please upload all required documents.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (loading || !validateForm()) {
      return;
    }

    const data = new FormData();

    Object.entries({
      ...form,
      aadhaarNumber: getAadhaarDigits(form.aadhaarNumber),
    }).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      setLoading(true);

      await appendFile(data, "studentPhoto", studentPhoto!, "student-photo.jpg", "image/jpeg");
      await appendFile(data, "studentIdCard", studentIdCard!, "student-id-card.pdf", "application/pdf");
      await appendFile(data, "aadhaarCard", aadhaarCard!, "aadhaar-card.pdf", "application/pdf");

      if (previousConcessionCard) {
        await appendFile(
          data,
          "previousConcessionCard",
          previousConcessionCard,
          "previous-concession-card.pdf",
          "application/pdf",
        );
      }

      await appendFile(
        data,
        "institutionApprovalForm",
        institutionApprovalForm!,
        "institution-approval-form-1.pdf",
        "application/pdf",
      );
      await appendFile(data, "rationCard", rationCard!, "ration-card.pdf", "application/pdf");

      const response = await axios.post(`${API_URL}/api/applications`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      if (response.data?.success) {
        const appId = response.data.application?._id;
        router.replace(appId ? (`/success?id=${appId}` as any) : "/success");
        return;
      }

      Alert.alert(
        "Submission failed",
        response.data?.message || "The application could not be submitted.",
      );
    } catch (error: unknown) {
      console.error("Application submission error:", error);

      if (isAxiosError<BackendErrorResponse>(error)) {
        Alert.alert(
          "Submission failed",
          error.response?.data?.message || error.message || "Failed to submit application.",
        );
        return;
      }

      Alert.alert("Submission failed", "Could not submit the application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Bus Concession Application</Text>
      <Text style={styles.subtitle}>Enter your details and upload the required documents.</Text>

      <Text style={styles.sectionTitle}>Personal Details</Text>
      <InputField
        label="Full Name"
        value={form.fullName}
        onChangeText={(text) => updateField("fullName", text)}
        placeholder="Enter full name"
      />
      <InputField
        label="Date of Birth"
        value={form.dateOfBirth}
        onChangeText={handleDateOfBirthChange}
        placeholder="DD/MM/YYYY"
        keyboardType="numbers-and-punctuation"
      />
      <InputField
        label="Age"
        value={form.age}
        onChangeText={(text) => updateField("age", text.replace(/\D/g, ""))}
        placeholder="Age"
        keyboardType="numeric"
      />
      <InputField
        label="Gender"
        value={form.gender}
        onChangeText={(text) => updateField("gender", text)}
        placeholder="Male / Female / Other"
      />
      <InputField
        label="Guardian Name"
        value={form.guardianName}
        onChangeText={(text) => updateField("guardianName", text)}
        placeholder="Enter guardian name"
      />
      <InputField
        label="Phone Number"
        value={form.phone}
        onChangeText={(text) => updateField("phone", text.replace(/\D/g, "").slice(0, 10))}
        placeholder="10-digit phone number"
        keyboardType="phone-pad"
      />
      <InputField
        label="Aadhaar Number"
        value={form.aadhaarNumber}
        onChangeText={(text) =>
          updateField("aadhaarNumber", formatAadhaarNumber(text))
        }
        placeholder="0000 0000 0000"
        keyboardType="numeric"
      />
      <InputField
        label="Email"
        value={form.email}
        onChangeText={(text) => updateField("email", text)}
        placeholder="example@email.com"
        keyboardType="email-address"
      />

      <Text style={styles.sectionTitle}>Address Details</Text>
      <InputField
        label="Address"
        value={form.address}
        onChangeText={(text) => updateField("address", text)}
        placeholder="Enter address"
        multiline
      />
      <InputField
        label="Place"
        value={form.place}
        onChangeText={(text) => updateField("place", text)}
        placeholder="Enter place"
      />
      <InputField
        label="Postal Name"
        value={form.postalName}
        onChangeText={(text) => updateField("postalName", text)}
        placeholder="Enter postal name"
      />
      <InputField
        label="Pincode"
        value={form.pincode}
        onChangeText={(text) => updateField("pincode", text.replace(/\D/g, "").slice(0, 6))}
        placeholder="6-digit pincode"
        keyboardType="numeric"
      />
      <InputField
        label="District"
        value={form.district}
        onChangeText={(text) => updateField("district", text)}
        placeholder="Enter district"
      />

      <Text style={styles.sectionTitle}>Institution Details</Text>
      <InputField
        label="Institution Name"
        value={form.institutionName}
        onChangeText={(text) => updateField("institutionName", text)}
        placeholder="Enter institution name"
      />
      <InputField
        label="Institution District"
        value={form.institutionDistrict}
        onChangeText={(text) => updateField("institutionDistrict", text)}
        placeholder="Enter institution district"
      />
      <InputField
        label="Course"
        value={form.course}
        onChangeText={(text) => updateField("course", text)}
        placeholder="Enter course"
      />
      <InputField
        label="Roll No / Student ID"
        value={form.studentId}
        onChangeText={(text) => updateField("studentId", text)}
        placeholder="Enter roll number / ID"
      />

      <Text style={styles.sectionTitle}>Travel Details</Text>
      <InputField
        label="Travel From"
        value={form.travelFrom}
        onChangeText={(text) => updateField("travelFrom", text)}
        placeholder="Enter starting place"
      />
      <InputField
        label="Travel To"
        value={form.travelTo}
        onChangeText={(text) => updateField("travelTo", text)}
        placeholder="Enter destination"
      />

      <Text style={styles.sectionTitle}>Required Documents</Text>
      <Text style={styles.requiredNotice}>JPG, PNG or PDF. Maximum 5 MB per file.</Text>
      <DocumentButton title="Student Photo *" file={studentPhoto} onPress={pickStudentPhoto} />
      <DocumentButton
        title="Student ID Card *"
        file={studentIdCard}
        onPress={() => pickDocument(setStudentIdCard)}
      />
      <DocumentButton
        title="Aadhaar Card *"
        file={aadhaarCard}
        onPress={() => pickDocument(setAadhaarCard)}
      />
      <DocumentButton
        title="Previous Concession Card (Optional)"
        file={previousConcessionCard}
        onPress={() => pickDocument(setPreviousConcessionCard)}
      />
      <DocumentButton
        title="Educational Institution Approval Form (Form 1) *"
        file={institutionApprovalForm}
        onPress={() => pickDocument(setInstitutionApprovalForm)}
      />
      <DocumentButton
        title="Ration Card *"
        file={rationCard}
        onPress={() => pickDocument(setRationCard)}
      />

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>{loading ? "Submitting..." : "Submit Application"}</Text>
      </TouchableOpacity>

      <Text style={styles.note}>Please verify all information before submitting your application.</Text>
    </ScrollView>
  );
}

function DocumentButton({
  title,
  file,
  onPress,
}: {
  title: string;
  file: SelectedFile | null;
  onPress: () => void;
}) {
  return (
    <View style={styles.documentContainer}>
      <Text style={styles.documentTitle}>{title}</Text>
      <TouchableOpacity style={styles.documentButton} onPress={onPress}>
        <Text style={styles.documentButtonText}>
          {file ? `Selected: ${file.name || file.fileName || "File"}` : "Choose File"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#172B4D",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#667085",
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#208AEF",
    marginTop: 20,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 16,
    color: "#101828",
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 14,
  },
  requiredNotice: {
    fontSize: 13,
    color: "#667085",
    marginBottom: 16,
  },
  documentContainer: {
    marginBottom: 18,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 7,
  },
  documentButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#208AEF",
    borderRadius: 10,
    padding: 14,
  },
  documentButtonText: {
    fontSize: 14,
    color: "#208AEF",
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 25,
    backgroundColor: "#208AEF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  note: {
    textAlign: "center",
    color: "#667085",
    fontSize: 13,
    marginTop: 18,
  },
});
