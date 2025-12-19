import React, { useState, useMemo } from 'react';
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
} from 'react-native';

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

export default function EchoBreakerMobile() {
  const [claim, setClaim] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async () => {
    if (!claim.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/reality-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim, link }),
      });

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

      setResult(json as VerificationResponse);
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setClaim('');
    setLink('');
    setResult(null);
    setError(null);
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeContainer}>
            <View style={styles.badgePrimary}>
              <Text style={styles.badgePrimaryText}>ProofLayer · Verification</Text>
            </View>
            <View style={styles.badgeSecondary}>
              <Text style={styles.badgeSecondaryText}>21 claims verified</Text>
            </View>
          </View>

          <Text style={styles.title}>Scan the claim before you share it</Text>
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
              <View style={styles.tabInactive}>
                <Text style={styles.tabInactiveText}>Paste URL</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleReset}>
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
          />

          {/* Presets */}
          <View style={styles.presetContainer}>
            {presets.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={styles.presetButton}
                onPress={() => setClaim(preset)}
              >
                <Text style={styles.presetText}>{preset}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Verify reality</Text>
              )}
            </TouchableOpacity>
          </View>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        {/* Results */}
        {result && (
          <View style={styles.resultCard}>
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
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {result.sources && result.sources.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>TOP VERIFIED SOURCES</Text>
                {result.sources.slice(0, 4).map((s, idx) => (
                  <View key={s.sourceId || s.url || idx} style={styles.sourceItem}>
                    <Text style={styles.sourceTitle}>{s.title || s.url || 'Source'}</Text>
                    <Text style={styles.sourceDomain}>{s.domain || s.url}</Text>
                    {s.url && (
                      <TouchableOpacity onPress={() => openLink(s.url!)}>
                        <Text style={styles.sourceLink}>{s.url}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}

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
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
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
    backgroundColor: 'rgba(79, 70, 229, 0.5)',
    borderColor: 'rgba(99, 102, 241, 0.6)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgePrimaryText: {
    color: '#c7d2fe',
    fontSize: 12,
  },
  badgeSecondary: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeSecondaryText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  form: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tabActive: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tabActiveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tabInactive: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tabInactiveText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  resetButton: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  label: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    minHeight: 100,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetButton: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  presetText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  submitContainer: {
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#f87171',
    fontSize: 14,
    marginTop: 12,
  },
  resultCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  verdictContainer: {
    marginBottom: 16,
  },
  verdictBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    marginBottom: 8,
  },
  verdictFalse: {
    backgroundColor: 'rgba(220, 38, 38, 0.5)',
    borderColor: 'rgba(239, 68, 68, 0.6)',
  },
  verdictTrue: {
    backgroundColor: 'rgba(6, 78, 59, 0.5)',
    borderColor: 'rgba(16, 185, 129, 0.6)',
  },
  verdictPartial: {
    backgroundColor: 'rgba(180, 83, 9, 0.5)',
    borderColor: 'rgba(251, 191, 36, 0.6)',
  },
  verdictText: {
    color: '#fef3c7',
    fontSize: 12,
    fontWeight: '600',
  },
  confidenceText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '600',
  },
  sectionText: {
    color: '#f1f5f9',
    fontSize: 14,
    lineHeight: 20,
  },
  listItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  listItemText: {
    color: '#f1f5f9',
    fontSize: 14,
  },
  sourceItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  sourceTitle: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  sourceDomain: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  sourceLink: {
    color: '#34d399',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  recordText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  recordLink: {
    color: '#34d399',
    textDecorationLine: 'underline',
  },
});
