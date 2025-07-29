export interface AISearchRequest {
  query: string
  username: string
  context?: {
    user: {
      displayName?: string | null
      bio?: string | null
      avatar?: string | null
    }
    links: Array<{
      id: string
      title: string
      url: string
      platform?: string
    }>
    socialLinks: Array<{
      platform: string
      url: string
      displayName: string
    }>
  }
}

export interface AISearchResponse {
  content: string
  contentType: ContentType
  suggestedQuestions: string[]
  metadata?: Record<string, any>
}

export type ContentType = 
  | 'text'
  | 'cards'
  | 'carousel'
  | 'accordion'
  | 'tabs'
  | 'contact'

export interface GenerativeContent {
  type: ContentType
  data: any
  metadata?: Record<string, any>
}

// Card content for showcasing links, services, etc.
export interface CardContent {
  type: 'cards'
  data: {
    title?: string
    description?: string
    cards: Array<{
      id: string
      title: string
      description: string
      image?: string
      url?: string
      badge?: string
      metadata?: Record<string, any>
    }>
  }
}

// Carousel content for media galleries
export interface CarouselContent {
  type: 'carousel'
  data: {
    title?: string
    description?: string
    items: Array<{
      id: string
      title: string
      description?: string
      image: string
      url?: string
      type: 'image' | 'video' | 'link'
      metadata?: Record<string, any>
    }>
  }
}

// Accordion content for FAQ-style information
export interface AccordionContent {
  type: 'accordion'
  data: {
    title?: string
    description?: string
    items: Array<{
      id: string
      question: string
      answer: string
      metadata?: Record<string, any>
    }>
  }
}

// Tabs content for multi-topic responses
export interface TabsContent {
  type: 'tabs'
  data: {
    title?: string
    description?: string
    tabs: Array<{
      id: string
      label: string
      content: string
      metadata?: Record<string, any>
    }>
  }
}

// Contact content for contact information
export interface ContactContent {
  type: 'contact'
  data: {
    title?: string
    description?: string
    methods: Array<{
      id: string
      type: 'email' | 'social' | 'website' | 'phone'
      label: string
      value: string
      url: string
      icon?: string
      preferred?: boolean
    }>
  }
}

// Union type for all content types
export type ParsedContent = 
  | CardContent
  | CarouselContent
  | AccordionContent
  | TabsContent
  | ContactContent

// Search state management
export interface SearchState {
  query: string
  isLoading: boolean
  response: AISearchResponse | null
  error: string | null
  suggestedQuestions: string[]
}

// OpenAI streaming response chunk
export interface StreamChunk {
  content: string
  done: boolean
}

// Content type detection markers
export const CONTENT_MARKERS = {
  CARDS: '[CARDS]',
  CAROUSEL: '[CAROUSEL]',
  ACCORDION: '[ACCORDION]',
  TABS: '[TABS]',
  CONTACT: '[CONTACT]'
} as const

// Default suggested questions
export const DEFAULT_SUGGESTED_QUESTIONS = [
  "Tell me about yourself",
  "How can I contact you?",
  "What services do you offer?",
  "Show me your latest work"
] as const