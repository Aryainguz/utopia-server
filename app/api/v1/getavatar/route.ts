import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../../../utils/cloudinary";

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function GET(req: NextRequest) {
  // pages/api/random-avatar.js

  try {
    // Fetch the list of all images in the 'avatars' folder
    const { resources } = await cloudinary.search
      .expression("folder:avatars") // Adjust the folder name if needed
      .sort_by("public_id", "desc") // Sort order can be adjusted
      .max_results(100) // Adjust this if you have more than 100 images
      .execute();

    if (!resources || resources.length === 0) {
      return NextResponse.json({ message: "No avatars found" });
    }

    // Shuffle the array to randomize the order
    const shuffledResources = shuffleArray(resources);

    // Select the first element after shuffling
    const randomAvatarUrl = await shuffledResources[0].secure_url;

    return NextResponse.json(
      { url: randomAvatarUrl },
      {
        headers: {
          "Cache-Control": "public, s-maxage=0",
          "CDN-Cache-Control": "public, s-maxage=0",
          "Vercel-CDN-Cache-Control": "public, s-maxage=0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching avatars:", error);
    NextResponse.json({ message: "Something went wrong" });
  }
}
