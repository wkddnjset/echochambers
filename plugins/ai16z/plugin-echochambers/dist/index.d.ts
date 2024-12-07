import { IAgentRuntime, Client, Plugin } from '@ai16z/eliza';

/**
 * Information about a model/agent in the system
 */
interface ModelInfo {
    username: string;
    model: string;
}
/**
 * Represents a chat message in a room
 */
interface ChatMessage {
    id: string;
    content: string;
    sender: ModelInfo;
    timestamp: string;
    roomId: string;
}
/**
 * Represents a chat room in the system
 */
interface ChatRoom {
    id: string;
    name: string;
    topic: string;
    tags: string[];
    participants: ModelInfo[];
    createdAt: string;
    messageCount: number;
}
/**
 * Configuration options for EchoChamber client
 */
interface EchoChamberConfig {
    apiUrl: string;
    apiKey: string;
    defaultRoom?: string;
    username?: string;
    model?: string;
}
/**
 * Response from listing available rooms
 */
interface ListRoomsResponse {
    rooms: ChatRoom[];
}
/**
 * Response from getting room message history
 */
interface RoomHistoryResponse {
    messages: ChatMessage[];
}
/**
 * Response from sending a message
 */
interface MessageResponse {
    message: ChatMessage;
}
/**
 * Response from creating a new room
 */
interface CreateRoomResponse {
    room: ChatRoom;
}
/**
 * Response from clearing room messages
 */
interface ClearMessagesResponse {
    success: boolean;
    message: string;
}
/**
 * Room event types for plugin notifications
 */
declare enum RoomEvent {
    MESSAGE_CREATED = "message_created",
    ROOM_CREATED = "room_created",
    ROOM_UPDATED = "room_updated",
    ROOM_JOINED = "room_joined",
    ROOM_LEFT = "room_left"
}
/**
 * Message transformation interface for plugins
 */
interface MessageTransformer {
    transformIncoming(content: string): Promise<string>;
    transformOutgoing?(content: string): Promise<string>;
}
/**
 * Content moderation interface for plugins
 */
interface ContentModerator {
    validateContent(content: string): Promise<boolean>;
}

/**
 * EchoChamberClient handles communication between ELIZA and the EchoChambers platform.
 * Primary responsibilities:
 * 1. API communication
 * 2. Room management
 * 3. Message sending/receiving
 *
 * Error Handling:
 * - Automatic retry for failed API requests
 * - Graceful degradation on connection issues
 * - Detailed error logging
 */
declare class EchoChamberClient {
    private runtime;
    private config;
    private apiUrl;
    private modelInfo;
    private pollInterval;
    private watchedRoom;
    private reconnectAttempts;
    private readonly maxReconnectAttempts;
    constructor(runtime: IAgentRuntime, config: EchoChamberConfig);
    /**
     * Gets the username configured for this client
     */
    getUsername(): string;
    /**
     * Gets the model info for this client
     */
    getModelInfo(): ModelInfo;
    /**
     * Gets the current configuration
     */
    getConfig(): EchoChamberConfig;
    private getAuthHeaders;
    /**
     * Sets a specific room to watch and process messages from
     * @param roomId ID of the room to watch
     * @throws {Error} If room not found
     */
    setWatchedRoom(roomId: string): Promise<void>;
    /**
     * Gets the currently watched room ID
     * @returns The watched room ID or null if no room is being watched
     */
    getWatchedRoom(): string | null;
    /**
     * Retries an operation with exponential backoff
     * @param operation The async operation to retry
     * @param retries Maximum number of retry attempts
     * @throws {Error} If all retries fail
     */
    private retryOperation;
    /**
     * Handles reconnection attempts when polling fails
     */
    private handleReconnection;
    /**
     * Initializes the EchoChamber client
     * 1. Verifies API connection
     * 2. Joins default room if specified
     *
     * @throws {Error} If API connection fails after max retries
     */
    start(): Promise<void>;
    /**
     * Stops the client and cleans up resources
     */
    stop(): Promise<void>;
    /**
     * Lists available rooms, optionally filtered by tags
     * @param tags Optional array of tags to filter rooms
     * @returns Array of ChatRoom objects
     * @throws {Error} If API request fails
     */
    listRooms(tags?: string[]): Promise<ChatRoom[]>;
    /**
     * Retrieves message history for a specific room
     * @param roomId ID of the room to get history for
     * @returns Array of ChatMessage objects
     * @throws {Error} If API request fails
     */
    getRoomHistory(roomId: string): Promise<ChatMessage[]>;
    /**
     * Sends a message to a specific room
     * @param roomId ID of the room to send message to
     * @param content Message content
     * @returns The sent ChatMessage
     * @throws {Error} If API request fails
     */
    sendMessage(roomId: string, content: string): Promise<ChatMessage>;
    /**
     * Joins a room to begin receiving messages
     * @param roomId ID of the room to join
     * @throws {Error} If room not found or join fails
     */
    private joinRoom;
    /**
     * Leaves a room and stops receiving messages
     * @param roomId ID of the room to leave
     * @throws {Error} If leave request fails
     */
    private leaveRoom;
}

declare class InteractionClient {
    private client;
    private runtime;
    private lastCheckedTimestamps;
    private lastResponseTimes;
    private messageThreads;
    private pollInterval;
    constructor(client: EchoChamberClient, runtime: IAgentRuntime);
    start(): Promise<void>;
    stop(): Promise<void>;
    private buildMessageThread;
    private shouldProcessMessage;
    private handleInteractions;
    private handleMessage;
}

/**
 * Direct client interface for EchoChambers integration
 * Handles initialization and cleanup of the EchoChambers client and interaction handler
 */
declare const EchoChamberClientInterface: Client;
/**
 * EchoChambers plugin definition
 * Enables ELIZA to interact with EchoChambers rooms by:
 * 1. Managing API communication through EchoChamberClient
 * 2. Processing messages and generating responses through InteractionClient
 */
declare const echoChamberPlugin: Plugin;

export { type ChatMessage, type ChatRoom, type ClearMessagesResponse, type ContentModerator, type CreateRoomResponse, EchoChamberClient, EchoChamberClientInterface, type EchoChamberConfig, InteractionClient, type ListRoomsResponse, type MessageResponse, type MessageTransformer, type ModelInfo, RoomEvent, type RoomHistoryResponse, echoChamberPlugin as default, echoChamberPlugin };
