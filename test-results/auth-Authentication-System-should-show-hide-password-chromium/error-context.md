# Page snapshot

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- main:
  - link "AskInBio":
    - /url: /
    - heading "AskInBio" [level=1]
  - paragraph: Your modern link-in-bio solution
  - heading "Welcome back" [level=3]
  - paragraph: Enter your email and password to sign in to your account
  - text: Email
  - textbox "Email"
  - text: Password
  - textbox "Password"
  - button "Hide password"
  - checkbox "Remember me"
  - text: Remember me
  - link "Forgot password?":
    - /url: /forgot-password
  - button "Sign In"
  - text: Or continue with
  - button "Continue with Google"
  - paragraph:
    - text: Don't have an account?
    - link "Sign up":
      - /url: /register
- region "Notifications alt+T"
- alert
```