"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2 } from "lucide-react"

export function ProfileInfoForm() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "Admin Ali",
    email: "admin@example.com",
    phone: "+1 (555) 123-4567",
    department: "IT",
    bio: "Task Management System administrator with 5+ years of experience in project management and student supervision.",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    }, 1000)
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

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
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!isEditing}
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
        <Select disabled={!isEditing} value={formData.department} onValueChange={handleSelectChange}>
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
          <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
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
  )
}
