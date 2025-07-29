'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ChevronLeft, ChevronRight, Mail, Globe, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  GenerativeContent as GenerativeContentType, 
  CardContent, 
  CarouselContent, 
  AccordionContent as AccordionContentType, 
  TabsContent, 
  ContactContent 
} from '@/types/ai'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { 
  Tabs, 
  TabsContent as TabsContentComponent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'

interface GenerativeContentProps {
  content: GenerativeContentType
  isStreaming?: boolean
  className?: string
}

export default function GenerativeContent({
  content,
  isStreaming = false,
  className
}: GenerativeContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("w-full", className)}
    >
      <AnimatePresence mode="wait">
        {content.type === 'text' && (
          <TextRenderer 
            key="text"
            content={content.data.content} 
            isStreaming={isStreaming} 
          />
        )}
        {content.type === 'cards' && (
          <CardsRenderer 
            key="cards"
            data={content.data as CardContent['data']} 
          />
        )}
        {content.type === 'carousel' && (
          <CarouselRenderer 
            key="carousel"
            data={content.data as CarouselContent['data']} 
          />
        )}
        {content.type === 'accordion' && (
          <AccordionRenderer 
            key="accordion"
            data={content.data as AccordionContentType['data']} 
          />
        )}
        {content.type === 'tabs' && (
          <TabsRenderer 
            key="tabs"
            data={content.data as TabsContent['data']} 
          />
        )}
        {content.type === 'contact' && (
          <ContactRenderer 
            key="contact"
            data={content.data as ContactContent['data']} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Text Content Renderer
function TextRenderer({ 
  content, 
  isStreaming 
}: { 
  content: string
  isStreaming: boolean 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card-dark p-6 rounded-2xl"
    >
      <div className="prose prose-invert max-w-none">
        <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-1 h-4 bg-white/60 ml-1"
            />
          )}
        </p>
      </div>
    </motion.div>
  )
}

// Cards Content Renderer
function CardsRenderer({ data }: { data: CardContent['data'] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {data.title && (
        <h3 className="text-xl font-semibold text-white/90">{data.title}</h3>
      )}
      {data.description && (
        <p className="text-white/70">{data.description}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card-dark p-4 rounded-xl hover:bg-white/5 transition-colors group"
          >
            {card.badge && (
              <span className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-lg mb-2">
                {card.badge}
              </span>
            )}
            <h4 className="font-medium text-white/90 mb-2">{card.title}</h4>
            <p className="text-sm text-white/70 mb-3">{card.description}</p>
            {card.url && (
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-1 duration-200"
              >
                Learn more
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Carousel Content Renderer
function CarouselRenderer({ data }: { data: CarouselContent['data'] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % data.items.length)
  }
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + data.items.length) % data.items.length)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {data.title && (
        <h3 className="text-xl font-semibold text-white/90">{data.title}</h3>
      )}
      {data.description && (
        <p className="text-white/70">{data.description}</p>
      )}
      
      <div className="relative glass-card-dark rounded-2xl overflow-hidden">
        <div className="relative h-64 md:h-80">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10"
            >
              <div className="text-center p-6">
                <h4 className="text-lg font-medium text-white/90 mb-2">
                  {data.items[currentIndex]?.title}
                </h4>
                {data.items[currentIndex]?.description && (
                  <p className="text-white/70">
                    {data.items[currentIndex].description}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Navigation */}
        {data.items.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {data.items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentIndex ? "bg-white" : "bg-white/40"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

// Accordion Content Renderer
function AccordionRenderer({ data }: { data: AccordionContentType['data'] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {data.title && (
        <h3 className="text-xl font-semibold text-white/90">{data.title}</h3>
      )}
      {data.description && (
        <p className="text-white/70">{data.description}</p>
      )}
      
      <div className="glass-card-dark rounded-2xl overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
          {data.items.map((item, index) => (
            <AccordionItem 
              key={item.id} 
              value={item.id}
              className="border-white/10"
            >
              <AccordionTrigger className="px-6 py-4 text-white/90 hover:text-white hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/70">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.div>
  )
}

// Tabs Content Renderer
function TabsRenderer({ data }: { data: TabsContent['data'] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {data.title && (
        <h3 className="text-xl font-semibold text-white/90">{data.title}</h3>
      )}
      {data.description && (
        <p className="text-white/70">{data.description}</p>
      )}
      
      <div className="glass-card-dark rounded-2xl p-6">
        <Tabs defaultValue={data.tabs[0]?.id} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/5">
            {data.tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {data.tabs.map((tab) => (
            <TabsContentComponent 
              key={tab.id} 
              value={tab.id}
              className="mt-4 text-white/80"
            >
              {tab.content}
            </TabsContentComponent>
          ))}
        </Tabs>
      </div>
    </motion.div>
  )
}

// Contact Content Renderer
function ContactRenderer({ data }: { data: ContactContent['data'] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-5 w-5" />
      case 'website': return <Globe className="h-5 w-5" />
      default: return <User className="h-5 w-5" />
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {data.title && (
        <h3 className="text-xl font-semibold text-white/90">{data.title}</h3>
      )}
      {data.description && (
        <p className="text-white/70">{data.description}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.methods.map((method, index) => (
          <motion.a
            key={method.id}
            href={method.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card-dark p-4 rounded-xl hover:bg-white/5 transition-colors group block"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 p-2 rounded-lg bg-white/10">
                {getIcon(method.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white/90 group-hover:text-white transition-colors">
                  {method.label}
                </p>
                <p className="text-sm text-white/60 truncate">
                  {method.value}
                </p>
                {method.preferred && (
                  <span className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-lg mt-1">
                    Preferred
                  </span>
                )}
              </div>
              <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors" />
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  )
}