// src/pages/SignInPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { Eye, EyeOff } from "lucide-react";   // ⭐ ADD

const API_BASE = "http://localhost:4000/api";

const SignInPage = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);  // ⭐ ADD


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      const res = await axios.post(`${API_BASE}/auth/signin`, form);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);

      // ✅ FIX (position change only)
      window.dispatchEvent(new Event("storage"));

      toast({
        title: "Login successful",
      });

      navigate("/");

    } catch (err) {

      toast({
        variant: "destructive",
        title: "Login failed",
        description: err?.response?.data?.message
      });

    } finally {

      setLoading(false);

    }

  };


  return (
    <>
      <Helmet>
        <title>Sign In - NourishShare</title>
      </Helmet>

      <div className="w-full flex justify-center items-center px-4 min-h-screen">

        <Card className="w-full max-w-sm">

          <CardHeader className="text-center">

            <CardTitle className="text-3xl font-bold">
              Welcome Back!
            </CardTitle>

            <CardDescription>
              Sign in to continue
            </CardDescription>

          </CardHeader>

          <form onSubmit={handleSubmit}>

            <CardContent className="space-y-4">

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

            </CardContent>

            <CardFooter>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

            </CardFooter>

          </form>

        </Card>

      </div>
    </>
  );
};

export default SignInPage;