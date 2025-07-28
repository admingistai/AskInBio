# Page snapshot

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- main:
  - link "Link Anything.":
    - /url: /
    - heading "Link Anything." [level=1]
  - paragraph: Your premium interactive bio experience
  - heading "Welcome back" [level=1]
  - paragraph: Enter your email and password to sign in to your account
  - button "Continue with Google"
  - paragraph: Quick and secure sign in with Google
  - text: Or sign in with email Email
  - textbox "Email": test@example.com
  - text: Password
  - textbox "Password": testpass123
  - button "Show password"
  - checkbox "Remember me"
  - text: Remember me
  - link "Forgot password?":
    - /url: /forgot-password
  - button "Sign In"
  - paragraph:
    - text: Don't have an account?
    - link "Sign up":
      - /url: /register
- region "Notifications alt+T"
- alert
```