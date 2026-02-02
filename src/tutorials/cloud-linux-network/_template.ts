import { VideoOutline } from "../types";

// Template for Cloud & Linux Network Administration series
// Copy this file and rename to clna-XX.ts

export const episodeTemplate: VideoOutline = {
  episodeId: "clna-00",
  seriesId: "cloud-linux-network",
  title: "Episode Title Here",
  description: "Brief description of what this episode covers",
  duration: 1800, // 30 minutes in seconds
  fps: 30,

  outline: [
    {
      timestamp: "00:00",
      title: "Intro",
      talkingPoints: [
        "Greet viewers",
        "Brief overview of today's topic",
        "What viewers will learn",
      ],
      showOnScreen: "webcam",
    },
    {
      timestamp: "01:00",
      title: "Concept Explanation",
      talkingPoints: [
        "Explain the main concept",
        "Why it matters in cloud/network context",
        "Real-world use case",
      ],
      notes: "Use diagrams to visualize network topology",
      showOnScreen: "slide",
    },
    {
      timestamp: "05:00",
      title: "Terminal Demo",
      talkingPoints: [
        "Show basic commands",
        "Walk through configuration",
        "Explain output",
      ],
      showOnScreen: "demo",
    },
    {
      timestamp: "15:00",
      title: "Hands-on Practice",
      talkingPoints: [
        "Build/configure together",
        "Common mistakes to avoid",
        "Security considerations",
      ],
      showOnScreen: "demo",
    },
    {
      timestamp: "25:00",
      title: "Summary & Next Steps",
      talkingPoints: [
        "Recap key points",
        "Practice suggestions",
        "Preview next episode",
      ],
      showOnScreen: "webcam",
    },
    {
      timestamp: "28:00",
      title: "Outro",
      talkingPoints: [
        "Thank viewers",
        "Call to action (like, subscribe)",
        "Links in description",
      ],
      showOnScreen: "webcam",
    },
  ],

  lowerThirds: [
    {
      title: "Episode Title",
      subtitle: "Cloud & Linux Network Admin Series",
      showAtFrame: 90,
      hideAtFrame: 270,
    },
  ],

  references: [
    {
      label: "Documentation",
      url: "docs.example.com/...",
    },
    {
      label: "Source Files",
      url: "github.com/artivisi/...",
    },
  ],

  codeSnippets: [
    {
      code: `# Example command snippet
sudo systemctl status nginx
sudo docker ps -a`,
      title: "terminal",
      highlightLines: [2],
      showAtFrame: 9000,
      hideAtFrame: 10800,
    },
  ],
};
