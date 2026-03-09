import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, ScrollView, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');

// Rotating ring component
const Ring = ({ size, duration, clockwise = true }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: clockwise ? 1 : -1,
        duration,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-360deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ rotate }],
        },
      ]}
    />
  );
};

// Pulse animation for arc reactor center
const PulseCore = () => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.coreInner, { transform: [{ scale: pulse }] }]}>
      <View style={styles.coreDot} />
    </Animated.View>
  );
};

// Status card component
const StatusCard = ({ label, value, color }) => (
  <View style={styles.statusCard}>
    <Text style={[styles.statusValue, { color: color || Colors.arc }]}>{value}</Text>
    <Text style={styles.statusLabel}>{label}</Text>
  </View>
);

// Quick action button
const ActionBtn = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.actionIcon}>{icon}</Text>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const [time, setTime] = useState(new Date());
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Update clock every second
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Fade in on mount
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeIn }]}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <Text style={styles.headerLabel}>◈ STARK INDUSTRIES ◈</Text>
            <Text style={styles.timeText}>{formatTime(time)}</Text>
            <Text style={styles.dateText}>{formatDate(time)}</Text>
          </View>

          {/* ── Arc Reactor ── */}
          <View style={styles.reactorWrapper}>
            <Ring size={220} duration={8000} clockwise={true} />
            <Ring size={180} duration={5000} clockwise={false} />
            <Ring size={140} duration={12000} clockwise={true} />
            <View style={styles.coreOuter}>
              <PulseCore />
            </View>
            <View style={styles.reactorLabel}>
              <Text style={styles.reactorTitle}>J.A.R.V.I.S.</Text>
              <Text style={styles.reactorSub}>ONLINE</Text>
            </View>
          </View>

          {/* ── Status Cards ── */}
          <View style={styles.statusRow}>
            <StatusCard label="AI STATUS" value="ACTIVE" color={Colors.green} />
            <StatusCard label="ARC REACTOR" value="100%" color={Colors.arc} />
            <StatusCard label="SYSTEMS" value="NOMINAL" color={Colors.gold} />
          </View>

          {/* ── Divider ── */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>QUICK ACCESS</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ── Quick Actions ── */}
          <View style={styles.actionsGrid}>
            <ActionBtn
              icon="◈"
              label="CHAT"
              onPress={() => navigation.navigate('Chat')}
            />
            <ActionBtn
              icon="◎"
              label="VOICE"
              onPress={() => navigation.navigate('Voice')}
            />
            <ActionBtn
              icon="⬟"
              label="FACE ID"
              onPress={() => navigation.navigate('Face')}
            />
            <ActionBtn
              icon="⌘"
              label="SMART HOME"
              onPress={() => navigation.navigate('SmartHome')}
            />
          </View>

          {/* ── Footer ── */}
          <Text style={styles.footer}>
            JARVIS v1.0 · STARK INDUSTRIES · ALL SYSTEMS OPERATIONAL
          </Text>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 30,
  },
  headerLabel: {
    fontSize: 10,
    letterSpacing: 4,
    color: Colors.arcDim,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 42,
    fontWeight: '200',
    color: Colors.arc,
    letterSpacing: 4,
    textShadowColor: Colors.arcGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  dateText: {
    fontSize: 9,
    letterSpacing: 2,
    color: Colors.arcDim,
    marginTop: 4,
  },

  // Arc Reactor
  reactorWrapper: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.3)',
    borderStyle: 'dashed',
  },
  coreOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,212,255,0.08)',
    borderWidth: 2,
    borderColor: Colors.arc,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.arc,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  coreInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,212,255,0.15)',
    borderWidth: 1,
    borderColor: Colors.arc,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.arc,
    shadowColor: Colors.arc,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  reactorLabel: {
    position: 'absolute',
    bottom: -30,
    alignItems: 'center',
  },
  reactorTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 6,
    color: Colors.arc,
    textShadowColor: Colors.arcGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  reactorSub: {
    fontSize: 8,
    letterSpacing: 4,
    color: Colors.green,
    marginTop: 2,
  },

  // Status cards
  statusRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
    marginTop: 10,
  },
  statusCard: {
    flex: 1,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.panelBorder,
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statusLabel: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: Colors.arcDim,
    marginTop: 3,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.panelBorder,
  },
  dividerText: {
    fontSize: 8,
    letterSpacing: 3,
    color: Colors.arcDim,
  },

  // Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 30,
  },
  actionBtn: {
    width: (width - 60) / 2,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.panelBorder,
    borderRadius: 4,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    fontSize: 28,
    color: Colors.arc,
    textShadowColor: Colors.arcGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  actionLabel: {
    fontSize: 10,
    letterSpacing: 3,
    color: Colors.arcDim,
    fontWeight: '600',
  },

  // Footer
  footer: {
    fontSize: 7,
    letterSpacing: 2,
    color: 'rgba(0,212,255,0.2)',
    textAlign: 'center',
  },
}); 