"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2 } from "lucide-react";
import { getGraphqlClient } from "@/lib/graphqlClient";
import { UPDATE_USER_MUTATION } from "@/lib/queries";
import { Me } from "@/@types/types";
import { toast } from "sonner";

export function ProfileInfoForm({ userData }: { userData: Me | undefined }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    bio: ""
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.name,
        email: userData.username,
        phone: userData.phone || "",
        department: userData.department || "",
        bio: userData.bio || ""
      });
    }
  }, [userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    console.log("Sending to mutation:", {
      name: formData.fullName,
      phone: formData.phone,
      department: formData.department,
      bio: formData.bio
    });

    try {
      await getGraphqlClient().request(UPDATE_USER_MUTATION, {
        name: formData.fullName,
        phone: formData.phone,
        department: formData.department,
        bio: formData.bio
      });

      toast.success("Your profile information has been updated successfully.");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <Label htmlFor="fullName" className="text-zinc-300">
          Full Name
        </Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          placeholder="John Doe"
          onChange={handleChange}
          disabled={!isEditing}
          className="bg-zinc-800 border-zinc-700 text-white disabled:opacity-70 disabled:cursor-not-allowed"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="space-y-2"
      >
        <Label htmlFor="email" className="text-zinc-300">
          Username or Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="John@Doe.com"
          value={formData.email}
          onChange={handleChange}
          disabled={true}
          className="bg-zinc-800 border-zinc-700 text-white disabled:opacity-70 disabled:cursor-not-allowed"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-2"
      >
        <Label htmlFor="phone" className="text-zinc-300">
          Phone Number
        </Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          placeholder="+1 (555) 123-4567"
          onChange={handleChange}
          disabled={!isEditing}
          className="bg-zinc-800 border-zinc-700 text-white disabled:opacity-70 disabled:cursor-not-allowed"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="space-y-2"
      >
        <Label htmlFor="department" className="text-zinc-300">
          Department
        </Label>
        <Select
          disabled={!isEditing}
          value={formData.department}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white disabled:opacity-70 disabled:cursor-not-allowed">
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="space-y-2"
      >
        <Label htmlFor="bio" className="text-zinc-300">
          Bio
        </Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          placeholder="Tell us something about yourself..."
          onChange={handleChange}
          disabled={!isEditing}
          className="bg-zinc-800 border-zinc-700 text-white min-h-[100px] disabled:opacity-70 disabled:cursor-not-allowed"
        />
      </motion.div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex justify-end"
        >
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      )}
    </form>
  );
}
