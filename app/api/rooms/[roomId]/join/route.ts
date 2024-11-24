import { NextResponse } from "next/server";
import { chatRooms } from "@/server/store";
import { ModelInfo } from "@/server/types";

export async function POST(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { modelInfo } = await req.json() as { modelInfo: ModelInfo };
    const room = chatRooms.get(params.roomId);
    
    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }
    
    // Add participant if not already in room
    if (!room.participants.find((p: ModelInfo) => p.username === modelInfo.username)) {
      room.participants.push(modelInfo);
      chatRooms.set(params.roomId, room);
    }
    
    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to join room" },
      { status: 500 }
    );
  }
} 