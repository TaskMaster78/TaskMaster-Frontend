"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Key, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { PasswordChangeForm } from "@/components/password-change-form";
import { ProfileInfoForm } from "@/components/profile-info-form";
import { getGraphqlClient } from "@/lib/graphqlClient";
import { ME_QUERY } from "@/lib/queries";
import { Me, MeResponse } from "@/@types/types";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { toast } = useToast();
  const { role } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<Me>();
  const [avatarSrc, setAvatarSrc] = useState<string>(
    "/placeholder.svg?height=128&width=128"
  );

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarSrc(event.target.result as string);
          toast({
            title: "Profile picture updated",
            description: "Your profile picture has been updated successfully."
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = (await getGraphqlClient().request(ME_QUERY)) as MeResponse;
        setUser(data.me);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <motion.h1
        className="text-3xl font-bold text-blue-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Profile
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="md:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-blue-500">
                Profile Picture
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Click on the avatar to update your profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar
                  className="h-32 w-32 cursor-pointer flex justify-center items-center"
                  onClick={handleAvatarClick}
                >
                  <div className="bg-blue-700 h-32 w-32 text-white flex items-center justify-items-center">
                    <div className="mx-auto text-3xl font-bold">
                      {user?.name.slice(0, 1).toUpperCase()}
                    </div>
                  </div>
                </Avatar>
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <Camera className="text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium text-white">{`${
                  role === "admin" ? "Admin" : "Student"
                } ${user?.name}`}</h3>
                <p className="text-zinc-400">{user?.username}</p>
                <p className="text-blue-500 text-sm mt-1">
                  {role === "admin" ? "Administrator" : "Registered Student"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="bg-zinc-800 border-zinc-700 mb-4">
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-blue-600"
              >
                <User className="h-4 w-4 mr-2" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-blue-600"
              >
                <Key className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-0">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-500">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Update your personal details here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileInfoForm userData={user} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-500">
                    Change Password
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PasswordChangeForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
