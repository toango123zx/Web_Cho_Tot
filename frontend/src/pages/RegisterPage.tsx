import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { registerAPI } from "@/services/api"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleRegister = async () => {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      toast.warning("Please fill in all fields.")
      return
    }

    if (!validateEmail(trimmedEmail)) {
      toast.warning("Please enter a valid email address.")
      return
    }

    try {
      setLoading(true)
      const res = await registerAPI(trimmedName, trimmedEmail, trimmedPassword)
      setLoading(false)

      if (!res.error) {
        toast.success("Register successful!")
        navigate("/login")
      } else {
        const errorMsg = Array.isArray(res.message) ? res.message[0] : res.message
        toast.error(errorMsg || "Registration failed.")
      }
    } catch (error: any) {
      setLoading(false)
      const errMsg = error?.response?.data?.message || "An error occurred. Please try again."
      toast.error(errMsg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full sm:max-w-md">
        <h2 className="text-lg sm:text-2xl font-semibold mb-6 text-center">Create an Account</h2>

        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4"
        />
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
        <Button className="w-full" onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>

  )
}
