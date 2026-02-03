# Project Nexus: Next-Gen News Aggregator
> **Vision**: A news platform that goes beyond summaries to provide context, clarity, and control, wrapped in a cinematic, hyper-modern interface.

## 1. Core Concept vs. Inshorts
While Inshorts focuses on *speed* (60 words), **Nexus** focuses on *understanding* and *experience*.

| Feature | Inshorts | Nexus (Proposed) |
| :--- | :--- | :--- |
| **Content Format** | Stack of text cards | **Interactive "Story Stacks"** (Text, Timeline, Map, Data Viz) |
| **Navigation** | Vertical Swipe | **Hybrid Gestures** (Swipe for next, Tap for details, Pinch for summarize) |
| **Context** | Single summary | **"Deep Dive" Mode**: AI-generated background, timeline of events, and "Why it Matters". |
| **Audio** | Basic TTS | **AI Podcast**: Conversational summary of your daily feed. |
| **Discovery** | Categories | **Visual Map & Bento Grids**: Explore news geographically or by topic cluster. |

## 2. Unique "Killer" Features
1.  **Contextual Timelines**:
    *   *Problem*: Reading a news update on a war or election often lacks context.
    *   *Solution*: A horizontal timeline component attached to stories showing the previous 5 key events leading to this moment.
2.  **Sentiment & Bias Radar**:
    *   *Problem*: Hard to tell if a source is biased.
    *   *Solution*: A sleek visual radar chart for each article indicating political leaning (Left/Right) and sentiment (Positive/Negative/Neutral).
3.  **"Zen Mode" (Mental Health Filter)**:
    *   *Problem*: Doom-scrolling causes anxiety.
    *   *Solution*: A toggle to filter out crime/tragedy and focus on innovation, science, and uplifting stories.
4.  **Debate Arena**:
    *   *Problem*: Echo chambers.
    *   *Solution*: For controversial topics, show two side-by-side summaries: "The Pro Argument" vs "The Con Argument".
5.  **Interactive Globe**:
    *   *Problem*: Geographically disconnected.
    *   *Solution*: A 3D/2D globe view where users click regions to see top stories.

## 3. UI/UX Design Language
*   **Aesthetic**: "Cyber-Glass" – Dark mode defaults, deep blurred backgrounds, neon accents for categories (e.g., Tech = Cyan, Politics = Purple).
*   **Typography**: Clean sans-serif (Inter or Geist) with high contrast headers.
*   **Motion**: Framer Motion for card entry, exit, and expansion. Everything should feel physically responsive.

## 4. Tech Stack
*   **Framework**: Next.js 15 (App Router) - For speed and SEO.
*   **Styling**: Tailwind CSS - For rapid, custom design.
*   **Animations**: Framer Motion - Essential for the "swipe" and "expand" interactions.
*   **Icons**: Lucide React.
*   **State Management**: Zustand (lightweight).

## 5. Implementation Roadmap
### Phase 1: Foundation (Current)
- [x] Set up Next.js + Tailwind project.
- [ ] Create the "Card Stack" component (Virtual List).
- [ ] Implement the core "Glassmorphism" layout wrapper.

### Phase 2: Core Components
- [ ] Build the **News Card** (Image, Headline, 60-word summary).
- [ ] Build the **"Flip" Mechanism** (Click to reveal Context/Timeline).
- [ ] Implement **Swipe Gestures** (Framer Motion).

### Phase 3: Advanced Features
- [ ] **Zen Mode** toggle implementation.
- [ ] **Timeline View** for multi-part stories.
- [ ] **Bias Meter** visual component.

### Phase 4: Polish
- [ ] Micro-interactions (Heart animations, bookmark saves).
- [ ] Loading skeletons with shimmer effects.
- [ ] PWA capabilities (installable on phone).
