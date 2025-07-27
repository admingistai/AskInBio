# iOS Keyboard Handling Setup

## Overview

The Get Started button now includes iOS keyboard awareness to ensure it remains visible and accessible when the iPhone keyboard appears.

## Implementation Details

### 1. Visual Viewport Hook (`hooks/useVisualViewport.ts`)
- Detects when the iOS keyboard appears/disappears
- Calculates the exact keyboard height
- Returns keyboard state for dynamic positioning

### 2. OnboardingFlow Updates
- Added safe area inset handling: `bottom-[max(60px,calc(env(safe-area-inset-bottom)+60px))]`
- Integrated visual viewport detection
- Dynamic transform adjustment when keyboard is visible
- Smooth transitions (0.3s) for keyboard state changes

### 3. Input Field Enhancements
- Prevents iOS zoom on input focus
- Maintains proper viewport scale

## Recommended Meta Tag

Add this to your `app/layout.tsx` `<head>` section for optimal iOS behavior:

```tsx
<meta 
  name="viewport" 
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" 
/>
```

The `viewport-fit=cover` ensures proper handling of safe areas on newer iPhones.

## Testing Instructions

### On iOS Devices:
1. Open the app in Safari on iPhone
2. Tap the Get Started button
3. When input fields appear, tap to focus
4. Verify the button/container moves above the keyboard
5. Dismiss keyboard and verify smooth return to original position

### Device-Specific Testing:
- **iPhone with notch** (X/11/12/13/14/15): Verify safe area padding
- **iPhone without notch** (SE/8): Verify standard positioning
- **iPad**: Verify keyboard handling on larger screens

## Browser Support

- **iOS Safari**: Full support with Visual Viewport API
- **Chrome iOS**: Full support
- **Other browsers**: Graceful fallback using safe area insets only

## Troubleshooting

### Button not moving with keyboard:
1. Ensure the viewport meta tag is properly set
2. Check if JavaScript is enabled
3. Verify Visual Viewport API is available (iOS 13+)

### Jumpy animations:
- The transition duration can be adjusted in the style prop
- Current setting: 0.3s ease-out

### Input zoom issues:
- The onFocus handler prevents zoom by temporarily blurring/refocusing
- This maintains the viewport scale at 1.0

## Future Enhancements

1. **Android Support**: Add similar handling for Android keyboards
2. **Orientation Changes**: Handle landscape keyboard positioning
3. **Custom Keyboard Heights**: Support for third-party keyboards
4. **Accessibility**: Ensure screen reader compatibility

---

*Implementation completed: Current Session*
*Ready for production testing on iOS devices*