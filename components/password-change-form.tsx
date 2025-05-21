"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function PasswordChangeForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Calculate password strength for new password
    if (name === "newPassword") {
      calculatePasswordStrength(value);
    }

    // Check if confirm password matches
    if (
      name === "confirmPassword" ||
      (name === "newPassword" && formData.confirmPassword)
    ) {
      if (name === "confirmPassword" && value !== formData.newPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match"
        }));
      } else if (
        name === "newPassword" &&
        value !== formData.confirmPassword &&
        formData.confirmPassword
      ) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match"
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const calculatePasswordStrength = (password: string) => {
    // Simple password strength calculation
    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Medium";
    return "Strong";
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordStrength(0);
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully."
      });
    }, 1500);
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <Label htmlFor="currentPassword" className="text-zinc-300">
          Current Password
        </Label>
        <div className="relative">
          <Input
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            value={formData.currentPassword}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-2"
      >
        <Label htmlFor="newPassword" className="text-zinc-300">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
        )}

        {formData.newPassword && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-1 mt-2"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Password strength:</span>
              <span
                className={`
                ${passwordStrength < 50 ? "text-red-400" : ""}
                ${
                  passwordStrength >= 50 && passwordStrength < 75
                    ? "text-yellow-400"
                    : ""
                }
                ${passwordStrength >= 75 ? "text-green-400" : ""}
              `}
              >
                {getStrengthText()}
              </span>
            </div>
            <Progress
              value={passwordStrength}
              className={`h-1 ${getStrengthColor()}`}
            />
            <ul className="text-xs space-y-1 text-zinc-400 mt-2">
              <li
                className={
                  formData.newPassword.length >= 8 ? "text-green-400" : ""
                }
              >
                • At least 8 characters
              </li>
              <li
                className={
                  /[A-Z]/.test(formData.newPassword) ? "text-green-400" : ""
                }
              >
                • At least one uppercase letter
              </li>
              <li
                className={
                  /[0-9]/.test(formData.newPassword) ? "text-green-400" : ""
                }
              >
                • At least one number
              </li>
              <li
                className={
                  /[^A-Za-z0-9]/.test(formData.newPassword)
                    ? "text-green-400"
                    : ""
                }
              >
                • At least one special character
              </li>
            </ul>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="space-y-2"
      >
        <Label htmlFor="confirmPassword" className="text-zinc-300">
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
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
              Updating Password...
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Change Password
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}
