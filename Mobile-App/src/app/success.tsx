import { router } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SuccessScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>
          Application Submitted!
        </Text>

        <Text style={styles.message}>
          Your bus concession application has been submitted
          successfully.
        </Text>

        <Text style={styles.info}>
          Please keep your application details safe. You can
          check your application status later.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.buttonText}>
            Back to Home
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },

  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DFF7E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },

  check: {
    fontSize: 58,
    color: '#20A05A',
    fontWeight: '700',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#172B4D',
    textAlign: 'center',
    marginBottom: 16,
  },

  message: {
    fontSize: 17,
    lineHeight: 25,
    color: '#475467',
    textAlign: 'center',
    marginBottom: 16,
  },

  info: {
    fontSize: 14,
    lineHeight: 21,
    color: '#667085',
    textAlign: 'center',
    marginBottom: 35,
  },

  button: {
    width: '100%',
    maxWidth: 360,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
