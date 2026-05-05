// src/pages/Signup.jsx

import React, { useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const API_BASE = "http://localhost:4000/api";

const Signup = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "recipient",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast({
        title: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    try {

      const res = await axios.post(`${API_BASE}/auth/signup`, {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);

      window.dispatchEvent(new Event("storage"));

      toast({
        title: "Signup successful!",
        description: "Welcome to NourishShare.",
      });

      navigate("/");

    } catch (err) {

      console.log(err.response?.data);

      toast({
        variant: "destructive",
        title: "Signup failed",
        description:
          err?.response?.data?.message ||
          "Server error — check backend logs.",
      });

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Signup - NourishShare</title>
      </Helmet>

      <div className="w-full flex justify-center items-center px-4 min-h-screen">

        <Card className="w-full max-w-sm">

          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Create an Account
            </CardTitle>

            <CardDescription>
              Join NourishShare to donate or receive food.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>

            <CardContent className="space-y-4">

              <div>
                <Label>Full Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Password</Label>

                <div className="relative">

                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                </div>
              </div>

              <div>
                <Label>Confirm Password</Label>

                <div className="relative">

                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                </div>
              </div>

              <div>
                <Label>I am a</Label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="recipient">Recipient</option>
                  <option value="donor">Donor</option>
                </select>
              </div>

            </CardContent>

            <CardFooter className="flex flex-col gap-4">

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Account"}
              </Button>

              <p className="text-sm text-center">
                Already have an account?{" "}
                <a href="/sign-in" className="text-emerald-500 font-semibold">
                  Sign In
                </a>
              </p>

            </CardFooter>

          </form>

        </Card>

      </div>
    </>
  );
};

export default Signup;