"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { register as registerApi, login as loginApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "" as "male" | "female" | "",
    dob: "",
    phone_number: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { loginState } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gender) {
      setError("Please select a gender.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // 1. Register User
      await registerApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender as "male" | "female",
        dob: formData.dob || null,
        phone_number: formData.phone_number || null,
      });

      // 2. Automatically login after successful registration
      const loginResponse = await loginApi({
        email: formData.email,
        password: formData.password
      });
      await loginState(loginResponse.access_token);

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to register account");
      } else {
        setError("Failed to register account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container max-w-lg mx-auto py-12 px-4">
      <Card className="shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2 text-left">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name" name="name" placeholder="John Doe" required
                value={formData.name} onChange={handleChange}
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="email" name="email" type="email" placeholder="lupustic@gmail.com" required
                value={formData.email} onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender <span className="text-destructive">*</span></Label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob" name="dob" type="date"
                  value={formData.dob} onChange={handleChange}
                  className="h-9 block w-full"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number" name="phone_number" type="tel" placeholder="+1234567890"
                value={formData.phone_number} onChange={handleChange}
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
              <Input
                id="password" name="password" type="password" placeholder="********" required
                value={formData.password} onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold mt-4" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-8 border-t pt-6 bg-secondary/20">
          <div className="text-sm text-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
