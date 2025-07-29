'use client'

import { useState, useEffect, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { User, Theme } from '@prisma/client'
import { searchWithAI, generateSuggestedQuestions } from '@/app/actions/ai-search'
import { parseAIResponse } from '@/lib/ai/response-parser'
import { AISearchRequest, AISearchResponse, SearchState } from '@/types/ai'
import { SocialPlatform } from '@/lib/utils/social-detection'
import AISearchBar from './AISearchBar'
import GenerativeContent from './GenerativeContent'
import SuggestedQuestions, { SuggestedQuestionsSkeleton } from './SuggestedQuestions'

interface AISearchInterfaceProps {
  user: User & {
    links: Array<{
      id: string
      title: string
      url: string
      active: boolean
    }>
  }
  theme: Theme | null
  socialLinks: Array<SocialPlatform & { id: string; title: string }>
}

export default function AISearchInterface({ 
  user, 
  theme, 
  socialLinks 
}: AISearchInterfaceProps) {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isLoading: false,
    response: null,
    error: null,
    suggestedQuestions: []
  })
  
  const [initialSuggestedQuestions, setInitialSuggestedQuestions] = useState<string[]>([])
  const [isLoadingInitialQuestions, setIsLoadingInitialQuestions] = useState(true)

  // Build user context for AI
  const userContext = useMemo(() => ({
    user: {
      displayName: user.displayName,
      bio: user.bio,
      avatar: user.avatar
    },
    links: user.links
      .filter(link => link.active)
      .map(link => ({
        id: link.id,
        title: link.title,
        url: link.url
      })),
    socialLinks: socialLinks.map(social => ({
      platform: social.platform,
      url: social.url,
      displayName: social.displayName
    }))
  }), [user.displayName, user.bio, user.avatar, user.links, socialLinks])

  // Load initial suggested questions
  useEffect(() => {
    const loadInitialQuestions = async () => {
      try {
        const questions = await generateSuggestedQuestions(user.username, userContext)
        setInitialSuggestedQuestions(questions)
        setSearchState(prev => ({ ...prev, suggestedQuestions: questions }))
      } catch (error) {
        console.error('Failed to load initial questions:', error)
        // Use fallback questions
        const fallbackQuestions = [
          'Tell me about yourself',
          'How can I contact you?',
          'What do you do?',
          'Show me your work'
        ]
        setInitialSuggestedQuestions(fallbackQuestions)
        setSearchState(prev => ({ ...prev, suggestedQuestions: fallbackQuestions }))
      } finally {
        setIsLoadingInitialQuestions(false)
      }
    }

    loadInitialQuestions()
  }, [user.username, userContext])

  // Handle search submission
  const handleSearch = async (query: string) => {
    setSearchState(prev => ({
      ...prev,
      query,
      isLoading: true,
      error: null
    }))

    try {
      const request: AISearchRequest = {
        query,
        username: user.username,
        context: userContext
      }

      const response = await searchWithAI(request)
      
      // Parse the response for structured content
      const parsedContent = parseAIResponse(response.content, userContext)
      
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        response: {
          ...response,
          contentType: parsedContent.type,
          metadata: {
            ...response.metadata,
            parsedContent: parsedContent.data
          }
        },
        suggestedQuestions: response.suggestedQuestions.length > 0 
          ? response.suggestedQuestions 
          : initialSuggestedQuestions
      }))
    } catch (error) {
      console.error('Search error:', error)
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to process your question. Please try again.',
        suggestedQuestions: initialSuggestedQuestions
      }))
    }
  }

  // Handle suggested question click
  const handleQuestionClick = (question: string) => {
    handleSearch(question)
  }

  // Clear search and return to initial state
  const handleClearSearch = () => {
    setSearchState(prev => ({
      ...prev,
      query: '',
      response: null,
      error: null,
      suggestedQuestions: initialSuggestedQuestions
    }))
  }

  return (
    <div className="space-y-6">
      {/* AI Search Bar */}
      <AISearchBar
        onSearch={handleSearch}
        isLoading={searchState.isLoading}
        error={searchState.error}
        username={user.username}
      />

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {searchState.response && (
          <div className="space-y-6">
            {/* Generated Content */}
            <GenerativeContent
              content={{
                type: searchState.response.contentType,
                data: searchState.response.metadata?.parsedContent || { 
                  content: searchState.response.content 
                }
              }}
              isStreaming={searchState.isLoading}
            />

            {/* Clear Search Button */}
            <div className="flex justify-center">
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 text-sm text-white/60 hover:text-white/80 transition-colors"
              >
                Ask something else
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Default Welcome State */}
      {!searchState.response && !searchState.isLoading && (
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="glass-card-dark p-8 rounded-2xl text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white/90">
                  Ask me anything about {user.displayName || `@${user.username}`}
                </h3>
                <p className="text-white/60 max-w-md mx-auto">
                  I can help you learn more about their work, interests, and how to get in touch.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Questions */}
      {!searchState.isLoading && (
        <div>
          {isLoadingInitialQuestions ? (
            <SuggestedQuestionsSkeleton />
          ) : (
            <SuggestedQuestions
              questions={searchState.suggestedQuestions}
              onQuestionClick={handleQuestionClick}
              isLoading={searchState.isLoading}
            />
          )}
        </div>
      )}
    </div>
  )
}