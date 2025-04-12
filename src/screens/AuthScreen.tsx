import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState<'maru' | 'marty'>('maru');
  const [familyId, setFamilyId] = useState('');
  const { login, register, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in the auth provider
    }
  };

  const handleRegister = async () => {
    try {
      await register(email, password, name, familyId || undefined);
    } catch (error) {
      // Error is handled in the auth provider
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>Finanční Správa</Text>
            <Text style={styles.subtitle}>
              Přihlaste se nebo si vytvořte účet pro správu vašich financí.
            </Text>

            {/* Tab Buttons */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'login' && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab('login')}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'login' && styles.activeTabButtonText,
                  ]}
                >
                  Přihlášení
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'register' && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab('register')}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'register' && styles.activeTabButtonText,
                  ]}
                >
                  Registrace
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'login' ? (
              /* Login Form */
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Zadejte váš email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Heslo</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Zadejte vaše heslo"
                    secureTextEntry
                  />
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Přihlásit se</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              /* Register Form */
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Zadejte váš email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Heslo</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Zadejte vaše heslo"
                    secureTextEntry
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Osoba</Text>
                  <View style={styles.personContainer}>
                    <TouchableOpacity
                      style={[
                        styles.personButton,
                        name === 'maru' && styles.activePersonButton,
                      ]}
                      onPress={() => setName('maru')}
                    >
                      <Text
                        style={[
                          styles.personButtonText,
                          name === 'maru' && styles.activePersonButtonText,
                        ]}
                      >
                        Maruška
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.personButton,
                        name === 'marty' && styles.activePersonButton,
                      ]}
                      onPress={() => setName('marty')}
                    >
                      <Text
                        style={[
                          styles.personButtonText,
                          name === 'marty' && styles.activePersonButtonText,
                        ]}
                      >
                        Marty
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>ID rodiny (Volitelné)</Text>
                  <TextInput
                    style={styles.input}
                    value={familyId}
                    onChangeText={setFamilyId}
                    placeholder="Nechte prázdné pro vytvoření nové rodiny"
                  />
                  <Text style={styles.helperText}>
                    Zadejte existující ID rodiny pro připojení, nebo nechte prázdné pro vytvoření nové rodiny.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Registrovat se</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* App Features */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Hlavní funkce aplikace:</Text>
              <View style={styles.featureItem}>
                <Text style={styles.featureText}>
                  ✓ Sledujte příjmy a výdaje v reálném čase
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureText}>
                  ✓ Správa osobních a společných financí
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureText}>
                  ✓ Časovač pro sledování odpracovaných hodin
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureText}>
                  ✓ Přehledné statistiky a grafy
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureText}>
                  ✓ Správa dluhů s prioritizací
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6', // blue-500
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280', // gray-500
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#e5e7eb', // gray-200
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#3b82f6', // blue-500
  },
  tabButtonText: {
    fontWeight: '500',
    color: '#4b5563', // gray-600
  },
  activeTabButtonText: {
    color: '#fff',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#374151', // gray-700
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  personContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  personButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#e5e7eb', // gray-200
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activePersonButton: {
    backgroundColor: '#3b82f6', // blue-500
  },
  personButtonText: {
    fontWeight: '500',
    color: '#4b5563', // gray-600
  },
  activePersonButtonText: {
    color: '#fff',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280', // gray-500
    marginTop: 4,
  },
  button: {
    backgroundColor: '#3b82f6', // blue-500
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  featuresContainer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // gray-200
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#374151', // gray-700
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#4b5563', // gray-600
  },
});

export default AuthScreen;