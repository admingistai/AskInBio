'use server'

import { generateText, streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { AISearchRequest, AISearchResponse } from '@/types/ai'
import { parseAIResponse, extractSuggestedQuestions } from '@/lib/ai/response-parser'

/**
 * Server action for AI search with streaming support
 */
export async function searchWithAI(request: AISearchRequest): Promise<AISearchResponse> {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    // Build system message with user context
    const systemMessage = buildSystemMessage(request)
    
    // Create completion with AI SDK
    const { text, usage } = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemMessage,
      prompt: request.query,
      temperature: 0.7,
      maxTokens: 1000,
    })

    const content = text
    
    // Parse the response for structured content
    const parsedContent = parseAIResponse(content, request.context)
    
    // Extract suggested questions
    const suggestedQuestions = extractSuggestedQuestions(content)
    
    return {
      content,
      contentType: parsedContent.type,
      suggestedQuestions,
      metadata: {
        parsedContent: parsedContent.data,
        usage: usage
      }
    }
  } catch (error) {
    console.error('AI search error:', error)
    
    // Return a friendly error response
    return {
      content: 'I apologize, but I encountered an issue processing your request. Please try again or rephrase your question.',
      contentType: 'text',
      suggestedQuestions: [
        'Tell me about yourself',
        'How can I contact you?',
        'What services do you offer?'
      ],
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

/**
 * Streaming version of AI search
 */
export async function streamAISearch(request: AISearchRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const systemMessage = buildSystemMessage(request)
    
    const stream = await streamText({
      model: openai('gpt-4o-mini'),
      system: systemMessage,
      prompt: request.query,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return stream
  } catch (error) {
    console.error('AI streaming error:', error)
    throw error
  }
}

/**
 * Build system message with user context
 */
function buildSystemMessage(request: AISearchRequest): string {
  const { context } = request
  
  let systemMessage = `You are an AI assistant representing ${context?.user?.displayName || request.username}'s profile page. `
  
  // Add user information
  if (context?.user) {
    if (context.user.bio) {
      systemMessage += `Their bio states: "${context.user.bio}". `
    }
  }
  
  // Add links information
  if (context?.links && context.links.length > 0) {
    systemMessage += `They have the following links: ${context.links.map(link => `${link.title} (${link.url})`).join(', ')}. `
  }
  
  // Add social media information
  if (context?.socialLinks && context.socialLinks.length > 0) {
    systemMessage += `Their social media profiles include: ${context.socialLinks.map(social => `${social.displayName} (${social.url})`).join(', ')}. `
  }
  
  systemMessage += `

IMPORTANT: Format your responses for dynamic UI generation. You can use these content type markers:

- [CARDS] for showcasing services, products, or links as cards
- [CAROUSEL] for image galleries, video playlists, or media showcases  
- [ACCORDION] for FAQs, detailed explanations, or Q&A format
- [TABS] for multi-topic responses or categorized information
- [CONTACT] for contact information and ways to reach them

You can also include structured JSON data in markdown code blocks like this:
\`\`\`json
{
  "title": "Services",
  "cards": [
    {"title": "Service 1", "description": "Description", "url": "link"}
  ]
}
\`\`\`

Always end your response with 2-4 suggested follow-up questions that users might ask, formatted as:

Suggested questions:
- Question 1
- Question 2  
- Question 3
- Question 4

Be helpful, conversational, and provide accurate information based on their profile. If asked about something not in their profile, politely redirect to what you do know about them.`

  return systemMessage
}

/**
 * Generate contextual suggested questions based on user profile
 */
export async function generateSuggestedQuestions(
  username: string,
  context?: AISearchRequest['context']
): Promise<string[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return [
        'Tell me about yourself',
        'How can I contact you?',
        'What do you do?',
        'Show me your work'
      ]
    }

    const systemMessage = `Generate 4 relevant questions someone might ask about ${context?.user?.displayName || username} based on their profile. 
    
    ${context?.user?.bio ? `Bio: ${context.user.bio}` : ''}
    ${context?.links?.length ? `Links: ${context.links.map(l => l.title).join(', ')}` : ''}
    ${context?.socialLinks?.length ? `Social: ${context.socialLinks.map(s => s.displayName).join(', ')}` : ''}
    
    Return only the questions, one per line, without numbers or bullets.`

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemMessage,
      prompt: '',
      temperature: 0.8,
      maxTokens: 200
    })

    const content = text
    const questions = content
      .split('\n')
      .map((q: string) => q.trim())
      .filter((q: string) => q.length > 0)
      .slice(0, 4)
    
    return questions.length > 0 ? questions : [
      'Tell me about yourself',
      'How can I contact you?',
      'What services do you offer?',
      'Show me your latest work'
    ]
  } catch (error) {
    console.error('Error generating suggested questions:', error)
    return [
      'Tell me about yourself',
      'How can I contact you?',
      'What do you do?',
      'Show me your work'
    ]
  }
}