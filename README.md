# U-KOMI React Native SDK

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

Official React Native SDK for integrating with the U-KOMI API. This SDK provides a clean, type-safe interface to interact with all U-KOMI API endpoints using async/await.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Deployment](#deployment)
- [Quick Start](#quick-start)
- [SDK Structure](#sdk-structure)
- [API Modules](#api-modules)
- [V1 review form and submit](#v1-review-form-and-submit)
- [UI components](#ui-components)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
- [Requirements](#requirements)
- [License](#license)
- [Support](#support)

## ✨ Features

- ✅ **Complete API Coverage** - Authentication, Account, Reviews (including **v1** `review_form_fields` / `review_submit`), Products, Orders, Groups, Q&A (30+ endpoints)
- ✅ **Type-Safe TypeScript API** - Full TypeScript support with interfaces and type safety
- ✅ **Async/Await Support** - All operations use async/await pattern
- ✅ **Built-in Error Handling** - Comprehensive exception hierarchy for different error types
- ✅ **Easy to Use** - Simple constructor-based initialization
- ✅ **Well-Documented** - Comprehensive documentation and code examples
- ✅ **Expo Compatible** - Works with Expo and bare React Native projects
- ✅ **Production Ready** - Ready for npm publication

## 📦 Installation

### From npm (when published)

```bash
npm install @ukomi/react-native-sdk
```

or

```bash
yarn add @ukomi/react-native-sdk
```

### Local Development

For local development or testing before publication:

```bash
# In your project directory
npm install /path/to/React_Native_SDK
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "@ukomi/react-native-sdk": "file:../React_Native_SDK"
  }
}
```

## 🚀 Deployment

### Building the SDK

Before deploying, build the SDK:

```bash
cd React_Native_SDK
npm install
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Publishing to npm

1. **Update version** in `package.json`:
   ```json
   {
     "version": "1.0.0"
   }
   ```

2. **Login to npm**:
   ```bash
   npm login
   ```

3. **Publish**:
   ```bash
   npm publish --access public
   ```

   The `prepublishOnly` script will automatically build the SDK before publishing.

### Version Management

- Use semantic versioning (MAJOR.MINOR.PATCH)
- Update version in `package.json` before each release
- Tag releases in git: `git tag v1.0.0 && git push --tags`

### Package Configuration

The SDK is configured for npm publication with:
- **Main entry**: `dist/index.js`
- **TypeScript definitions**: `dist/index.d.ts`
- **Files included**: `dist/` folder and `README.md`
- **Peer dependencies**: React >= 16.8.0, React Native >= 0.60.0

## 🚀 Quick Start

### 1. Initialize the SDK

```typescript
import { UKomiSDK } from '@ukomi/react-native-sdk';

const sdk = new UKomiSDK({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
  baseUrl: 'https://api.u-komi.com/', // Optional, defaults to production URL
});
```

### 2. Authenticate

```typescript
try {
  const accessToken = await sdk.authenticate();
  console.log('Authenticated successfully');
  // SDK is now ready to use
} catch (error) {
  if (error instanceof UKomiAuthException) {
    console.error('Authentication failed:', error.message);
    // Handle authentication error
  }
}
```

### 3. Use the API

#### Get Account Information

```typescript
try {
  const account = await sdk.account().getAccountBasic();
  console.log('Account ID:', account.accountId);
  console.log('Account Name:', account.name);
} catch (error) {
  console.error('Error:', error.message);
}
```

#### Get Reviews

```typescript
try {
  const reviews = await sdk.reviews().getAllReviews({
    count: '10',
    page: '1',
    sort: 'date',
    sortOrder: 'desc',
  });
  
  reviews.review?.forEach((review) => {
    console.log('Title:', review.title);
    console.log('Score:', review.score);
  });
} catch (error) {
  console.error('Error:', error.message);
}
```

## 🏗️ SDK Structure

### Project Architecture

```
React_Native_SDK/
├── src/
│   ├── UKomiSDK.ts              # Main SDK class
│   ├── index.ts                  # Public exports
│   ├── api/                      # API module classes
│   │   ├── AccountAPI.ts        # Account operations
│   │   ├── ReviewAPI.ts         # Review operations
│   │   ├── ProductAPI.ts        # Product operations
│   │   ├── OrderAPI.ts          # Order operations
│   │   ├── GroupAPI.ts          # Group operations
│   │   └── QuestionAPI.ts       # Question & Answer operations
│   ├── config/                   # Configuration
│   │   └── ApiConfig.ts         # API base URL and constants
│   ├── errors/                   # Error classes
│   │   └── UKomiException.ts   # Exception hierarchy
│   ├── types/                    # TypeScript type definitions
│   │   ├── AccountModels.ts
│   │   ├── AuthModels.ts
│   │   ├── ReviewModels.ts
│   │   ├── ProductModels.ts
│   │   ├── OrderModels.ts
│   │   ├── GroupModels.ts
│   │   ├── QuestionModels.ts
│   │   └── ApiResponse.ts
│   ├── utils/                    # Utilities
│   │   └── HttpClient.ts        # HTTP client wrapper
│   └── components/               # Optional RN UI (WriteReviewForm, OrderList, …)
├── dist/                         # Compiled JavaScript (generated)
├── package.json                  # Package configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

### Design Principles

1. **Modular Architecture** - Each API module is a separate class for better organization
2. **Type Safety** - All API responses and requests are strongly typed
3. **Error Handling** - Comprehensive exception hierarchy for different error types
4. **Async/Await** - All operations use modern async/await pattern
5. **HTTP Abstraction** - Centralized HTTP client for consistent request handling

## 📚 API Modules

### Authentication

The SDK handles authentication automatically. After calling `authenticate()`, the access token is stored and used for all subsequent API calls.

#### Methods

- `authenticate()` - Authenticate with API key and secret, returns access token
- `setAccessToken(token: string)` - Manually set an access token
- `getAccessToken()` - Get current access token
- `isAuthenticated()` - Check if SDK is authenticated

### Account API

Access account information and settings.

#### Methods

- **`getAccountBasic()`** - Get account basic information
  - Returns: `Account` object with account details
  - Throws: `UKomiApiException`, `UKomiException`

### Review API

Comprehensive review management with filtering, pagination, and analytics.

#### Methods

- **`getAllReviews(params?)`** - Get all reviews with extensive filtering
  - Parameters:
    - `fromId?: string` - Filter from review ID
    - `customerId?: string` - Filter by customer ID
    - `fromDate?: string` - Filter from date (YYYY-MM-DD)
    - `updatedDate?: string` - Filter by update date
    - `count?: string` - Number of reviews per page
    - `page?: string` - Page number
    - `sort?: string` - Sort field (e.g., 'date', 'score')
    - `sortOrder?: string` - Sort order ('asc' or 'desc')
    - `stars?: string` - Filter by star rating
    - `productId?: string` - Filter by product ID
    - `group?: string` - Filter by group
    - `groupName?: string` - Filter by group name
    - `label?: string` - Filter by label
    - `deleted?: string` - Include deleted reviews ('1' or '0')
    - And more...
  - Returns: `ReviewResponse` with reviews array
  - Throws: `UKomiApiException`, `UKomiException`

- **`getAllReviewsBasic(params?)`** - Get all reviews in basic format
  - Same parameters as `getAllReviews()`
  - Returns: `ReviewResponse` (simplified data)
  - Throws: `UKomiApiException`, `UKomiException`

- **`getReviewsWithOrders(params?)`** - Get reviews with associated order information
  - Parameters: `ReviewFilterParams` (optional)
  - Returns: `ReviewWithOrders[]`
  - Throws: `UKomiApiException`, `UKomiException`

- **`getGroupsReviewSummary(groupIds, filter?)`** - Get review summary for multiple groups
  - Parameters:
    - `groupIds: string[]` - Array of group IDs
    - `filter?: ReviewSummaryFilter` - Optional filter
  - Returns: `ReviewSummary`
  - Throws: `UKomiApiException`, `UKomiException`

- **`getCustomersReviewSummary(customerIds, filter?)`** - Get review summary for multiple customers
  - Parameters:
    - `customerIds: string[]` - Array of customer IDs
    - `filter?: ReviewSummaryFilter` - Optional filter
  - Returns: `CustomerReviewSummary[]`
  - Throws: `UKomiApiException`, `UKomiException`

- **`getFilteredReviewSummary(reviewType, filter)`** - Get filtered review summary
  - Parameters:
    - `reviewType: string` - Review type
    - `filter: ReviewSummaryFilter` - Filter criteria
  - Returns: `ReviewSummary`
  - Throws: `UKomiApiException`, `UKomiException`

- **`getReviewSummary(reviewType, params?)`** - Get review summary for a review type
  - Parameters:
    - `reviewType: string` - Review type
    - `params?: { productId?: string, group?: string, groupName?: string }`
  - Returns: `ReviewSummary`
  - Throws: `UKomiApiException`, `UKomiException`

- **`getReview(reviewId)`** - Get a single review by ID
  - Parameters: `reviewId: string`
  - Returns: `Review`
  - Throws: `UKomiApiException`, `UKomiException`

- **`getProductReviews(productId, params?)`** - Get all reviews for a product
  - Parameters:
    - `productId: string` - Product ID
    - `params?: { count?: string, page?: string, sort?: string, sortOrder?: string, stars?: string, starsSorting?: string }`
  - Returns: `ReviewResponse`
  - Throws: `UKomiApiException`, `UKomiException`

- **`getInlineReviewFormToken()`** - Get token for embedding inline review forms
  - Returns: `Record<string, string>` (token data)
  - Throws: `UKomiApiException`, `UKomiException`

- **`submitReview(productId, reviewData)`** - Legacy review submission (`reviews/{apiKey}/post`)
  - Prefer **`submitReviewV1`** for new integrations.

See also [V1 review form and submit](#v1-review-form-and-submit) below.

### Product API

Product management and product-related review data.

#### Methods

- **`getProducts(params?)`** - Get products with optional filtering
  - Parameters:
    - `fromId?: string` - Filter from product ID
    - `limit?: number` - Maximum number of products
    - `status?: string` - Filter by product status
  - Returns: `Product[]`
  - Throws: `UKomiApiException`, `UKomiException`

- **`getProductReviewSummary(productId, groupStatus?)`** - Get review summary for a product
  - Parameters:
    - `productId: string` - Product ID
    - `groupStatus?: boolean` - Include group status (default: true)
  - Returns: `ProductReviewSummary`
  - Throws: `UKomiApiException`, `UKomiException`

- **`getProductReviewMeta(productId, reviewCode)`** - Get review metadata for SEO
  - Parameters:
    - `productId: string` - Product ID
    - `reviewCode: string` - Review code identifier
  - Returns: `ProductReviewMeta` (contains JSON-LD structured data)
  - Throws: `UKomiApiException`, `UKomiException`

### Order API

Order retrieval and management.

#### Methods

- **`getOrders(params?)`** - Get orders with optional filtering
  - Parameters:
    - `from_id?: string` - Filter from order ID
    - `from_date?: string` - Filter from date (YYYY-MM-DD)
    - `count?: string` - Number of orders per page
    - `page?: string` - Page number
    - `retrieve_reviews?: string` - Include associated reviews ('1' or '0')
    - `order_id?: string` - Filter by specific order ID
  - Returns: `Order[]`
  - Throws: `UKomiApiException`, `UKomiException`

### Group API

Product group management.

#### Methods

- **`getAllGroups(params?)`** - Get all product groups
  - Parameters:
    - `fromDate?: string` - Filter groups from date (YYYY-MM-DD)
    - `updatedDate?: string` - Filter groups updated from date
  - Returns: `string[]` (array of group names)
  - Throws: `UKomiApiException`, `UKomiException`

- **`getGroupProducts(groupName)`** - Get all products in a group
  - Parameters: `groupName: string` - Group name
  - Returns: `GroupProduct[]`
  - Throws: `UKomiApiException`, `UKomiException`

### Question API

Question and Answer management for products.

#### Methods

- **`getAllQuestions(params?)`** - Get all questions with filtering
  - Parameters:
    - `grabAll?: string` - Grab all questions (default: '1')
    - `fromDate?: string` - Filter from date (YYYY-MM-DD)
    - `updatedDate?: string` - Filter by update date
    - `count?: string` - Number per page (default: '10')
    - `page?: string` - Page number (default: '1')
    - `label?: string` - Filter by label
    - `published?: string` - Filter by published status ('1' or '0')
  - Returns: `QuestionsResponse` with pagination info
  - Throws: `UKomiApiException`, `UKomiException`

- **`getProductQuestions(productId)`** - Get all questions for a product
  - Parameters: `productId: string` - Product ID
  - Returns: `Question[]`
  - Throws: `UKomiApiException`, `UKomiException`

- **`getProductQuestionCount(productId)`** - Get question count for a product
  - Parameters: `productId: string` - Product ID
  - Returns: `QuestionCount` (contains count)
  - Throws: `UKomiApiException`, `UKomiException`

## V1 review form and submit

These endpoints follow the pattern `POST /v1/{api_key}/...` with JSON bodies. They are exposed on `sdk.reviews()`.

### `getReviewFormFields(productId, options?)`

Loads product info, `form_config`, dynamic `fields`, and `labels` for building a review UI.

| Argument | Description |
|----------|-------------|
| `productId` | Product identifier (sent as `product_id`). |
| `options?.orderId` | Optional. Sent as `order_id`. When a **pending review request** exists for that order, the API sets `form_config.email_required` to `false` and omits `email` / `name` from `fields` (customer data comes from the order). |

```typescript
import type { ReviewFormFieldsData } from '@ukomi/react-native-sdk';

const data: ReviewFormFieldsData = await sdk.reviews().getReviewFormFields('PRODUCT_ID');

const fromOrder = await sdk.reviews().getReviewFormFields('PRODUCT_ID', {
  orderId: 'ORDER_ID',
});

// Useful flags / copy
const needEmail = data.form_config?.email_required !== false;
const submitLabel = data.form_config?.submit_button_text;
```

### `submitReviewV1(params)`

Submits a review; the API sends a verification email when appropriate. Use types **`ReviewSubmitV1Request`** and the success payload shape from **`ReviewSubmitV1SuccessResponse`** (see `ReviewModels`).

| Field | Notes |
|-------|--------|
| `product_id`, `score`, `review` | Required. |
| `title` | Required when enabled in account settings (see form fields). |
| `email`, `name` | Omit when `order_id` is set and a pending review request exists; server uses the order. |
| `order_id` | Optional. Same semantics as `review_form_fields`. Cannot be used with `group` in a meaningful way on the server; `order_id` wins if both are sent. |
| `group` | Optional. `"true"` for group mode (ignored if `order_id` is provided). |
| `nickname` | Optional. |
| `custom_form_ans`, `custom_form_ans_other` | Optional custom question maps. |

```typescript
// Standard flow
await sdk.reviews().submitReviewV1({
  product_id: 'PRODUCT_ID',
  score: 5,
  review: 'Great product!',
  title: 'Love it',
  email: 'user@example.com',
  name: 'Jane',
});

// Order flow (no email/name when API has marked them optional via review_form_fields)
await sdk.reviews().submitReviewV1({
  product_id: 'PRODUCT_ID',
  order_id: 'ORDER_ID',
  score: 5,
  review: 'Great product!',
  title: 'Love it',
});
```

**Responses**

- Success: `status: "success"` — method returns `data` (`verification_email_sent`, `message`, etc.).
- Validation: `status: "field_error"` — SDK throws **`UKomiFieldValidationException`** with **`fieldErrors`**: `Record<string, string>`.
- Error: `status: "error"` — throws **`UKomiApiException`** (e.g. invalid API key).

## UI components

Peer dependency: **`react-native-svg`** (for star rating / forms).

### `OrderList`

Shows customer orders and opens **`WriteReviewForm`** with both **`productId`** and **`orderId`** so the v1 APIs can hide email/name when the backend allows it.

### `WriteReviewForm`

| Prop | Description |
|------|-------------|
| `sdk` | `UKomiSDK` instance |
| `productId` | Product id |
| `orderId` | Optional; pass when reviewing from an order (same as v1 `order_id`) |
| `onClose`, `onSubmitSuccess`, `colors` | Optional UX hooks / theming |

On mount it calls **`getReviewFormFields`** (with `orderId` when set), then submits with **`submitReviewV1`**. Email and name fields are shown only when **`form_config.email_required`** is not `false`.

```tsx
import { WriteReviewForm } from '@ukomi/react-native-sdk';

<WriteReviewForm
  sdk={sdk}
  productId="PRODUCT_ID"
  orderId="ORDER_ID"
  onClose={() => {}}
/>
```

## ⚠️ Error Handling

The SDK provides a comprehensive error hierarchy:

```typescript
import {
  UKomiException,
  UKomiApiException,
  UKomiFieldValidationException,
  UKomiAuthException,
  UKomiNetworkException,
} from '@ukomi/react-native-sdk';

try {
  await sdk.authenticate();
} catch (error) {
  if (error instanceof UKomiAuthException) {
    // Handle authentication errors
    console.error('Auth error:', error.message);
  } else if (error instanceof UKomiFieldValidationException) {
    // review_submit returned status "field_error"
    console.error('Validation:', error.fieldErrors);
  } else if (error instanceof UKomiApiException) {
    // Handle API errors (includes status code)
    console.error('API error:', error.code, error.message);
  } else if (error instanceof UKomiNetworkException) {
    // Handle network errors
    console.error('Network error:', error.message);
  } else if (error instanceof UKomiException) {
    // Handle general SDK errors
    console.error('SDK error:', error.message);
  }
}
```

### Error Types

- **UKomiException** - Base exception for all SDK errors
- **UKomiApiException** - API error with status code (`error.code` contains HTTP status)
- **UKomiFieldValidationException** - Subclass of `UKomiApiException` for v1 `review_submit` validation (`status: "field_error"`). Use **`error.fieldErrors`** (`Record<string, string>`) for per-field messages.
- **UKomiAuthException** - Authentication errors (invalid credentials, expired token)
- **UKomiNetworkException** - Network connectivity errors

## 🔧 TypeScript Support

The SDK is fully typed with TypeScript. All API responses, request parameters, and models are typed:

```typescript
import { Review, Product, Order, Account } from '@ukomi/react-native-sdk';

const reviews: Review[] = (await sdk.reviews().getAllReviews()).review || [];
const products: Product[] = await sdk.productAPI().getProducts();
const orders: Order[] = await sdk.orderAPI().getOrders();
const account: Account = await sdk.account().getAccountBasic();
```

### Exported Types

All TypeScript types are exported from the main package:

- `Account`, `AccountBasic`
- `Review`, `ReviewResponse`, `ReviewSummary`, `ReviewWithOrders`
- `ReviewFormFieldsData`, `ReviewFormFieldsRequest`, `ReviewFormFieldsResponse`, `ReviewSubmitV1Request`, `ReviewSubmitV1SuccessResponse`, `ReviewSubmitV1FieldErrorResponse`, `ReviewSubmitV1ErrorResponse`
- `Product`, `ProductReviewSummary`, `ProductReviewMeta`
- `Order`, `OrdersResponse`
- `GroupProduct`
- `Question`, `QuestionsResponse`, `QuestionCount`
- `UKomiSDKConfig`
- All error classes (including `UKomiFieldValidationException`)
- `WriteReviewForm`, `WriteReviewFormProps`, `OrderList`, `OrderListProps`, `StarRating`, `ProductReviewList`, `ProductQAList`, `AskQuestionForm` (components)

## 📋 Requirements

- React Native >= 0.60.0
- React >= 16.8.0
- TypeScript >= 4.0 (optional but recommended)

### Dependencies

- `axios` ^1.6.0 - HTTP client

### Peer Dependencies

- `react` >= 16.8.0
- `react-native` >= 0.60.0
- `react-native-svg` >= 15.15.1 (required if you use bundled UI components such as `WriteReviewForm` or `OrderList`)

## 🔐 Authentication

The SDK uses API Key and API Secret for authentication. After calling `authenticate()`, the access token is automatically stored and used for subsequent API calls.

You can also manually set an access token if you already have one:

```typescript
sdk.setAccessToken('your-access-token');
```

Check authentication status:

```typescript
if (sdk.isAuthenticated()) {
  // Make API calls
}
```

## 📝 Example: Complete Usage

```typescript
import { UKomiSDK, UKomiAuthException } from '@ukomi/react-native-sdk';

async function useUkomiSDK() {
  // Initialize SDK
  const sdk = new UKomiSDK({
    apiKey: 'your-api-key',
    apiSecret: 'your-api-secret',
  });

  try {
    // Authenticate
    await sdk.authenticate();

    // Get account info
    const account = await sdk.account().getAccountBasic();
    console.log('Account:', account.name);

    // Get reviews
    const reviews = await sdk.reviews().getAllReviews({
      count: '20',
      page: '1',
      sort: 'date',
      sortOrder: 'desc',
    });

    // Get products
    const products = await sdk.productAPI().getProducts({
      limit: 10,
    });

    // Get orders
    const orders = await sdk.orderAPI().getOrders({
      count: '10',
    });

    // Get groups
    const groups = await sdk.groups().getAllGroups();

    // Get questions
    const questions = await sdk.questions().getAllQuestions({
      count: '10',
    });

    return {
      account,
      reviews: reviews.review || [],
      products,
      orders,
      groups,
      questions: questions.questions || [],
    };
  } catch (error) {
    if (error instanceof UKomiAuthException) {
      console.error('Authentication failed');
    } else {
      console.error('Error:', error);
    }
    throw error;
  }
}
```

## 📄 License

Apache-2.0

## 💬 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.
