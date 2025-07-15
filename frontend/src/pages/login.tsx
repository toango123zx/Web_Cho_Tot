import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { loginAPI } from "@/services/api"
import { useCurrentApp } from "@/components/context/app.context"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setIsAuthenticated, setUser } = useCurrentApp()

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleLogin = async () => {
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      toast.warning("Please enter both email and password.")
      return
    }

    if (!validateEmail(trimmedEmail)) {
      toast.warning("Please enter a valid email address.")
      return
    }
    try {
      setLoading(true)
      const response = await loginAPI(trimmedEmail, trimmedPassword)
      setLoading(false)

      if (response?.data) {
        localStorage.setItem("access_token", response.data.access_token)
        setIsAuthenticated(true)
        setUser(response.data.user)
        toast.success("Login successful!")
        navigate("/")
      } else {
        const errorMsg = Array.isArray(response.message)
          ? response.message[0]
          : response.message
        toast.error(errorMsg || "Login failed.")
      }
    } catch (error: any) {
      setLoading(false)
      const errMsg =
        error?.response?.data?.message || "An error occurred. Please try again."
      toast.error(errMsg)
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full sm:max-w-md">
        <h2 className="text-lg sm:text-2xl font-semibold mb-6 text-center">Sign In</h2>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6"
        />
        <Button className="w-full" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
