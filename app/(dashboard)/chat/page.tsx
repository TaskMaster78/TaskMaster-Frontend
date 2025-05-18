"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { io } from "socket.io-client";
import { GET_OTHER_USERS } from "@/lib/queries";
import { getGraphqlClient } from "@/lib/graphqlClient";
import { useAuth } from "@/context/AuthContext";

const socket = io("http://localhost:4000", {
  query: {
    userId: localStorage.getItem("userId")
  }
});

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface CurrentUsers {
  id: string;
  name: string;
  role: string;
}

export default function ChatPage() {
  const { userId } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [users, setUsers] = useState<CurrentUsers[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = (await getGraphqlClient().request(GET_OTHER_USERS)) as any;
        setUsers(data.otherUsers);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      const senderId = message.sender;

      setMessages((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), message]
      }));
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "Admin Ali",
      content: messageInput,
      timestamp: new Date()
    };

    socket.emit("sendMessage", {
      ...newMessage,
      recipientId: selectedUser
    });

    setMessages((prev) => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), newMessage]
    }));

    setMessageInput("");
  };

  return (
    <div className="p-6 h-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-blue-500 mb-6"
      >
        Chat
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100%-4rem)]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1"
        >
          <Card className="h-full bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold text-zinc-300 mb-4">
                Users
              </h2>
              <ScrollArea className="h-[calc(100vh-240px)]">
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                        selectedUser === user.id
                          ? "bg-blue-900/30"
                          : "hover:bg-zinc-800"
                      }`}
                      onClick={() => setSelectedUser(user.id)}
                    >
                      <Avatar>
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40`}
                        />
                        <AvatarFallback className="bg-blue-700">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          {user.name}
                        </p>
                        <p className="text-xs text-zinc-400">{user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-3 flex flex-col"
        >
          <Card className="h-full bg-zinc-900 border-zinc-800 flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              {!selectedUser ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-zinc-500">
                    Select a user to start chatting
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-2 border-b border-zinc-800 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40`}
                      />
                      <AvatarFallback className="bg-blue-700">
                        {users
                          .find((u) => u.id === selectedUser)
                          ?.name.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-zinc-200">
                        {users.find((u) => u.id === selectedUser)?.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {users.find((u) => u.id === selectedUser)?.role}
                      </p>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {(messages[selectedUser] || []).map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === "Admin Ali"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender === "Admin Ali"
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-800 text-zinc-200"
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <form
                    onSubmit={handleSendMessage}
                    className="mt-4 flex gap-2"
                  >
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send size={18} />
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
