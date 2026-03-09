import { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, Animated,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { askJarvis, resetConversation } from '../services/claudeAPI';

// Single message bubble
const MessageBubble = ({ item }) => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1, duration: 300, useNativeDriver: true,
      }),
      Animated.timing(slideIn, {
        toValue: 0, duration: 300, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isUser = item.role === 'user';

  return (
    <Animated.View
      style={[
        styles.bubbleWrapper,
        isUser ? styles.bubbleWrapperUser : styles.bubbleWrapperJarvis,
        { opacity: fadeIn, transform: [{ translateY: slideIn }] },
      ]}
    >
      <Text style={styles.bubbleLabel}>
        {isUser ? '▸ YOU' : '◈ J.A.R.V.I.S.'}
      </Text>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleJarvis]}>
        <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextJarvis]}>
          {item.content}
        </Text>
      </View>
      <Text style={styles.bubbleTime}>{item.time}</Text>
    </Animated.View>
  );
};

// Thinking dots
const ThinkingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    };
    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  return (
    <View style={styles.thinkingWrapper}>
      <Text style={styles.bubbleLabel}>◈ J.A.R.V.I.S.</Text>
      <View style={styles.thinkingBubble}>
        <Text style={styles.thinkingText}>PROCESSING</Text>
        <View style={styles.dotsRow}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: '0',
      role: 'assistant',
      content: 'Good day. I am J.A.R.V.I.S., your personal AI assistant. I am fully operational and at your service. You may speak to me in any language, sir.',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const flatListRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isThinking) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);
    scrollToBottom();

    const response = await askJarvis(text);

    const jarvisMsg = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.message,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, jarvisMsg]);
    setIsThinking(false);
    scrollToBottom();
  };

  const clearChat = () => {
    resetConversation();
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: 'Memory wiped. Ready for a fresh start, sir.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>◈ JARVIS CHAT</Text>
          <Text style={styles.headerSub}>AI · MULTILINGUAL · CONTEXT-AWARE</Text>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={clearChat}>
          <Text style={styles.clearBtnText}>CLEAR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* ── Messages ── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageBubble item={item} />}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isThinking ? <ThinkingIndicator /> : null}
          onContentSizeChange={scrollToBottom}
        />

        {/* ── Input bar ── */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask JARVIS anything..."
            placeholderTextColor="rgba(0,212,255,0.3)"
            multiline
            maxLength={1000}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || isThinking) && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || isThinking}
            activeOpacity={0.7}
          >
            {isThinking
              ? <ActivityIndicator size="small" color={Colors.bg} />
              : <Text style={styles.sendBtnText}>▶</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    color: Colors.arc,
    textShadowColor: Colors.arcGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  headerSub: {
    fontSize: 7,
    letterSpacing: 2,
    color: Colors.arcDim,
    marginTop: 2,
  },
  clearBtn: {
    borderWidth: 1,
    borderColor: Colors.panelBorder,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearBtnText: {
    fontSize: 8,
    letterSpacing: 2,
    color: Colors.arcDim,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.panelBorder,
    marginHorizontal: 20,
  },

  // Messages
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  bubbleWrapper: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  bubbleWrapperUser: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubbleWrapperJarvis: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubbleLabel: {
    fontSize: 7,
    letterSpacing: 2,
    color: Colors.arcDim,
    marginBottom: 4,
  },
  bubble: {
    borderRadius: 4,
    padding: 12,
  },
  bubbleUser: {
    backgroundColor: 'rgba(255,200,87,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,200,87,0.3)',
  },
  bubbleJarvis: {
    backgroundColor: 'rgba(0,212,255,0.06)',
    borderWidth: 1,
    borderColor: Colors.panelBorder,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 22,
  },
  bubbleTextUser: { color: '#e8d9b0' },
  bubbleTextJarvis: { color: Colors.textPrimary },
  bubbleTime: {
    fontSize: 7,
    color: 'rgba(0,212,255,0.2)',
    marginTop: 4,
    letterSpacing: 1,
  },

  // Thinking
  thinkingWrapper: {
    marginBottom: 16,
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  thinkingBubble: {
    backgroundColor: 'rgba(0,212,255,0.06)',
    borderWidth: 1,
    borderColor: Colors.panelBorder,
    borderRadius: 4,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  thinkingText: {
    fontSize: 9,
    letterSpacing: 3,
    color: Colors.arcDim,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.arc,
  },

  // Input
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.panelBorder,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0,20,35,0.9)',
    borderWidth: 1,
    borderColor: Colors.panelBorder,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.arc,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    backgroundColor: Colors.arc,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.arc,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.arcDim,
    shadowOpacity: 0,
    elevation: 0,
  },
  sendBtnText: {
    color: Colors.bg,
    fontSize: 16,
    fontWeight: '700',
  },
});