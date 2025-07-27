'use client'

export default function GlassCriticalStyles() {
  return (
    <style jsx global>{`
      .glass-critical {
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      @supports not (backdrop-filter: blur(20px)) {
        .glass-critical {
          background: rgba(0, 0, 0, 0.85);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
      }
    `}</style>
  )
}