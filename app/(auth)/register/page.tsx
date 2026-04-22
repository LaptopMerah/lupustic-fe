"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { register as registerApi, login as loginApi } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const t = useTranslations("auth")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "" as "male" | "female" | "",
    dob: "",
    phone_number: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const { loginState } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.gender) {
      toast.error(t("errorGender"))
      return
    }

    setIsLoading(true)

    try {
      await registerApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender as "male" | "female",
        dob: formData.dob || null,
        phone_number: formData.phone_number || null,
      })

      const loginResponse = await loginApi({
        email: formData.email,
        password: formData.password,
      })
      await loginState(loginResponse.access_token)
      toast.success(t("registerSuccess"))
      router.push("/")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("errorRegister"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="container max-w-lg mx-auto py-12 px-4">
      <Card className="shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">{t("registerTitle")}</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {t("registerSubtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 text-left">
              <Label htmlFor="name">
                {t("fullName")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name" name="name" placeholder="John Doe" required
                value={formData.name} onChange={handleChange}
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="email">
                {t("email")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email" name="email" type="email" placeholder="lupustic@gmail.com" required
                value={formData.email} onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <Label htmlFor="gender">
                  {t("gender")} <span className="text-destructive">*</span>
                </Label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="" disabled>{t("selectGender")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">{t("dob")}</Label>
                <Input
                  id="dob" name="dob" type="date"
                  value={formData.dob} onChange={handleChange}
                  className="h-9 block w-full"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="phone_number">{t("phone")}</Label>
              <Input
                id="phone_number" name="phone_number" type="tel" placeholder="+1234567890"
                value={formData.phone_number} onChange={handleChange}
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password">
                {t("password")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password" name="password" type="password" placeholder="********" required
                value={formData.password} onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold mt-4" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : t("signUp")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-8 border-t pt-6 bg-secondary/20">
          <div className="text-sm text-foreground">
            {t("alreadyAccount")}{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              {t("logIn")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
