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
import Svg, { Path } from 'react-native-svg';
import { UKomiSDK } from '../UKomiSDK';
import { UKomiApiException, UKomiException } from '../errors/UKomiException';

interface InternalQuestion {
  id: string;
  label: string;
  type: 'scale' | 'radio';
  required: boolean;
  options: { value: string; label: string }[];
  scaleType?: 'satisfaction' | 'quantity'; // For different bar colors: 'satisfaction' = blue, 'quantity' = red/green
}

/**
 * Props for the WriteReviewForm component
 */
export interface WriteReviewFormProps {
  /** The UKomiSDK instance (must be authenticated) */
  sdk: UKomiSDK;
  /** The product ID to submit review for */
  productId: string;
  /** Optional: Verification token for order verification */
  verificationToken?: string;
  /** Callback when form should be closed (e.g., after successful submission) */
  onClose?: () => void;
  /** Optional: Callback when review is successfully submitted */
  onSubmitSuccess?: () => void;
  /** Optional: Hide user fields (email, name, nickname) - useful for mobile apps where user is already authenticated */
  hideUserFields?: boolean;
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

// Star SVG path
const starPath = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';

/**
 * WriteReviewForm Component
 * 
 * Displays a form for writing a product review with custom questions support.
 * This is a pure form component that can be used in modals, pages, or any container.
 * 
 * @example
 * ```tsx
 * <Modal visible={showReviewForm}>
 *   <WriteReviewForm 
 *     sdk={ukomiSDK} 
 *     productId="product-123"
 *     onClose={() => setShowReviewForm(false)}
 *   />
 * </Modal>
 * ```
 */
export const WriteReviewForm: React.FC<WriteReviewFormProps> = ({
  sdk,
  productId,
  verificationToken,
  onClose,
  onSubmitSuccess,
  hideUserFields = false,
  colors: customColors,
}) => {
  // Built-in questions matching the screenshot
  const builtInQuestions: InternalQuestion[] = [
    {
      id: 'taste',
      label: '美味しさはいかがでしたか?',
      type: 'scale',
      required: false,
      scaleType: 'satisfaction',
      options: [
        { value: 'satisfied', label: '満足' },
        { value: 'slightly_satisfied', label: '少し満足' },
        { value: 'normal', label: '普通' },
        { value: 'slightly_dissatisfied', label: '少し不満' },
        { value: 'dissatisfied', label: '不満' },
      ],
    },
    {
      id: 'quantity',
      label: '内容量はいかがでしたか?',
      type: 'scale',
      required: false,
      scaleType: 'quantity',
      options: [
        { value: 'little', label: '少ない' },
        { value: 'slightly_little', label: '少し少ない' },
        { value: 'just_right', label: 'ちょうど良い' },
        { value: 'slightly_much', label: '少し多い' },
        { value: 'much', label: '多い' },
      ],
    },
    {
      id: 'freetext_test',
      label: 'フリーテキストのテスト',
      type: 'radio',
      required: false,
      options: [
        { value: 'option1', label: '選択肢1' },
        { value: 'option2', label: '選択肢2' },
        { value: 'option3', label: '選択肢3 (フリーテキスト)' },
      ],
    },
  ];
  const colors = {
    background: customColors?.background || '#FFFFFF',
    text: customColors?.text || '#000000',
    textSecondary: customColors?.textSecondary || '#666666',
    primary: customColors?.primary || '#3b82f6',
    border: customColors?.border || '#e5e5e5',
    surface: customColors?.surface || '#F5F5F5',
    error: customColors?.error || '#ef4444',
  };

  const [rating, setRating] = useState(0);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If hideUserFields is true, we don't need email/name/nickname
  // For mobile apps, the user is already authenticated

  // Render a single star
  const renderStar = (isFilled: boolean, starNumber: number, size: number = 24) => {
    const fillColor = isFilled ? '#f5c518' : 'transparent';
    const strokeColor = isFilled ? '#f5c518' : '#e0e0e0';

    return (
      <TouchableOpacity
        key={starNumber}
        onPress={() => setRating(starNumber)}
        style={starNumber > 1 ? styles.starMargin : undefined}
      >
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d={starPath}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    );
  };

  // Render stars for rating input
  const renderStarInput = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((starNumber) => renderStar(starNumber <= rating, starNumber))}
      </View>
    );
  };

  // Render scale question
  const renderScaleQuestion = (question: InternalQuestion) => {
    const value = customAnswers[question.id] || '';
    const totalLevels = question.options.length;
    
    return (
      <View key={question.id} style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.text }]}>{question.label}</Text>
          {question.required ? (
            <View style={[styles.requiredBadge, { backgroundColor: colors.primary, marginLeft: 8 }]}>
              <Text style={styles.requiredText}>必須</Text>
            </View>
          ) : (
            <View style={[styles.optionalBadge, { backgroundColor: colors.surface, marginLeft: 8 }]}>
              <Text style={[styles.optionalText, { color: colors.textSecondary }]}>任意</Text>
            </View>
          )}
        </View>
        <View style={styles.scaleOptions}>
          {question.options.map((option, index) => {
            const isSelected = value === option.value;
            const level = index + 1;
            
            // Determine bar color based on scale type
            let barColor = '#3B82F6'; // Default blue for satisfaction
            if (question.scaleType === 'quantity') {
              // For quantity: red for extremes (1, 5), green for middle options (2, 3, 4)
              if (level === 1 || level === 5) barColor = '#EF4444'; // Red - too little or too much
              else barColor = '#10B981'; // Green - slightly less, just right, or slightly too much
            } else {
              // For satisfaction: blue gradient (all blue)
              barColor = '#3B82F6'; // Blue
            }
            
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.scaleOption, index > 0 && { marginTop: 8 }]}
                onPress={() => setCustomAnswers({ ...customAnswers, [question.id]: option.value })}
              >
                <View style={[styles.radioButton, { borderColor: colors.border }]}>
                  {isSelected && <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />}
                </View>
                <View style={[styles.scaleBarContainer, { marginLeft: 12 }]}>
                  {[...Array(totalLevels)].map((_, i) => {
                    const isFilled = i < level;
                    return (
                      <View
                        key={i}
                        style={[
                          styles.scaleBar,
                          { 
                            backgroundColor: isFilled ? barColor : '#E5E5E5',
                            ...(i > 0 && { marginLeft: 2 }),
                          },
                        ]}
                      />
                    );
                  })}
                </View>
                <Text style={[styles.scaleOptionLabel, { color: colors.text, marginLeft: 12 }]}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // Render radio question
  const renderRadioQuestion = (question: InternalQuestion) => {
    const value = customAnswers[question.id] || '';
    
    return (
      <View key={question.id} style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.text }]}>{question.label}</Text>
          {question.required ? (
            <View style={[styles.requiredBadge, { backgroundColor: colors.primary, marginLeft: 8 }]}>
              <Text style={styles.requiredText}>必須</Text>
            </View>
          ) : (
            <View style={[styles.optionalBadge, { backgroundColor: colors.surface, marginLeft: 8 }]}>
              <Text style={[styles.optionalText, { color: colors.textSecondary }]}>任意</Text>
            </View>
          )}
        </View>
        <View style={styles.radioOptions}>
          {question.options.map((option, index) => {
            const isSelected = value === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.radioOption, index > 0 && { marginTop: 8 }]}
                onPress={() => setCustomAnswers({ ...customAnswers, [question.id]: option.value })}
              >
                <View style={[styles.radioButton, { borderColor: colors.border }]}>
                  {isSelected && <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={[styles.radioOptionLabel, { color: colors.text, marginLeft: 12 }]}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };


  const handleSubmit = async () => {
    // Validate required fields
    if (rating === 0) {
      setError('評価を選択してください');
      return;
    }
    if (!subject.trim()) {
      setError('件名を入力してください');
      return;
    }
    if (!content.trim()) {
      setError('本文を入力してください');
      return;
    }
    
    // Only validate email if user fields are not hidden
    if (!hideUserFields) {
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
    }

    // Validate required built-in questions
    for (const question of builtInQuestions) {
      if (question.required) {
        const answer = customAnswers[question.id];
        if (!answer || (typeof answer === 'string' && !answer.trim())) {
          setError(`${question.label}を入力してください`);
          return;
        }
      }
    }

    setError(null);
    setLoading(true);

    try {
      await sdk.reviews().submitReview(productId, {
        rating,
        subject,
        content,
        email: hideUserFields ? '' : email, // Empty email when hidden - API should use authenticated user's email
        name: hideUserFields ? undefined : (name || undefined),
        nickname: hideUserFields ? undefined : (nickname || undefined),
        customAnswers: Object.keys(customAnswers).length > 0 ? customAnswers : undefined,
        verificationToken: verificationToken,
      });
      
      // Reset form
      setRating(0);
      setSubject('');
      setContent('');
      setName('');
      setEmail('');
      setNickname('');
      setCustomAnswers({});
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      let errorMessage = 'レビューの投稿に失敗しました';
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
    <View style={[styles.formAdvanced, { backgroundColor: colors.background, borderColor: colors.border }]}>
      {/* Rating Field */}
      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.text }]}>評価</Text>
          <View style={[styles.requiredBadge, { backgroundColor: colors.primary, marginLeft: 8 }]}>
            <Text style={styles.requiredText}>必須</Text>
          </View>
        </View>
        {renderStarInput()}
      </View>

      {/* Subject Field */}
      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.text }]}>件名</Text>
          <View style={[styles.requiredBadge, { backgroundColor: colors.primary, marginLeft: 8 }]}>
            <Text style={styles.requiredText}>必須</Text>
          </View>
        </View>
        <TextInput
          style={[styles.textInput, { borderColor: colors.border, color: colors.text }]}
          value={subject}
          onChangeText={setSubject}
          placeholder="件名を入力してください"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Content Field */}
      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.text }]}>本文</Text>
          <View style={[styles.requiredBadge, { backgroundColor: colors.primary, marginLeft: 8 }]}>
            <Text style={styles.requiredText}>必須</Text>
          </View>
        </View>
        <TextInput
          style={[styles.textArea, { borderColor: colors.border, color: colors.text }]}
          value={content}
          onChangeText={setContent}
          placeholder="レビュー本文を入力してください"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />
      </View>

      {/* Name Field */}
      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.text }]}>お名前</Text>
          <View style={[styles.optionalBadge, { backgroundColor: colors.surface, marginLeft: 8 }]}>
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
          <View style={[styles.requiredBadge, { backgroundColor: colors.primary, marginLeft: 8 }]}>
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
          <View style={[styles.optionalBadge, { backgroundColor: colors.surface, marginLeft: 8 }]}>
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

      {/* Built-in Questions */}
      {builtInQuestions.map((question) => {
        if (question.type === 'scale') {
          return renderScaleQuestion(question);
        } else if (question.type === 'radio') {
          return renderRadioQuestion(question);
        }
        return null;
      })}

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
  formAdvanced: {
    width: '100%',
    maxWidth: 600,
    borderWidth: 1,
    borderRadius: 8,
    padding: 20, // 1.25rem = 20px
  },
  formGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starMargin: {
    marginLeft: 4,
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
  scaleOptions: {
    flexDirection: 'column',
  },
  scaleOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scaleBarContainer: {
    flexDirection: 'row',
    width: 96,
  },
  scaleBar: {
    flex: 1,
    height: 8,
    borderRadius: 2,
  },
  scaleOptionLabel: {
    fontSize: 14, // 0.875rem = 14px
    flex: 1,
  },
  radioOptions: {
    flexDirection: 'column',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioOptionLabel: {
    fontSize: 14, // 0.875rem = 14px
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

