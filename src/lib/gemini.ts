import { GoogleGenAI } from "@google/genai";

// This function will only be called on the server side
function getGenAI() {
  if (typeof window !== "undefined") {
    throw new Error("Gemini API can only be used on the server side");
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
}

export interface StickerStyle {
  theme: string;
  colors: string[];
  style: string;
  elements: string[];
  mood: string;
}

export interface StickerGenerationOptions {
  url: string;
  title: string;
  description?: string;
  style: StickerStyle;
  qrCodeDataURL: string;
}

export async function generateStickerImage(
  options: StickerGenerationOptions
): Promise<string> {
  const { url, title, description, style, qrCodeDataURL } = options;

  try {
    const genAI = getGenAI();

    // Convert QR code data URL to base64
    const base64QRCode = qrCodeDataURL.split(",")[1];

    const prompt = [
      {
        text: createStickerPrompt(title, description, style, url),
      },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64QRCode,
        },
      },
    ];

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: prompt,
    });

    // Extract the generated image from the response
    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts
    ) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const imageData = part.inlineData.data;
          // Convert buffer to data URL
          return `data:image/png;base64,${imageData}`;
        }
      }
    }

    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Error generating sticker image:", error);
    throw new Error("Failed to generate sticker image");
  }
}

function createStickerPrompt(
  title: string,
  description: string | undefined,
  style: StickerStyle,
  url: string
): string {
  // Analyze description for specific character requests
  const characterPrompt = analyzeDescriptionForCharacters(description);

  return `
Create a professional, custom-shaped die-cut sticker design with the provided QR code prominently displayed and easily scannable.

STICKER SPECIFICATIONS:
- Title: "${title}"
${description ? `- Description: "${description}"` : ""}
- Target URL: ${url}

DESIGN REQUIREMENTS:
- Theme: ${style.theme}
- Color Palette: ${style.colors.join(", ")}
- Style: ${style.style}
- Design Elements: ${style.elements.join(", ")}
- Overall Mood: ${style.mood}

${characterPrompt}

CRITICAL REQUIREMENTS:
1. The QR code must be CLEARLY VISIBLE and EASILY SCANNABLE - do not obscure or blend it into the background
2. Create a custom-shaped die-cut sticker (not just square/circle) - the shape should relate to the brand/theme
3. Place the QR code in a prominent position with high contrast (black QR code on white background or white QR code on dark background)
4. Keep the QR code as a separate, distinct element - do not integrate it into patterns or backgrounds
5. Add the title text in a clear, readable font that matches the brand style
6. Include relevant characters, icons, or decorative elements based on the description
7. Design should look like a professional branded sticker that could be printed and cut out

CUSTOM SHAPE REQUIREMENTS:
- Create an irregular, custom die-cut shape that relates to the brand/theme
- Examples: wavy edges, speech bubbles, banners, geometric shapes, character silhouettes, etc.
- The shape should enhance the brand identity, not just be decorative
- Consider the sticker's purpose (business card, product label, promotional item, etc.)

DESIGN LAYOUT:
- QR code should occupy 30-40% of the sticker space in a clear, unobstructed area
- Place the QR code in a distinct section (often rectangular) within the custom shape
- Add the title and any character/icon elements in separate areas
- Use the theme colors for backgrounds and decorative elements
- Maintain high contrast for readability
- Design should look professional and brandable

DESIGN GOALS:
- Functional and scannable QR code
- Custom die-cut shape that enhances brand identity
- Professional quality suitable for printing and cutting
- Easy to scan with any QR code reader
- Visually appealing and memorable
- Looks like a real branded sticker you'd see on products or business cards

Create a custom-shaped sticker that prioritizes QR code functionality while creating a strong brand identity and professional appearance.
`;
}

function analyzeDescriptionForCharacters(description?: string): string {
  if (!description) return "";

  const lowerDesc = description.toLowerCase();

  // Check for specific characters
  if (
    lowerDesc.includes("spiderman") ||
    lowerDesc.includes("spider-man") ||
    lowerDesc.includes("spidey")
  ) {
    return `
CHARACTER REQUIREMENTS:
- Include Spider-Man character prominently in the design
- Use Spider-Man's signature red and blue colors
- Add "Spidey" tagline below the character as requested
- Place Spider-Man next to the QR code, not overlapping it
- Make Spider-Man clearly recognizable and well-drawn
- Ensure the character and QR code are combined in a cohesive design
`;
  }

  if (lowerDesc.includes("superman")) {
    return `
CHARACTER REQUIREMENTS:
- Include Superman character prominently in the design
- Use Superman's signature red, blue, and yellow colors
- Add appropriate tagline below the character
- Place Superman next to the QR code, not overlapping it
- Make Superman clearly recognizable and well-drawn
`;
  }

  if (lowerDesc.includes("batman")) {
    return `
CHARACTER REQUIREMENTS:
- Include Batman character prominently in the design
- Use Batman's signature black and yellow colors
- Add appropriate tagline below the character
- Place Batman next to the QR code, not overlapping it
- Make Batman clearly recognizable and well-drawn
`;
  }

  // Generic character handling
  if (
    lowerDesc.includes("character") ||
    lowerDesc.includes("cartoon") ||
    lowerDesc.includes("superhero")
  ) {
    return `
CHARACTER REQUIREMENTS:
- Include the requested character prominently in the design
- Use appropriate colors for the character
- Add relevant tagline below the character if mentioned
- Place the character next to the QR code, not overlapping it
- Make the character clearly recognizable and well-drawn
- Ensure the character and QR code are combined in a cohesive design
`;
  }

  return "";
}

export const predefinedStyles: Record<string, StickerStyle> = {
  modern: {
    theme: "Modern Clean",
    colors: ["#3B82F6", "#FFFFFF", "#1F2937"],
    style: "Clean, modern branding with custom die-cut shapes",
    elements: ["modern fonts", "geometric shapes", "clean lines"],
    mood: "Professional and sleek",
  },
  chibiCartoon: {
    theme: "Chibi Cartoon Emotes",
    colors: ["#FF5FA2", "#FFD93D", "#6BCB77", "#4D96FF", "#F72585"],
    style:
      "Cute chibi-style characters with big eyes, bold outlines, and exaggerated expressions",
    elements: [
      "rounded cartoon faces",
      "expressive eyes and mouths",
      "emoji-like gestures",
      "funny props (headphones, pets, food, signs)",
      "comic-style text bubbles (HI!, GG, RAID)",
    ],
    mood: "Playful, colorful, and expressive — perfect for Twitch/Discord emotes",
  },
  retroArcade: {
    theme: "Retro Arcade",
    colors: ["#FF006E", "#8338EC", "#3A86FF", "#FFBE0B", "#FB5607"],
    style: "Pixel-inspired meets modern cartoon with 80s arcade flair",
    elements: [
      "joysticks, arcade machines",
      "pixel hearts and coins",
      "retro shades",
      "speech bubbles like 'LEVEL UP!'",
    ],
    mood: "Nostalgic, fun, and bold — old-school gamer energy",
  },
  classicBrand: {
    theme: "Retro Brand Stickers",
    colors: [
      "#FF4C4C",
      "#FFD93D",
      "#4CC9F0",
      "#6BCB77",
      "#8338EC",
      "#FF8FA3",
      "#F72585",
      "#FFFFFF",
      "#000000",
    ],
    style:
      "Bold flat vector art with minimal shading, clean lines, and high-contrast palettes inspired by retro logos and anime mascots",
    elements: [
      "mascot-style characters",
      "geometric borders and badge frames",
      "blocky retro text",
      "playful shapes like circles, shields, banners, and hexagons",
      "icons, stars, and flames for accent",
    ],
    mood: "Collectible, nostalgic, and energetic — like anime brand logos and arcade decals",
  },
};

export function getStylePreview(style: StickerStyle): string {
  return `Theme: ${style.theme} | Colors: ${style.colors.join(", ")} | Style: ${
    style.style
  }`;
}
