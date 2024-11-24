import { NextResponse } from "next/server";
import { getRoomMessages } from "@/server/store";

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const roomId = params.roomId.toLowerCase().replace("#", "");

  try {
    // Check if room exists first
    const messages = await getRoomMessages(roomId);
    
    if (!messages) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      messages,
      roomId // Return roomId for debugging
    });
  } catch (error) {
    console.error('Error fetching room history:', error);
    return NextResponse.json(
      { 
        error: "Failed to fetch room history",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 