import { 
  GenerativeContent, 
  ContentType, 
  ParsedContent,
  CONTENT_MARKERS,
  CardContent,
  CarouselContent,
  AccordionContent,
  TabsContent,
  ContactContent
} from '@/types/ai'

/**
 * Detects content type from AI response using markers or content analysis
 */
export function detectContentType(content: string): ContentType {
  const upperContent = content.toUpperCase()
  
  // Check for explicit markers first
  if (upperContent.includes(CONTENT_MARKERS.CARDS)) return 'cards'
  if (upperContent.includes(CONTENT_MARKERS.CAROUSEL)) return 'carousel'
  if (upperContent.includes(CONTENT_MARKERS.ACCORDION)) return 'accordion'
  if (upperContent.includes(CONTENT_MARKERS.TABS)) return 'tabs'
  if (upperContent.includes(CONTENT_MARKERS.CONTACT)) return 'contact'
  
  // Auto-detect based on content patterns
  const lowerContent = content.toLowerCase()
  
  // Contact patterns
  if (lowerContent.includes('contact') || 
      lowerContent.includes('email') || 
      lowerContent.includes('reach me') ||
      lowerContent.includes('get in touch')) {
    return 'contact'
  }
  
  // Card patterns (services, products, links)
  if (lowerContent.includes('services') ||
      lowerContent.includes('products') ||
      lowerContent.includes('offerings') ||
      lowerContent.includes('portfolio')) {
    return 'cards'
  }
  
  // Carousel patterns (media, gallery, showcase)
  if (lowerContent.includes('gallery') ||
      lowerContent.includes('showcase') ||
      lowerContent.includes('images') ||
      lowerContent.includes('videos') ||
      lowerContent.includes('media')) {
    return 'carousel'
  }
  
  // FAQ/Accordion patterns
  if (lowerContent.includes('frequently asked') ||
      lowerContent.includes('questions') ||
      lowerContent.includes('faq') ||
      content.includes('?') && content.split('?').length > 2) {
    return 'accordion'
  }
  
  // Default to text
  return 'text'
}

/**
 * Extracts structured data from AI response using JSON blocks
 */
export function extractStructuredData(content: string): any {
  try {
    // Look for JSON blocks in markdown
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1])
    }
    
    // Look for plain JSON blocks
    const plainJsonMatch = content.match(/\{[\s\S]*\}/)
    if (plainJsonMatch) {
      return JSON.parse(plainJsonMatch[0])
    }
    
    return null
  } catch (error) {
    console.warn('Failed to parse structured data from AI response:', error)
    return null
  }
}

/**
 * Generates card content from AI response
 */
export function generateCardContent(content: string, structuredData?: any): CardContent {
  const cards = structuredData?.cards || [
    {
      id: '1',
      title: 'Learn More',
      description: 'Get more information about this topic',
      url: '#',
      badge: 'Info'
    }
  ]
  
  return {
    type: 'cards',
    data: {
      title: structuredData?.title || 'Related Information',
      description: structuredData?.description || content.split('\n')[0],
      cards
    }
  }
}

/**
 * Generates carousel content from AI response
 */
export function generateCarouselContent(content: string, structuredData?: any): CarouselContent {
  const items = structuredData?.items || [
    {
      id: '1',
      title: 'Featured Content',
      description: 'Placeholder media content',
      image: 'https://via.placeholder.com/300x200',
      type: 'image' as const
    }
  ]
  
  return {
    type: 'carousel',
    data: {
      title: structuredData?.title || 'Media Gallery',
      description: structuredData?.description || content.split('\n')[0],
      items
    }
  }
}

/**
 * Generates accordion content from AI response
 */
export function generateAccordionContent(content: string, structuredData?: any): AccordionContent {
  const items = structuredData?.items || parseQAFromContent(content)
  
  return {
    type: 'accordion',
    data: {
      title: structuredData?.title || 'Frequently Asked Questions',
      description: structuredData?.description,
      items
    }
  }
}

/**
 * Generates tabs content from AI response
 */
export function generateTabsContent(content: string, structuredData?: any): TabsContent {
  const tabs = structuredData?.tabs || [
    {
      id: '1',
      label: 'Overview',
      content: content
    }
  ]
  
  return {
    type: 'tabs',
    data: {
      title: structuredData?.title || 'Information',
      description: structuredData?.description,
      tabs
    }
  }
}

/**
 * Generates contact content from AI response and user context
 */
export function generateContactContent(
  content: string, 
  userContext?: any,
  structuredData?: any
): ContactContent {
  const methods = structuredData?.methods || generateContactMethods(userContext)
  
  return {
    type: 'contact',
    data: {
      title: structuredData?.title || 'Get In Touch',
      description: structuredData?.description || content.split('\n')[0],
      methods
    }
  }
}

/**
 * Parses Q&A from content for accordion
 */
function parseQAFromContent(content: string) {
  const lines = content.split('\n').filter(line => line.trim())
  const items = []
  
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim()
    if (line.includes('?')) {
      items.push({
        id: `qa-${i}`,
        question: line.replace(/^\d+\.\s*/, ''),
        answer: lines[i + 1]?.trim() || 'More information coming soon.'
      })
    }
  }
  
  // Fallback if no Q&A found
  if (items.length === 0) {
    items.push({
      id: 'default',
      question: 'What can you tell me?',
      answer: content
    })
  }
  
  return items
}

/**
 * Generates contact methods from user context
 */
function generateContactMethods(userContext?: any) {
  const methods = []
  
  // Add social links
  if (userContext?.socialLinks) {
    userContext.socialLinks.forEach((social: any, index: number) => {
      methods.push({
        id: `social-${index}`,
        type: 'social' as const,
        label: social.displayName,
        value: social.platform,
        url: social.url,
        icon: social.platform,
        preferred: index === 0
      })
    })
  }
  
  // Add website links
  if (userContext?.links) {
    userContext.links.slice(0, 2).forEach((link: any, index: number) => {
      methods.push({
        id: `link-${index}`,
        type: 'website' as const,
        label: link.title,
        value: link.url,
        url: link.url
      })
    })
  }
  
  return methods
}

/**
 * Extracts suggested questions from AI response
 */
export function extractSuggestedQuestions(content: string): string[] {
  try {
    // Look for suggested questions in various formats
    const patterns = [
      /suggested questions?:?\s*([\s\S]*?)(?:\n\n|\n$|$)/i,
      /follow-?up questions?:?\s*([\s\S]*?)(?:\n\n|\n$|$)/i,
      /you might also ask:?\s*([\s\S]*?)(?:\n\n|\n$|$)/i
    ]
    
    for (const pattern of patterns) {
      const match = content.match(pattern)
      if (match) {
        const questionsText = match[1]
        const questions = questionsText
          .split('\n')
          .map(q => q.replace(/^[-*]\s*/, '').trim())
          .filter(q => q.length > 0)
          .slice(0, 4) // Max 4 questions
        
        if (questions.length > 0) {
          return questions
        }
      }
    }
    
    return []
  } catch (error) {
    console.warn('Failed to extract suggested questions:', error)
    return []
  }
}

/**
 * Main parser function that converts AI response to structured content
 */
export function parseAIResponse(
  content: string, 
  userContext?: any
): GenerativeContent {
  const contentType = detectContentType(content)
  const structuredData = extractStructuredData(content)
  
  let parsedContent: ParsedContent
  
  switch (contentType) {
    case 'cards':
      parsedContent = generateCardContent(content, structuredData)
      break
    case 'carousel':
      parsedContent = generateCarouselContent(content, structuredData)
      break
    case 'accordion':
      parsedContent = generateAccordionContent(content, structuredData)
      break
    case 'tabs':
      parsedContent = generateTabsContent(content, structuredData)
      break
    case 'contact':
      parsedContent = generateContactContent(content, userContext, structuredData)
      break
    default:
      // For text content, return as-is
      return {
        type: 'text',
        data: { content },
        metadata: { structuredData }
      }
  }
  
  return {
    type: parsedContent.type,
    data: parsedContent.data,
    metadata: { 
      originalContent: content,
      structuredData,
      userContext
    }
  }
}