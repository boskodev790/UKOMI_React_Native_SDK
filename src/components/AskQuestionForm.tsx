import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { UKomiSDK } from '../UKomiSDK';

/**
 * Props for the AskQuestionForm component
 */
export interface AskQuestionFormProps {
  /** The UKomiSDK instance (must be authenticated) */
  sdk: UKomiSDK;
  /** The product ID to submit question for */
  productId: string;
  /** Whether the form modal is visible */
  visible: boolean;
  /** Callback when form should be closed */
  onClose: () => void;
  /** Optional: Callback when question is successfully submitted */
  onSubmitSuccess?: () => void;
  /** Optional: Custom colors for theming */
  colors?: {
    background?: string;
    text?: string;
    textSecondary?: string;
    primary?: string;
    border?: string;
    surface?: string;
    error?: string;
  };
}

/**
 * AskQuestionForm Component
 * 
 * Displays a form for asking a question about a product.
 * 
 * @example
 * ```tsx
 * <AskQuestionForm 
 *   sdk={ukomiSDK} 
 *   productId="product-123"
 *   visible={showQuestionForm}
 *   onClose={() => setShowQuestionForm(false)}
 * />
 * ```
 */
export const AskQuestionForm: React.FC<AskQuestionFormProps> = ({
  sdk,
  productId,
  visible,
  onClose,
  onSubmitSuccess,
  colors: customColors,
}) => {
  const colors = {
    background: customColors?.background || '#FFFFFF',
    text: customColors?.text || '#000000',
    textSecondary: customColors?.textSecondary || '#666666',
    primary: customColors?.primary || '#3b82f6',
    border: customColors?.border || '#e5e5e5',
    surface: customColors?.surface || '#F5F5F5',
    error: customColors?.error || '#ef4444',
  };

  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validate required fields
    if (!question.trim()) {
      setError('質問を入力してください');
      return;
    }
    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('有効なメールアドレスを入力してください');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // TODO: Implement API call to submit question
      // Example: await sdk.questions().submitQuestion(productId, { question, name, email, nickname });
      
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setQuestion('');
      setName('');
      setEmail('');
      setNickname('');
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '質問の投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQuestion('');
    setName('');
    setEmail('');
    setNickname('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>質問を投稿</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6l12 12" stroke={colors.text} strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Question Field */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>質問</Text>
                <View style={[styles.requiredBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.requiredText}>必須</Text>
                </View>
              </View>
              <TextInput
                style={[styles.textArea, { borderColor: colors.border, color: colors.text }]}
                value={question}
                onChangeText={setQuestion}
                placeholder="質問を入力してください"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Name Field */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>お名前</Text>
                <View style={[styles.optionalBadge, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.optionalText, { color: colors.textSecondary }]}>任意</Text>
                </View>
              </View>
              <TextInput
                style={[styles.textInput, { borderColor: colors.border, color: colors.text }]}
                value={name}
                onChangeText={setName}
                placeholder="お名前を入力してください"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Email Field */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>メールアドレス</Text>
                <View style={[styles.requiredBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.requiredText}>必須</Text>
                </View>
              </View>
              <TextInput
                style={[styles.textInput, { borderColor: colors.border, color: colors.text }]}
                value={email}
                onChangeText={setEmail}
                placeholder="メールアドレスを入力してください"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Nickname Field */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>ニックネーム</Text>
                <View style={[styles.optionalBadge, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.optionalText, { color: colors.textSecondary }]}>任意</Text>
                </View>
              </View>
              <TextInput
                style={[styles.textInput, { borderColor: colors.border, color: colors.text }]}
                value={nickname}
                onChangeText={setNickname}
                placeholder="ニックネームを入力してください"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <Text style={[styles.helpText, { color: colors.textSecondary }]}>
              メールアドレスはサイトに公開されません
            </Text>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>投稿する</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  requiredBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  optionalBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  optionalText: {
    fontSize: 10,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 44,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    marginBottom: 20,
    marginTop: -10,
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  errorText: {
    fontSize: 14,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

