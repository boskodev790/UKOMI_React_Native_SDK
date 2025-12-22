import { HttpClient } from '../utils/HttpClient';
import { UKomiApiException, UKomiException } from '../errors/UKomiException';
import {
  Question,
  QuestionsResponse,
  QuestionCount,
  ProductQuestionsResponse,
} from '../types/QuestionModels';

/**
 * Question & Answer API client for managing product questions and answers.
 * Provides methods to retrieve questions, answers, and question statistics.
 */
export class QuestionAPI {
  constructor(
    private http: HttpClient,
    private apiKey: string,
    private accessToken: string
  ) {}

  /**
   * Retrieves all questions with optional filtering and pagination.
   * 
   * @param params - Optional query parameters for filtering
   * @param params.grabAll - Whether to grab all questions (default: '1')
   * @param params.fromDate - Filter questions from this date (YYYY-MM-DD format)
   * @param params.updatedDate - Filter questions updated from this date
   * @param params.count - Number of questions per page (default: '10')
   * @param params.page - Page number (default: '1')
   * @param params.label - Filter by label
   * @param params.published - Filter by published status ('1' or '0')
   * @returns Promise resolving to questions response with pagination info
   * @throws {UKomiApiException} When the API returns an error
   * @throws {UKomiException} When a network error occurs
   * 
   * @example
   * ```typescript
   * const questions = await sdk.questions().getAllQuestions({
   *   count: '20',
   *   page: '1',
   *   published: '1'
   * });
   * ```
   */
  async getAllQuestions(params?: {
    grabAll?: string;
    fromDate?: string;
    updatedDate?: string;
    count?: string;
    page?: string;
    label?: string;
    published?: string;
  }): Promise<QuestionsResponse> {
    try {
      const queryParams: Record<string, string> = {
        grab_all: params?.grabAll ?? '1',
        count: params?.count ?? '10',
        page: params?.page ?? '1',
      };

      if (params?.fromDate) {
        queryParams.from_date = params.fromDate;
      }
      if (params?.updatedDate) {
        queryParams.updated_date = params.updatedDate;
      }
      if (params?.label) {
        queryParams.label = params.label;
      }
      if (params?.published) {
        queryParams.published = params.published;
      }

      const response = await this.http.get<QuestionsResponse>(`questions/${this.apiKey}`, {
        params: queryParams,
      });
      return response;
    } catch (error) {
      if (error instanceof UKomiApiException) {
        throw error;
      }
      throw new UKomiException('Network error', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Retrieves all questions for a specific product.
   * 
   * @param productId - The product ID to get questions for
   * @returns Promise resolving to an array of questions
   * @throws {UKomiApiException} When the API returns an error
   * @throws {UKomiException} When a network error occurs
   * 
   * @example
   * ```typescript
   * const questions = await sdk.questions().getProductQuestions('product-123');
   * questions.forEach(q => console.log(q.question));
   * ```
   */
  async getProductQuestions(productId: string): Promise<Question[]> {
    try {
      const response = await this.http.get<ProductQuestionsResponse>(
        `questions/${this.apiKey}/${productId}`
      );
      console.log('question response', response);

      if (!response.questions?.questions) {
        return [];
      }

      return response.questions.questions;
    } catch (error) {
      if (error instanceof UKomiApiException) {
        throw error;
      }
      throw new UKomiException('Network error', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Retrieves the total count of questions for a specific product.
   * 
   * @param productId - The product ID to get question count for
   * @returns Promise resolving to question count
   * @throws {UKomiApiException} When the API returns an error
   * @throws {UKomiException} When a network error occurs
   * 
   * @example
   * ```typescript
   * const count = await sdk.questions().getProductQuestionCount('product-123');
   * console.log(`Total questions: ${count.count}`);
   * ```
   */
  async getProductQuestionCount(productId: string): Promise<QuestionCount> {
    try {
      const response = await this.http.get<QuestionCount>(
        `questions/${this.apiKey}/${productId}/count`
      );
      return response;
    } catch (error) {
      if (error instanceof UKomiApiException) {
        throw error;
      }
      throw new UKomiException('Network error', error instanceof Error ? error : undefined);
    }
  }
}

