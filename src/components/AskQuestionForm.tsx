import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { UKomiSDK } from '../UKomiSDK';
import { UKomiApiException, UKomiException } from '../errors/UKomiException';

/**
 * Props for the AskQuestionForm component
 */
export interface AskQuestionFormProps {
  /** The UKomiSDK instance (must be authenticated) */
  sdk: UKomiSDK;
  /** The product ID to submit question for */
  productId: string;
  /** Callback when form should be closed (e.g., after successful submission) */
  onClose?: () => void;
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
 * This is a pure form component that can be used in modals, pages, or any container.
 * 
 * @example
 * ```tsx
 * <Modal visible={showQuestionForm}>
 *   <AskQuestionForm 
 *     sdk={ukomiSDK} 
 *     productId="product-123"
 *     onClose={() => setShowQuestionForm(false)}
 *   />
 * </Modal>
 * ```
 */
export const AskQuestionForm: React.FC<AskQuestionFormProps> = ({
  sdk,
  productId,
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
      await sdk.questions().submitQuestion(productId, {
        question,
        email,
        name: name || undefined,
        nickname: nickname || undefined,
      });
      
      // Reset form
      setQuestion('');
      setName('');
      setEmail('');
      setNickname('');
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      let errorMessage = '質問の投稿に失敗しました';
      if (err instanceof UKomiApiException) {
        errorMessage = err.message || errorMessage;
      } else if (err instanceof UKomiException) {
        errorMessage = err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
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

