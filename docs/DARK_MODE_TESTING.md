# Dark Mode Testing Documentation

## Overview

This document describes the comprehensive testing suite implemented for the dark mode functionality in the Ask in Bio application. The tests cover dashboard interaction, user social pages, theme persistence, and visual styling.

## Test Architecture

### 🏗️ Test Structure

```
tests/
├── dark-mode-dashboard.spec.ts     # Dashboard theme toggle tests
├── dark-mode-social.spec.ts        # User social page theme tests  
├── dark-mode-persistence.spec.ts   # Cross-page theme persistence
├── dark-mode-visual.spec.ts        # Visual styling and transitions
└── dark-mode-suite.spec.ts         # Integration suite + utilities

scripts/
└── test-dark-mode.js               # Test runner with options

docs/
└── DARK_MODE_TESTING.md           # This documentation
```

### 🎯 Test Coverage

| Area | Test File | Coverage |
|------|-----------|----------|
| **Dashboard Functionality** | `dark-mode-dashboard.spec.ts` | Theme toggle component, database persistence, real-time preview, loading states, error handling |
| **Social Page Theming** | `dark-mode-social.spec.ts` | Theme application, glass components, mobile responsiveness, fallback handling |
| **Theme Persistence** | `dark-mode-persistence.spec.ts` | Cross-page navigation, browser refresh, multi-tab sync, database consistency |
| **Visual Styling** | `dark-mode-visual.spec.ts` | CSS transitions, glass effects, animations, accessibility, responsive design |
| **Integration** | `dark-mode-suite.spec.ts` | End-to-end workflows, CSS validation, accessibility compliance |

## Key Features Tested

### ✅ Dashboard Theme Toggle
- **Component Rendering**: Theme toggle button with glass pill styling
- **Icon Animations**: Smooth sun/moon icon transitions with rotation and scale
- **Loading States**: Spinner display during database save operations
- **Error Handling**: Graceful fallback when database operations fail
- **Accessibility**: Keyboard navigation and ARIA compliance
- **Performance**: Rapid toggle click handling without crashes

### ✅ Database Integration
- **Theme Persistence**: User preferences saved to database
- **Real-time Updates**: Changes reflect immediately across UI
- **Error Recovery**: Graceful handling of database connection issues
- **Concurrent Changes**: Proper handling of simultaneous theme updates
- **Migration Support**: Handling users without existing theme records

### ✅ User Social Page
- **Theme Application**: Database theme applied to public profile
- **Glass Components**: Proper styling of all glass morphism elements
- **Visual Consistency**: Consistent theming across all page elements
- **Mobile Optimization**: Responsive design in both light and dark modes
- **Performance**: Fast theme loading without visual flicker

### ✅ Cross-Page Persistence
- **Navigation Sync**: Theme persists when navigating between pages
- **Browser Refresh**: Theme survives page reloads
- **Multi-tab Consistency**: Theme changes sync across browser tabs
- **Session Management**: Theme restored after logout/login cycles
- **Database Revalidation**: Social pages update when theme changes

### ✅ Visual Styling & Transitions
- **CSS Transitions**: Smooth 300ms transitions between themes
- **Glass Effects**: Proper backdrop filters and rgba backgrounds
- **Animations**: Sun/moon icon animations and toggle indicators
- **Color Mesh**: Dynamic background gradients in both themes
- **Accessibility**: Proper text contrast and keyboard focus indicators

## Implementation Details

### 🔧 Technology Stack
- **Testing Framework**: Playwright with TypeScript
- **UI Components**: React with Lucide icons
- **Styling**: CSS custom properties with Tailwind CSS
- **Database**: Prisma ORM with theme persistence
- **State Management**: React hooks with server actions

### 🎨 Visual Design System

#### Glass Morphism Components
```css
.glass-pill {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  transition: all 0.2s ease;
}

.dark .glass-pill {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}
```

#### Theme Transitions
```css
* {
  transition-property: background-color, border-color, color;
  transition-duration: 300ms;
  transition-timing-function: ease-out;
}
```

### 🗄️ Database Schema
```prisma
model Theme {
  id              String   @id @default(cuid())
  userId          String
  name            String
  preset          String   @default("DEFAULT")
  primaryColor    String
  backgroundColor String
  fontFamily      String
  isDarkMode      Boolean  @default(false) @map("is_dark_mode")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
}
```

## Running Tests

### 🚀 Quick Start
```bash
# Run all dark mode tests
node scripts/test-dark-mode.js

# Run in watch mode for development
node scripts/test-dark-mode.js --watch

# Debug with browser UI visible
node scripts/test-dark-mode.js --debug --headed

# Generate visual snapshots and HTML report
node scripts/test-dark-mode.js --visual --html
```

### 📊 Available Options
| Option | Description |
|--------|-------------|
| `--watch` | Run tests in watch mode for development |
| `--debug` | Enable debug output and pause on failures |
| `--headed` | Run tests with visible browser window |
| `--visual` | Update visual snapshots for comparison |
| `--html` | Generate detailed HTML test report |

### 🎯 Individual Test Suites
```bash
# Run specific test file
npx playwright test tests/dark-mode-dashboard.spec.ts

# Run with specific browser
npx playwright test --project=chromium

# Generate test report
npx playwright show-report
```

## Test Environment Setup

### 📋 Prerequisites
1. **Node.js**: Version 18+ recommended
2. **Playwright**: Automatically installed by test runner
3. **Test Database**: Configured for test environment
4. **Test User**: Valid login credentials for testing

### 🔐 Environment Configuration
```env
NODE_ENV=test
NEXT_PUBLIC_SUPABASE_URL=your_test_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_test_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_test_service_key
DATABASE_URL=your_test_database_url
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 👤 Test User Setup
The tests assume a test user exists with:
- **Email**: `test@example.com`
- **Password**: `testpass123`
- **Username**: `testuser`

## Troubleshooting

### 🐛 Common Issues

#### Test User Authentication Fails
```bash
# Ensure test user exists in your test database
# Or update credentials in test files
```

#### Theme Database Column Missing
```bash
# Run database migrations
npx prisma db push
# Or run the migration script from previous sessions
```

#### Visual Snapshot Mismatches
```bash
# Update snapshots when UI changes are intentional
node scripts/test-dark-mode.js --visual
```

#### Slow Test Execution
```bash
# Run tests in parallel (default)
npx playwright test --workers=4

# Or reduce timeout for faster feedback
npx playwright test --timeout=10000
```

### 🔍 Debug Mode
When tests fail, use debug mode to investigate:

```bash
# Open Playwright Inspector
node scripts/test-dark-mode.js --debug

# Or debug specific test
npx playwright test tests/dark-mode-dashboard.spec.ts --debug
```

## Contributing

### 🤝 Adding New Tests

1. **Create Test File**: Follow naming convention `dark-mode-[feature].spec.ts`
2. **Use Utilities**: Import `DarkModeTestUtils` from suite file
3. **Follow Patterns**: Use existing test structure and assertions
4. **Update Runner**: Add new test file to `scripts/test-dark-mode.js`

### 📝 Test Structure Template
```typescript
import { test, expect } from '@playwright/test'
import { DarkModeTestUtils } from './dark-mode-suite.spec'

test.describe('Dark Mode [Feature Name]', () => {
  test.beforeEach(async ({ page }) => {
    await DarkModeTestUtils.loginUser(page)
  })

  test('should [expected behavior]', async ({ page }) => {
    // Test implementation
    await DarkModeTestUtils.toggleTheme(page)
    const theme = await DarkModeTestUtils.getCurrentTheme(page)
    expect(theme).toBe('dark')
  })
})
```

### 🎨 Visual Testing Guidelines
- **Screenshots**: Use consistent naming and full-page captures
- **Comparisons**: Test both light and dark themes
- **Responsive**: Include mobile, tablet, and desktop viewports
- **Interactions**: Capture hover states and animations

## Continuous Integration

### 🔄 CI/CD Integration
```yaml
# .github/workflows/dark-mode-tests.yml
name: Dark Mode Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install
      - run: node scripts/test-dark-mode.js --html
      - uses: actions/upload-artifact@v3
        with:
          name: dark-mode-test-results
          path: test-results/
```

### 📈 Performance Monitoring
- **Test Execution Time**: Monitor for performance regressions
- **Database Operations**: Ensure theme saves complete within 1 second
- **UI Transitions**: Validate 300ms transition timing
- **Page Load**: Verify theme application doesn't slow page loads

## Test Results & Reporting

### 📊 Generated Reports
- **HTML Report**: Detailed test results with screenshots
- **Summary Report**: Markdown overview of test coverage
- **JUnit XML**: For CI/CD integration
- **Visual Snapshots**: Before/after comparison images

### 🎯 Success Criteria
- **100% Test Pass Rate**: All tests must pass consistently
- **Performance**: Theme toggle response < 500ms
- **Visual Consistency**: No layout shifts during theme change
- **Accessibility**: WCAG 2.1 AA compliance in both themes
- **Cross-browser**: Support Chrome, Firefox, Safari, Edge

## Maintenance

### 🔄 Regular Updates
1. **Dependency Updates**: Keep Playwright and test dependencies current
2. **Test Data**: Update test user credentials as needed
3. **Visual Snapshots**: Refresh when UI changes are made
4. **Performance Baselines**: Adjust timing expectations as needed

### 📅 Test Schedule
- **Pre-commit**: Run critical path tests
- **Daily**: Full dark mode test suite
- **Release**: Complete visual regression testing
- **Monthly**: Performance benchmark review

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/)
- [React Testing Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

*Last Updated: January 2025*  
*Test Suite Version: 1.0.0*