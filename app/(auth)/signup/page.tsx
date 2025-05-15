"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { graphqlClient } from "@/lib/graphqlClient";
import { SIGNUP_MUTATION } from "@/lib/mutations";
import { SignupResponse } from "@/@types/types";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    studentId: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      username: formData.email, // match backend field
      password: formData.password,
      name: formData.name,
      universityId: formData.studentId,
      role: "student" // assume all users signup as students
    };

    try {
      const data = (await graphqlClient.request(
        SIGNUP_MUTATION,
        payload
      )) as SignupResponse;
      console.log("✅ signed up", data);
      if (data.signup.id) {
        toast.success("Account Signed up successfully");
        router.push("/login");
      }
    } catch (err) {
      console.error("❌ signup error", err);
      toast.success("Failed Signing Student up!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md px-4"
    >
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-blue-500">
            Sign Up
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Create a student account to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email or Username
              </Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="John@doe.com or John78"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-zinc-300">
                Student ID
              </Label>
              <Input
                id="studentId"
                name="studentId"
                type="text"
                placeholder="S12345"
                required
                value={formData.studentId}
                onChange={handleChange}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
