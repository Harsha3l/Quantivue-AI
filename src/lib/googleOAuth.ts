// Google OAuth helper functions
const GOOGLE_CLIENT_ID = "387191225878-jclgmhqqfhccafgs1o7m0v2nmm6v6e62.apps.googleusercontent.com";

declare global {
  interface Window {
    google: any;
  }
}

export const initializeGoogleOAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if Google script is already loaded
    if (window.google && window.google.accounts) {
      resolve();
      return;
    }

    // Wait for Google script to load
    const checkGoogle = setInterval(() => {
      if (window.google && window.google.accounts) {
        clearInterval(checkGoogle);
        resolve();
      }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkGoogle);
      reject(new Error("Google OAuth script failed to load"));
    }, 10000);
  });
};

// Sign in with Google using ID token flow
export const signInWithGoogleIdToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    initializeGoogleOAuth()
      .then(() => {
        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            if (response.credential) {
              resolve(response.credential); // This is the id_token
            } else {
              reject(new Error("No credential received from Google"));
            }
          },
        });

        // Trigger the sign-in flow
        window.google.accounts.id.prompt((notification: any) => {
          // If One Tap is not displayed, we'll need to use a button
          // For now, we'll trigger the button programmatically
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Create a temporary button and click it
            const button = document.createElement("div");
            button.id = "google-signin-button-temp";
            button.style.display = "none";
            document.body.appendChild(button);

            window.google.accounts.id.renderButton(button, {
              theme: "outline",
              size: "large",
              type: "standard",
              text: "signin_with",
            });

            // Try to click the button
            const clickButton = button.querySelector("div[role='button']") as HTMLElement;
            if (clickButton) {
              clickButton.click();
            } else {
              // Fallback: show error
              document.body.removeChild(button);
              reject(new Error("Please click the Google sign-in button"));
            }
          }
        });
      })
      .catch(reject);
  });
};

// Alternative: Direct button click handler
export const handleGoogleSignIn = (callback: (idToken: string) => void): void => {
  initializeGoogleOAuth()
    .then(() => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          if (response.credential) {
            callback(response.credential);
          }
        },
      });
    })
    .catch((error) => {
      console.error("Failed to initialize Google OAuth:", error);
    });
};

