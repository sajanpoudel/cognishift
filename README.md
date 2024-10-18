# CogniShift: AI-Powered Content Generation and Humanization

CogniShift is an advanced web application that leverages multiple AI models to generate, humanize, and analyze text content. It provides a user-friendly interface for managing conversations, customizing AI responses, and detecting AI-generated content.

## Features

- **Multi-Model AI Generation**: Supports OpenAI and Google's Gemini AI models for content generation.
- **Content Humanization**: Utilizes Undetectable AI to make AI-generated content more human-like.
- **AI Detection**: Integrates with Sapling AI to detect the likelihood of content being AI-generated.
- **Chat Management**: Organize conversations into folders and manage multiple chats.
- **Real-time Content Generation**: Generate AI responses and humanize them in real-time.
- **User Authentication**: Secure user authentication powered by Clerk.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing.
- **Responsive Design**: Works seamlessly across desktop and mobile devices.

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Clerk for authentication
- OpenAI API
- Google Generative AI (Gemini)
- Undetectable AI API
- Sapling AI API

## Getting Started

1. Clone the repository:   ```
   git clone https://github.com/your-username/cognishift.git
   cd cognishift   ```

2. Install dependencies:   ```
   npm install   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_UNDETECTABLE_AI_API_KEY=your_undetectable_ai_api_key
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_SAPLING_AI_API_KEY=your_sapling_ai_api_key   ```

4. Run the development server:   ```
   npm run dev   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Sign in using Clerk authentication.
2. Create a new chat or select an existing one from the sidebar.
3. Choose an AI model (OpenAI or Gemini) for content generation.
4. Enter your prompt and generate AI content.
5. View the original AI response and its humanized version.
6. Check the AI detection score for both versions.
7. Organize your chats into folders for better management.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
