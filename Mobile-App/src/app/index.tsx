import { router } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🚌</Text>
        </View>

        <Text style={styles.title}>Digital Bus Concession</Text>

        <Text style={styles.subtitle}>
          Apply for your student bus concession online quickly and easily.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push('/application')}
        >
          <Text style={styles.buttonText}>Apply for Bus Concession</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Text style={styles.footer}>
          Student concession application portal
        </Text>
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

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E5F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },

  icon: {
    fontSize: 58,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#172B4D',
    textAlign: 'center',
    marginBottom: 14,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#667085',
    textAlign: 'center',
    maxWidth: 340,
    marginBottom: 38,
  },

  button: {
    width: '100%',
    maxWidth: 360,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#208AEF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 24,
    marginLeft: 12,
  },

  footer: {
    marginTop: 28,
    fontSize: 13,
    color: '#98A2B3',
  },
});
