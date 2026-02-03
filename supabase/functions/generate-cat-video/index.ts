import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VideoRequest {
  breed: string;
  furColor: string;
  eyeColor: string;
  accessory: string;
  background: string;
  personality: string;
  motion: string;
  aspectRatio: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { breed, furColor, eyeColor, accessory, background, personality, motion, aspectRatio }: VideoRequest = await req.json();

    // Create a detailed prompt for image generation with aspect ratio
    const imagePrompt = `Ultra realistic, 4K high resolution photograph of an adorable ${breed} cat with ${furColor} fur and ${eyeColor} eyes. The cat has a ${personality} expression on its face. ${accessory !== 'none' ? `The cat is wearing a ${accessory}.` : ''} The cat is in a ${background} setting. Professional photography, cinematic lighting, highly detailed fur texture, photorealistic, award-winning photo quality. The image should capture the cat in a pose suggesting ${motion} movement. Image aspect ratio: ${aspectRatio}.`;

    console.log("Generating cat image with prompt:", imagePrompt);

    // Step 1: Generate the cat image using Gemini image model
    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: imagePrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!imageResponse.ok) {
      if (imageResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (imageResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your account." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await imageResponse.text();
      console.error("Image generation error:", imageResponse.status, errorText);
      throw new Error(`Image generation failed: ${errorText}`);
    }

    const imageData = await imageResponse.json();
    console.log("Image generation response received");

    // Extract the image URL from the response
    const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImage) {
      throw new Error("No image was generated");
    }

    // For now, we return the generated image
    // Video generation from image would require additional API integration
    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: generatedImage,
        message: "Cat image generated successfully! Video generation coming soon.",
        prompt: imagePrompt,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error generating cat video:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
