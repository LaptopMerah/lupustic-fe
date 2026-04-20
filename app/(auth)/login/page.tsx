"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useAuth } from "@/hooks/useAuth"
import { login as loginApi } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const t = useTranslations("auth")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { loginState } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await loginApi({ email, password })
      await loginState(response.access_token)
      router.push("/")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("errorLogin"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-lg mx-auto py-12 px-4">
      <Card className="shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">{t("loginTitle")}</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {t("loginSubtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2 text-left">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="lupustic@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : t("signIn")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-8 border-t pt-6 bg-secondary/20">
          <div className="text-sm text-foreground">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              {t("createAccount")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
