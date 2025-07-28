#!/usr/bin/env node

/**
 * Dark Mode Test Runner
 * 
 * Comprehensive test suite for dark mode functionality
 * Usage: node scripts/test-dark-mode.js [--watch] [--debug] [--visual]
 */

const { execSync, spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

class DarkModeTestRunner {
  constructor() {
    this.options = this.parseArgs()
    this.testFiles = [
      'tests/dark-mode-dashboard.spec.ts',
      'tests/dark-mode-social.spec.ts', 
      'tests/dark-mode-persistence.spec.ts',
      'tests/dark-mode-visual.spec.ts',
      'tests/dark-mode-suite.spec.ts'
    ]
  }

  parseArgs() {
    const args = process.argv.slice(2)
    return {
      watch: args.includes('--watch'),
      debug: args.includes('--debug'),
      visual: args.includes('--visual'),
      headed: args.includes('--headed'),
      reporter: args.includes('--html') ? 'html' : 'list'
    }
  }

  async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...')
    
    // Check if Playwright is installed
    try {
      execSync('npx playwright --version', { stdio: 'pipe' })
      console.log('✅ Playwright is installed')
    } catch (error) {
      console.error('❌ Playwright not found. Installing...')
      execSync('npm install @playwright/test', { stdio: 'inherit' })
      execSync('npx playwright install', { stdio: 'inherit' })
    }

    // Check if test files exist
    const missingFiles = this.testFiles.filter(file => 
      !fs.existsSync(path.join(process.cwd(), file))
    )

    if (missingFiles.length > 0) {
      console.error('❌ Missing test files:', missingFiles)
      process.exit(1)
    }

    console.log('✅ All test files found')

    // Check if test database/environment is ready
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = 'test'
    }
    
    console.log('✅ Test environment configured')
  }

  buildPlaywrightCommand() {
    let cmd = ['npx', 'playwright', 'test']
    
    // Add test files
    cmd.push(...this.testFiles)
    
    // Add options
    if (this.options.watch) {
      cmd.push('--watch')
    }
    
    if (this.options.debug) {
      cmd.push('--debug')
    }
    
    if (this.options.headed) {
      cmd.push('--headed')
    }
    
    if (this.options.visual) {
      cmd.push('--update-snapshots')
    }
    
    // Set reporter
    cmd.push('--reporter', this.options.reporter)
    
    // Set output directory
    cmd.push('--output', './test-results/dark-mode')
    
    return cmd
  }

  async runTests() {
    console.log('🚀 Starting Dark Mode Test Suite...')
    console.log('📋 Test Coverage:')
    console.log('  • Dashboard theme toggle functionality')
    console.log('  • User social page theme application') 
    console.log('  • Theme persistence across navigation')
    console.log('  • Visual styling and transitions')
    console.log('  • Complete integration testing')
    console.log('')

    const cmd = this.buildPlaywrightCommand()
    
    if (this.options.debug) {
      console.log('🐛 Debug mode: Running command:', cmd.join(' '))
    }

    return new Promise((resolve, reject) => {
      const child = spawn(cmd[0], cmd.slice(1), {
        stdio: 'inherit',
        env: {
          ...process.env,
          PLAYWRIGHT_JUNIT_OUTPUT_NAME: 'dark-mode-results.xml'
        }
      })

      child.on('close', (code) => {
        if (code === 0) {
          console.log('\n🎉 All dark mode tests passed!')
          this.generateSummaryReport()
          resolve(code)
        } else {
          console.log('\n❌ Some tests failed. Check output above.')
          reject(new Error(`Tests failed with code ${code}`))
        }
      })

      child.on('error', (error) => {
        console.error('❌ Failed to run tests:', error)
        reject(error)
      })
    })
  }

  generateSummaryReport() {
    const reportContent = `
# Dark Mode Test Report

## Test Suite Summary
- ✅ Dashboard theme toggle functionality
- ✅ User social page theme application
- ✅ Theme persistence across navigation  
- ✅ Visual styling and transitions
- ✅ Complete integration testing

## Files Tested
${this.testFiles.map(file => `- ${file}`).join('\n')}

## Test Configuration
- Environment: ${process.env.NODE_ENV || 'test'}
- Watch Mode: ${this.options.watch ? 'Enabled' : 'Disabled'}
- Debug Mode: ${this.options.debug ? 'Enabled' : 'Disabled'}  
- Visual Testing: ${this.options.visual ? 'Enabled' : 'Disabled'}
- Reporter: ${this.options.reporter}

## Key Features Validated
- ✅ Theme toggle button functionality
- ✅ Database persistence of theme preferences
- ✅ Real-time preview updates
- ✅ Cross-page theme synchronization
- ✅ Glass component styling in both themes
- ✅ Smooth CSS transitions (300ms)
- ✅ Mobile responsiveness
- ✅ Keyboard accessibility
- ✅ Error handling and recovery
- ✅ Multi-tab consistency

## Implementation Details Tested
- Theme state management and React hooks
- Server actions for database operations
- CSS custom properties and theming
- Glass morphism effects and animations
- Responsive design patterns
- Accessibility compliance

Generated: ${new Date().toISOString()}
`

    const reportPath = './test-results/dark-mode-report.md'
    fs.writeFileSync(reportPath, reportContent.trim())
    console.log(`📄 Summary report generated: ${reportPath}`)
  }

  async cleanup() {
    console.log('🧹 Cleaning up test artifacts...')
    
    // Clean up screenshots if not in visual mode
    if (!this.options.visual) {
      const screenshotDir = './test-results/screenshots'
      if (fs.existsSync(screenshotDir)) {
        fs.rmSync(screenshotDir, { recursive: true, force: true })
      }
    }
    
    console.log('✅ Cleanup complete')
  }

  async run() {
    try {
      await this.checkPrerequisites()
      await this.runTests()
      
      if (!this.options.watch) {
        await this.cleanup()
      }
      
      process.exit(0)
    } catch (error) {
      console.error('💥 Test runner failed:', error.message)
      process.exit(1)
    }
  }
}

// Show help if requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🌙 Dark Mode Test Runner

Usage: node scripts/test-dark-mode.js [options]

Options:
  --watch     Run tests in watch mode
  --debug     Enable debug output and debugging
  --visual    Update visual snapshots  
  --headed    Run tests in headed browser mode
  --html      Generate HTML test report
  --help, -h  Show this help message

Examples:
  node scripts/test-dark-mode.js                    # Run all tests
  node scripts/test-dark-mode.js --watch            # Run in watch mode
  node scripts/test-dark-mode.js --debug --headed   # Debug with browser UI
  node scripts/test-dark-mode.js --visual --html    # Update snapshots and generate HTML report
`)
  process.exit(0)
}

// Run the test suite
const runner = new DarkModeTestRunner()
runner.run()