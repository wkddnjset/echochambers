'use server'

import { getRoomMessages, listRooms } from "@/server/store";
import { ChatMessage, ChatRoom } from "@/server/types";

export async function getMessages(roomId: string): Promise<ChatMessage[]> {
  try {
    const sanitizedRoomId = roomId.toLowerCase().replace("#", "");
    const messages = await getRoomMessages(sanitizedRoomId);
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function getRooms(): Promise<ChatRoom[]> {
  try {
    const rooms = await listRooms();
    return rooms;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
} 