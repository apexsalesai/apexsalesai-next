import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Linking,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Animated,
  Share,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import NetInfo from '@react-native-community/netinfo';
import { LinearGradient } from 'expo-linear-gradient';

type VerificationResponse = {
  verificationId?: string;
  verdict?: string;
  confidence?: number;
  summary?: string;
  bottomLine?: string;
  spreadFactors?: string[];
  whatDataShows?: string[];
  sources?: { sourceId?: string; title?: string; url?: string; domain?: string; tier?: number }[];
  error?: string;
};

const presets = [
  "A viral stat: '73% of Americans support mandatory voter ID laws'",
  "A headline: 'New policy will double taxes next year'",
  "A post: 'This video proves the election was hacked'",
  "Claim: The world is flat",
];

const API_BASE_URL = 'https://www.apexsalesai.com';
const CACHE_KEY = '@echo_breaker_cache';
const RECENT_VERIFICATIONS_KEY = '@recent_verifications';

// Skeleton loader component
const SkeletonLoader = () => {
  const fadeAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.skeletonContainer}>
      <Animated.View style={[styles.skeletonBadge, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.skeletonLine, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.skeletonLine, { opacity: fadeAnim, width: '80%' }]} />
      <Animated.View style={[styles.skeletonBox, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.skeletonBox, { opacity: fadeAnim }]} />
    </View>
  );
};

export default function EchoBreakerPremium() {
  const [claim, setClaim] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentVerifications, setRecentVerifications] = useState<VerificationResponse[]>([]);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  // Check network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  // Load recent verifications from cache
  useEffect(() => {
    loadRecentVerifications();
  }, []);

  // Animate result appearance
  useEffect(() => {
    if (result) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [result]);

  const loadRecentVerifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_VERIFICATIONS_KEY);
      if (stored) {
        setRecentVerifications(JSON.parse(stored).slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load recent verifications', err);
    }
  };

  const saveToRecent = async (verification: VerificationResponse) => {
    try {
      const recent = [...recentVerifications];
      recent.unshift(verification);
      const trimmed = recent.slice(0, 10);
      await AsyncStorage.setItem(RECENT_VERIFICATIONS_KEY, JSON.stringify(trimmed));
      setRecentVerifications(trimmed.slice(0, 5));
    } catch (err) {
      console.error('Failed to save verification', err);
    }
  };

  const confidenceLabel = useMemo(() => {
    const c = Math.round(result?.confidence || 0);
    if (c >= 80) return 'High confidence';
    if (c >= 50) return 'Moderate confidence';
    if (c > 0) return 'Low confidence';
    return 'Not enough signal';
  }, [result?.confidence]);

  const getVerdictStyle = (verdict?: string) => {
    const v = (verdict || '').toLowerCase();
    if (v.includes('false') || v.includes('misleading')) return styles.verdictFalse;
    if (v.includes('accurate') || v.includes('true')) return styles.verdictTrue;
    return styles.verdictPartial;
  };

  const getVerdictColor = (verdict?: string) => {
    const v = (verdict || '').toLowerCase();
    if (v.includes('false') || v.includes('misleading')) return ['#7f1d1d', '#991b1b'];
    if (v.includes('accurate') || v.includes('true')) return ['#064e3b', '#065f46'];
    return ['#78350f', '#92400e'];
  };

  const handleSubmit = async () => {
    if (!claim.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Missing Information', 'Please enter a claim to verify');
      return;
    }

    // Haptic feedback on submit
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setLoading(true);
    setError(null);
    setResult(null);

    // Check cache first
    const cacheKey = `${CACHE_KEY}:${claim.trim()}`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const cachedResult = JSON.parse(cached);
        const age = Date.now() - cachedResult.timestamp;
        // Use cache if less than 1 hour old
        if (age < 3600000) {
          setResult(cachedResult.data);
          setLoading(false);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return;
        }
      }
    } catch (err) {
      console.error('Cache read error', err);
    }

    // Network check
    if (!isOnline) {
      setError('No internet connection. Please check your network and try again.');
      setLoading(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const res = await fetch(`${API_BASE_URL}/api/reality-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim, link }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const text = await res.text();
      if (!text) {
        throw new Error(res.ok ? 'Empty response from verifier' : `Verifier error (${res.status})`);
      }

      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error('Unexpected response from verifier');
      }

      if (!res.ok || json?.error) {
        throw new Error(json?.error || 'Verification failed');
      }

      const verificationResult = json as VerificationResponse;
      setResult(verificationResult);

      // Save to cache
      try {
        await AsyncStorage.setItem(cacheKey, JSON.stringify({
          data: verificationResult,
          timestamp: Date.now(),
        }));
        await saveToRecent(verificationResult);
      } catch (err) {
        console.error('Cache write error', err);
      }

      // Success haptic
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Announce result for accessibility
      AccessibilityInfo.announceForAccessibility(
        `Verification complete. Verdict: ${verificationResult.verdict}. Confidence: ${Math.round(verificationResult.confidence || 0)} percent.`
      );

    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err?.message || 'Verification failed');
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    await Haptics.selectionAsync();
    setClaim('');
    setLink('');
    setResult(null);
    setError(null);
  };

  const handlePresetSelect = async (preset: string) => {
    await Haptics.selectionAsync();
    setClaim(preset);
  };

  const handleShare = async () => {
    if (!result) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const message = `Echo Breaker Verification\n\nClaim: "${claim}"\n\nVerdict: ${result.verdict}\nConfidence: ${Math.round(result.confidence || 0)}%\n\n${result.summary || ''}\n\nVerify claims at: https://www.apexsalesai.com/echo-breaker`;

    try {
      await Share.share({
        message,
        title: 'Echo Breaker Verification Result',
      });
    } catch (err) {
      console.error('Share error', err);
    }
  };

  const openLink = async (url: string) => {
    await Haptics.selectionAsync();
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open link');
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecentVerifications();
    setRefreshing(false);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#0f172a']}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6366f1"
              colors={['#6366f1']}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeContainer}>
              <LinearGradient
                colors={['#4f46e5', '#6366f1']}
                style={styles.badgePrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.badgePrimaryText}>ProofLayer · Verification</Text>
              </LinearGradient>
              <View style={styles.badgeSecondary}>
                <Text style={styles.badgeSecondaryText}>
                  {isOnline ? '🟢 Online' : '🔴 Offline'}
                </Text>
              </View>
            </View>

            <Text style={styles.title} accessibilityRole="header">
              Scan the claim before you share it
            </Text>
            <Text style={styles.subtitle}>
              Paste any post, headline, or viral stat. Get a reality check with sources and a ProofCard.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.formHeader}>
              <View style={styles.tabContainer}>
                <View style={styles.tabActive}>
                  <Text style={styles.tabActiveText}>Paste Text</Text>
                </View>
                <TouchableOpacity
                  style={styles.tabInactive}
                  onPress={() => Haptics.selectionAsync()}
                  accessible={true}
                  accessibilityLabel="Switch to URL paste mode"
                >
                  <Text style={styles.tabInactiveText}>Paste URL</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={handleReset}
                accessible={true}
                accessibilityLabel="Reset form"
                accessibilityHint="Clears all input fields"
              >
                <Text style={styles.resetButton}>Reset</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>CLAIM OR HEADLINE</Text>
            <TextInput
              style={styles.textArea}
              value={claim}
              onChangeText={setClaim}
              placeholder="Paste the claim you want to verify"
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              accessible={true}
              accessibilityLabel="Claim input field"
              accessibilityHint="Enter the claim or headline you want to verify"
            />

            <Text style={styles.label}>LINK (OPTIONAL)</Text>
            <TextInput
              style={styles.input}
              value={link}
              onChangeText={setLink}
              placeholder="Paste source link for context (optional)"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              accessible={true}
              accessibilityLabel="Source link input field"
              accessibilityHint="Optionally enter a source URL for additional context"
            />

            {/* Presets */}
            <View style={styles.presetContainer}>
              {presets.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={styles.presetButton}
                  onPress={() => handlePresetSelect(preset)}
                  accessible={true}
                  accessibilityLabel={`Preset example: ${preset}`}
                  accessibilityHint="Tap to use this example claim"
                >
                  <Text style={styles.presetText} numberOfLines={1}>{preset}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit Button */}
            <View style={styles.submitContainer}>
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                accessible={true}
                accessibilityLabel="Verify reality button"
                accessibilityHint="Tap to submit the claim for verification"
                accessibilityState={{ disabled: loading }}
              >
                <LinearGradient
                  colors={loading ? ['#4b5563', '#6b7280'] : ['#6366f1', '#4f46e5']}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Verify reality</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorContainer} accessible={true} accessibilityLiveRegion="polite">
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}
          </View>

          {/* Loading Skeleton */}
          {loading && <SkeletonLoader />}

          {/* Results */}
          {result && !loading && (
            <Animated.View
              style={[
                styles.resultCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={getVerdictColor(result.verdict)}
                style={styles.verdictHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.verdictContainer}>
                  <View style={[styles.verdictBadge, getVerdictStyle(result.verdict)]}>
                    <Text style={styles.verdictText}>
                      {result.verdict ? result.verdict.toUpperCase() : 'AWAITING VERDICT'}
                    </Text>
                  </View>
                  <Text style={styles.confidenceText}>
                    Confidence: {Math.round(result.confidence || 0)}% · {confidenceLabel}
                  </Text>
                </View>
              </LinearGradient>

              {result.summary && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>SUMMARY</Text>
                  <Text style={styles.sectionText}>{result.summary}</Text>
                </View>
              )}

              {result.bottomLine && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>BOTTOM LINE</Text>
                  <Text style={styles.sectionText}>{result.bottomLine}</Text>
                </View>
              )}

              {result.whatDataShows && result.whatDataShows.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>WHAT DATA SHOWS</Text>
                  {result.whatDataShows.map((item, idx) => (
                    <View key={idx} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}

              {result.spreadFactors && result.spreadFactors.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>WHY THIS SPREADS</Text>
                  {result.spreadFactors.map((item, idx) => (
                    <View key={idx} style={styles.listItem}>
                      <Text style={styles.bullet}>📢</Text>
                      <Text style={styles.listItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}

              {result.sources && result.sources.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>TOP VERIFIED SOURCES</Text>
                  {result.sources.slice(0, 4).map((s, idx) => (
                    <TouchableOpacity
                      key={s.sourceId || s.url || idx}
                      style={styles.sourceItem}
                      onPress={() => s.url && openLink(s.url)}
                      accessible={true}
                      accessibilityLabel={`Source: ${s.title || s.domain}`}
                      accessibilityHint="Tap to open source in browser"
                    >
                      <Text style={styles.sourceTitle}>{s.title || s.url || 'Source'}</Text>
                      <Text style={styles.sourceDomain}>🔗 {s.domain || s.url}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Share Button */}
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
                accessible={true}
                accessibilityLabel="Share verification result"
                accessibilityHint="Share this verification via messaging or social media"
              >
                <Text style={styles.shareButtonText}>📤 Share Verification</Text>
              </TouchableOpacity>

              {result.verificationId && (
                <Text style={styles.recordText}>
                  View record:{' '}
                  <Text
                    style={styles.recordLink}
                    onPress={() => openLink(`${API_BASE_URL}/v/${result.verificationId}`)}
                  >
                    /v/{result.verificationId}
                  </Text>
                </Text>
              )}
            </Animated.View>
          )}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  badgePrimary: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  badgePrimaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeSecondary: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeSecondaryText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  form: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tabActive: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  tabActiveText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  tabInactive: {
    backgroundColor: '#1e293b',
    borderColor: '#475569',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tabInactiveText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  resetButton: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '500',
  },
  label: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textArea: {
    backgroundColor: '#1e293b',
    borderColor: '#475569',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    minHeight: 110,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1e293b',
    borderColor: '#475569',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    marginBottom: 20,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  presetButton: {
    backgroundColor: '#1e293b',
    borderColor: '#475569',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  presetText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  submitContainer: {
    marginTop: 8,
  },
  submitButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  errorContainer: {
    marginTop: 14,
    padding: 14,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderRadius: 12,
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
    lineHeight: 20,
  },
  skeletonContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },
  skeletonBadge: {
    width: 120,
    height: 24,
    backgroundColor: '#334155',
    borderRadius: 12,
    marginBottom: 16,
  },
  skeletonLine: {
    width: '100%',
    height: 16,
    backgroundColor: '#334155',
    borderRadius: 8,
    marginBottom: 12,
  },
  skeletonBox: {
    width: '100%',
    height: 80,
    backgroundColor: '#334155',
    borderRadius: 12,
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  verdictHeader: {
    padding: 18,
    marginBottom: 6,
  },
  verdictContainer: {
    gap: 10,
  },
  verdictBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
  },
  verdictFalse: {
    backgroundColor: 'rgba(220, 38, 38, 0.3)',
    borderColor: '#ef4444',
  },
  verdictTrue: {
    backgroundColor: 'rgba(6, 78, 59, 0.3)',
    borderColor: '#10b981',
  },
  verdictPartial: {
    backgroundColor: 'rgba(180, 83, 9, 0.3)',
    borderColor: '#f59e0b',
  },
  verdictText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  confidenceText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  sectionLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  sectionText: {
    color: '#f1f5f9',
    fontSize: 15,
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderColor: '#475569',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bullet: {
    color: '#6366f1',
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  listItemText: {
    flex: 1,
    color: '#f1f5f9',
    fontSize: 14,
    lineHeight: 22,
  },
  sourceItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderColor: '#475569',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  sourceTitle: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  sourceDomain: {
    color: '#94a3b8',
    fontSize: 13,
  },
  shareButton: {
    margin: 18,
    marginTop: 12,
    backgroundColor: '#6366f1',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recordText: {
    color: '#cbd5e1',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18,
  },
  recordLink: {
    color: '#34d399',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
