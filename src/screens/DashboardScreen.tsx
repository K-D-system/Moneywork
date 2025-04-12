import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { MainTabParamList } from '../navigation/MainTabNavigator';

type NavigationProp = NativeStackNavigationProp<MainTabParamList>;

const DashboardScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  // Mock data
  const financialData = {
    personalAccount: 15430,
    sharedAccount: 24750,
    totalDebts: 32000,
  };

  const recentActivities = [
    {
      id: '1',
      title: 'Příjem: Výplata',
      time: 'Dnes, 12:30',
      amount: 25000,
      type: 'income',
    },
    {
      id: '2',
      title: 'Výdaj: Nájem',
      time: 'Včera, 18:45',
      amount: -12000,
      type: 'expense',
    },
    {
      id: '3',
      title: 'Práce: Programování',
      time: 'Včera, 10:20',
      amount: 1200,
      details: '2 hodiny',
      type: 'work',
    },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} CZK`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Přehled</Text>

        {/* Financial Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Finanční přehled</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>
              Osobní účet ({user?.name === 'maru' ? 'Maruška' : 'Marty'})
            </Text>
            <Text style={styles.summaryValuePositive}>
              {formatCurrency(financialData.personalAccount)}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Společný účet</Text>
            <Text style={styles.summaryValuePositive}>
              {formatCurrency(financialData.sharedAccount)}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Celkové dluhy</Text>
            <Text style={styles.summaryValueNegative}>
              -{formatCurrency(financialData.totalDebts)}
            </Text>
          </View>
        </View>

        {/* Timer Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stav časovače</Text>
          <View style={styles.timerStatus}>
            <View style={styles.timerStatusIndicator} />
            <Text style={styles.timerStatusText}>Časovač není aktivní</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Timer')}
          >
            <Text style={styles.buttonText}>Spustit časovač</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nedávné aktivity</Text>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
                <Text
                  style={[
                    styles.activityAmount,
                    activity.type === 'expense'
                      ? styles.amountNegative
                      : styles.amountPositive,
                  ]}
                >
                  {activity.type === 'expense' ? '-' : '+'}
                  {formatCurrency(Math.abs(activity.amount))}
                  {activity.details ? ` (${activity.details})` : ''}
                </Text>
              </View>
              {activity.id !== recentActivities[recentActivities.length - 1].id && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // gray-100
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937', // gray-800
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#374151', // gray-700
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#4b5563', // gray-600
  },
  summaryValuePositive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981', // emerald-500
  },
  summaryValueNegative: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444', // red-500
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb', // gray-200
    marginVertical: 4,
  },
  timerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  timerStatusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444', // red-500
    marginRight: 8,
  },
  timerStatusText: {
    fontSize: 16,
    color: '#4b5563', // gray-600
  },
  button: {
    backgroundColor: '#3b82f6', // blue-500
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  activityItem: {
    marginBottom: 4,
  },
  activityContent: {
    paddingVertical: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151', // gray-700
  },
  activityTime: {
    fontSize: 14,
    color: '#6b7280', // gray-500
    marginVertical: 2,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountPositive: {
    color: '#10b981', // emerald-500
  },
  amountNegative: {
    color: '#ef4444', // red-500
  },
});

export default DashboardScreen;