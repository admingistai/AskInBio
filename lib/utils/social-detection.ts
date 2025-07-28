/**
 * Social Platform Detection Utility
 * 
 * Detects social media platforms from URLs and returns appropriate metadata
 * for displaying social icons in the profile header.
 */

export interface SocialPlatform {
  name: string
  platform: 'twitter' | 'linkedin' | 'github' | 'instagram' | 'youtube' | 'tiktok'
  url: string
  displayName: string
}

/**
 * Detects social platform from URL and returns platform metadata
 */
export function detectSocialPlatform(url: string): SocialPlatform | null {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase().replace('www.', '')
    
    // Twitter/X detection
    if (hostname === 'twitter.com' || hostname === 'x.com') {
      return {
        name: 'Twitter',
        platform: 'twitter',
        url,
        displayName: 'Twitter/X'
      }
    }
    
    // LinkedIn detection
    if (hostname === 'linkedin.com' || hostname.includes('linkedin.com')) {
      return {
        name: 'LinkedIn',
        platform: 'linkedin',
        url,
        displayName: 'LinkedIn'
      }
    }
    
    // GitHub detection
    if (hostname === 'github.com') {
      return {
        name: 'GitHub',
        platform: 'github',
        url,
        displayName: 'GitHub'
      }
    }
    
    // Instagram detection
    if (hostname === 'instagram.com' || hostname.includes('instagram.com')) {
      return {
        name: 'Instagram', 
        platform: 'instagram',
        url,
        displayName: 'Instagram'
      }
    }
    
    // YouTube detection
    if (hostname === 'youtube.com' || hostname === 'youtu.be' || hostname.includes('youtube.com')) {
      return {
        name: 'YouTube',
        platform: 'youtube', 
        url,
        displayName: 'YouTube'
      }
    }
    
    // TikTok detection
    if (hostname === 'tiktok.com' || hostname.includes('tiktok.com')) {
      return {
        name: 'TikTok',
        platform: 'tiktok',
        url,
        displayName: 'TikTok'
      }
    }
    
    return null
  } catch (error) {
    // Invalid URL
    return null
  }
}

/**
 * Filters and extracts social links from a links array
 * Returns both social links and remaining non-social links
 */
export function separateSocialLinks(links: Array<{ id: string; url: string; title: string; [key: string]: any }>) {
  const socialLinks: Array<SocialPlatform & { id: string; title: string }> = []
  const regularLinks: Array<{ id: string; url: string; title: string; [key: string]: any }> = []
  
  for (const link of links) {
    const socialPlatform = detectSocialPlatform(link.url)
    
    if (socialPlatform) {
      socialLinks.push({
        ...socialPlatform,
        id: link.id,
        title: link.title
      })
    } else {
      regularLinks.push(link)
    }
  }
  
  // Limit to 6 social icons max
  return {
    socialLinks: socialLinks.slice(0, 6),
    regularLinks
  }
}

/**
 * Gets the appropriate color scheme for each social platform
 */
export function getSocialPlatformColors(platform: SocialPlatform['platform']) {
  const colors = {
    twitter: {
      bg: 'rgba(29, 161, 242, 0.1)',
      border: 'rgba(29, 161, 242, 0.2)',
      text: 'rgb(29, 161, 242)',
      hover: 'rgba(29, 161, 242, 0.15)'
    },
    linkedin: {
      bg: 'rgba(10, 102, 194, 0.1)',
      border: 'rgba(10, 102, 194, 0.2)', 
      text: 'rgb(10, 102, 194)',
      hover: 'rgba(10, 102, 194, 0.15)'
    },
    github: {
      bg: 'rgba(88, 96, 105, 0.1)',
      border: 'rgba(88, 96, 105, 0.2)',
      text: 'rgb(240, 246, 252)',
      hover: 'rgba(88, 96, 105, 0.15)'
    },
    instagram: {
      bg: 'rgba(225, 48, 108, 0.1)',
      border: 'rgba(225, 48, 108, 0.2)',
      text: 'rgb(225, 48, 108)',
      hover: 'rgba(225, 48, 108, 0.15)'
    },
    youtube: {
      bg: 'rgba(255, 0, 0, 0.1)',
      border: 'rgba(255, 0, 0, 0.2)',
      text: 'rgb(255, 0, 0)',
      hover: 'rgba(255, 0, 0, 0.15)'
    },
    tiktok: {
      bg: 'rgba(255, 0, 80, 0.1)',
      border: 'rgba(255, 0, 80, 0.2)',
      text: 'rgb(255, 0, 80)',
      hover: 'rgba(255, 0, 80, 0.15)'
    }
  }
  
  return colors[platform] || colors.github
}