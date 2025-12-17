# **App Name**: Forever Yours

## Core Features:

- Password Gate: Secure the website with a password stored (hashed) in Firestore. On successful validation, store the session in localStorage and redirect to /home.
- Home Page: Display a welcoming message with a typing animation subtext: "This website exists because you exist." and a 'Start reading' button with hover glow effect.
- Story Timeline: Present our story as a vertical timeline with text blocks that expand on click, covering key moments. Firestore may be needed if content requires user updates.
- Letters Page: Display 6-10 locked cards which, when clicked, flip to reveal heartfelt letters. Pure text with slow reveal animations to set the tone.
- Reason Generator: Generate random reasons why I choose you when button clicked, demonstrating affection through unique and personalized sentiments.
- Time Machine: Tool that measures the current number of days since important milestones. Show line beneath "Time didn’t pass. It stayed with us."
- Keyword Access: Secret page accessible by typing her nickname as a keyword, offering a surprise message expressing love and appreciation for her curiosity. Route: /only-you.

## Style Guidelines:

- Primary color: Rose (#FF69B4), a gentle and warm hue associated with love and femininity.
- Background color: Dark slate (#0f172a) to provide a modern, soft contrast that complements the pink hue.
- Accent color: Violet (#EE82EE) which sits close to the rose color on the color wheel, ensuring harmony.
- Body font: 'Literata', serif font known for readability in body text, enhancing the focus on the website's emotional textual content.
- UI font: 'Inter', a sans-serif typeface providing a clean, contemporary contrast, for improved clarity of UI elements such as headers, labels, and buttons.
- Implement subtle fade-in effects for text elements, gentle hover effects on buttons, and a slow reveal animation on the flip of the letter cards.
- Employ a clean, whitespace-heavy layout to allow the textual content to breathe. This approach reduces visual clutter and emphasizes the intimacy of the words.