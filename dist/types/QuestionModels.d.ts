/**
 * Questioner information
 */
export interface Questioner {
    name?: string;
    custome_id?: string;
    email?: string;
    time?: string;
}
/**
 * Answerer information
 */
export interface Answerer {
    name?: string;
    avtar?: string;
    time?: string;
}
/**
 * Question and Answer
 */
export interface Question {
    id: string;
    product_id?: string;
    question: string;
    answer?: string;
    questioner?: Questioner;
    answerer?: Answerer;
    bazora?: string;
    label?: string;
    published?: string;
}
/**
 * Questions wrapper for product-specific endpoint
 */
export interface QuestionsWrapper {
    questions: Question[];
}
/**
 * Questions response for view endpoint
 */
export interface QuestionsResponse {
    total_questions?: string;
    total_unaswer_count?: string;
    questions?: Question[];
}
/**
 * Questions response for product-specific endpoint
 */
export interface ProductQuestionsResponse {
    questions?: QuestionsWrapper;
}
/**
 * Question count
 */
export interface QuestionCount {
    count: number;
}
