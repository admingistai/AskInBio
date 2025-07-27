'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ExternalLink, ToggleLeft, ToggleRight, Edit, Trash2, BarChart2 } from 'lucide-react'
import { Link } from '@prisma/client'
import { reorderLinks, toggleLinkStatus, deleteLink } from '@/app/actions/links'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface LinkListProps {
  links: Link[]
  onEdit: (link: Link) => void
  onRefresh: () => void
}

interface SortableLinkProps {
  link: Link
  onEdit: (link: Link) => void
  onToggle: (linkId: string) => void
  onDelete: (linkId: string) => void
}

function SortableLink({ link, onEdit, onToggle, onDelete }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "link-card p-4",
        isDragging && "dragging z-50"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button
          className="touch-none text-white/40 hover:text-white/60 transition-colors cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        
        {/* Thumbnail/Emoji */}
        {link.thumbnail && (
          <div className="h-10 w-10 glass-card flex items-center justify-center text-xl flex-shrink-0">
            {link.thumbnail}
          </div>
        )}
        
        {/* Link Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{link.title}</h3>
          <p className="text-sm text-white/60 truncate">{link.url}</p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Click Count */}
          <div className="stat-pill flex items-center gap-1">
            <BarChart2 className="h-3 w-3" />
            <span className="text-xs font-medium">{link.clicks}</span>
          </div>
          
          {/* Toggle Active */}
          <button
            onClick={() => onToggle(link.id)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              link.active 
                ? "text-green-400 hover:bg-green-400/20" 
                : "text-white/40 hover:bg-white/10"
            )}
            title={link.active ? "Deactivate link" : "Activate link"}
          >
            {link.active ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </button>
          
          {/* Edit */}
          <button
            onClick={() => onEdit(link)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Edit link"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          {/* View */}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Open link"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          
          {/* Delete */}
          <button
            onClick={() => onDelete(link.id)}
            className="p-2 rounded-lg glass-delete"
            title="Delete link"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LinkList({ links, onEdit, onRefresh }: LinkListProps) {
  const [items, setItems] = useState(links)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isReordering, setIsReordering] = useState(false)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      
      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)
      
      // Save new order to database
      setIsReordering(true)
      try {
        const linkIds = newItems.map(item => item.id)
        const result = await reorderLinks(linkIds)
        
        if (result.error) {
          toast.error(result.error)
          // Revert on error
          setItems(links)
        } else {
          toast.success('Links reordered')
          onRefresh()
        }
      } catch (error) {
        toast.error('Failed to reorder links')
        // Revert on error
        setItems(links)
      } finally {
        setIsReordering(false)
      }
    }
    
    setActiveId(null)
  }
  
  const handleToggle = async (linkId: string) => {
    try {
      const result = await toggleLinkStatus(linkId)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.message || 'Link status updated')
        onRefresh()
      }
    } catch (error) {
      toast.error('Failed to toggle link status')
    }
  }
  
  const handleDelete = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return
    }
    
    try {
      const result = await deleteLink(linkId)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.message || 'Link deleted')
        onRefresh()
      }
    } catch (error) {
      toast.error('Failed to delete link')
    }
  }
  
  // Update items when links prop changes
  if (links !== items && !activeId && !isReordering) {
    setItems(links)
  }
  
  const activeItem = activeId ? items.find(item => item.id === activeId) : null
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((link) => (
            <SortableLink
              key={link.id}
              link={link}
              onEdit={onEdit}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeItem ? (
          <div className="link-card p-4 drag-ghost">
            <div className="flex items-center gap-3">
              <GripVertical className="h-5 w-5 text-white/40" />
              {activeItem.thumbnail && (
                <div className="h-10 w-10 glass-card flex items-center justify-center text-xl">
                  {activeItem.thumbnail}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-white">{activeItem.title}</h3>
                <p className="text-sm text-white/60">{activeItem.url}</p>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}