import type * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type ChangeEmailDialogProps = {
  isOpen: boolean
  onClose: () => void
  currentEmail: string
  currentPhoneNumber: string
}

export function ChangeEmailDialog({ isOpen, onClose, currentEmail, currentPhoneNumber }: ChangeEmailDialogProps) {
  const [step, setStep] = useState(1) // 1: Verify password, 2: Enter new email, 3: Verify OTP
  const [newEmail, setNewEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([])
  const [resendTimer, setResendTimer] = useState(254) // 4 minutes 14 seconds in seconds
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setNewEmail("")
      setPassword("")
      setOtp(Array(6).fill(""))
      setResendTimer(254)
      setIsTimerActive(false)
      setEmailError(null)
    }
  }, [isOpen])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTimerActive && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    } else if (resendTimer === 0) {
      setIsTimerActive(false)
    }
    return () => clearInterval(timer)
  }, [isTimerActive, resendTimer])

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Move focus to the next input
    if (value && index < otp.length - 1) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleResendOtp = () => {
    setResendTimer(254) // Reset timer to 4:14
    setIsTimerActive(true)
    // Logic to resend OTP
    console.log("Resending OTP...")
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("Email không được để trống.")
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError("Địa chỉ email không hợp lệ.")
      return false
    }
    setEmailError(null)
    return true
  }

  const handleNewEmailSubmit = () => {
    if (validateEmail(newEmail)) {
      setStep(3)
      setIsTimerActive(true)
    }
  }

  const renderContent = () => {
    switch (step) {
      case 1: // Verify password
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-semibold">Thay đổi Email</DialogTitle>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </DialogHeader>
            <DialogDescription className="text-left text-gray-600 ">
              <div className="text-xl font-semibold text-black">Xác thực tài khoản</div> Để thay đổi email, vui lòng
              nhập mật khẩu của bạn để xác thực tài khoản {currentPhoneNumber}
            </DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              onClick={() => setStep(2)}
              disabled={!password}
              className="w-full bg-[#FF8800] hover:bg-orange-600 text-white py-2 rounded-md font-semibold"
            >
              Tiếp tục
            </Button>
          </>
        )
      case 2: // Enter new email
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-semibold">Địa chỉ Email</DialogTitle>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </DialogHeader>
            <DialogDescription className="text-center text-gray-600">
              Xác thực email để nhận các thông tin liên quan đến tài khoản cá nhân, thông tin giao dịch, chính sách và
              các ưu đãi mới của Chợ Tốt
            </DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-email">Địa chỉ Email *</Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="Nhập địa chỉ email mới"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value)
                    if (emailError) validateEmail(e.target.value)
                  }}
                  required
                  className={cn(emailError && "border-red-500")}
                />
                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Quay lại
              </Button>
              <Button
                onClick={handleNewEmailSubmit}
                disabled={!newEmail || !!emailError}
                className="flex-1 bg-[#FF8800] hover:bg-orange-600 text-white py-2 rounded-md font-semibold"
              >
                Tiếp tục
              </Button>
            </div>
          </>
        )
      case 3: // Verify OTP
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-semibold">Xác thực OTP</DialogTitle>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </DialogHeader>
            <DialogDescription className="text-center text-gray-600 mb-6">
              Nhập mã OTP được gửi đến địa chỉ Email: <span className="font-semibold">{newEmail || currentEmail}</span>
            </DialogDescription>
            <div className="text-center text-sm text-gray-500 mb-4">
              <button
                onClick={handleResendOtp}
                disabled={isTimerActive}
                className={cn(
                  "text-blue-600 hover:underline",
                  isTimerActive ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                )}
              >
                Gửi lại mã:
              </button>{" "}
              ({formatTime(resendTimer)})
            </div>
            <div className="flex justify-center gap-2 mb-8">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  // Fix: Ensure the ref callback explicitly returns void
                  ref={(el) => {
                    otpInputsRef.current[index] = el
                  }}
                  className="w-10 h-10 text-center text-lg font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                />
              ))}
            </div>
            <div className="flex justify-between gap-4">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Quay lại
              </Button>
              <Button
                onClick={() => {
                  // Final submission logic
                  console.log("OTP submitted:", otp.join(""))
                  onClose()
                }}
                disabled={otp.join("").length !== 6}
                className="flex-1 bg-[#FF8800] hover:bg-orange-600 text-white py-2 rounded-md font-semibold"
              >
                Tiếp tục
              </Button>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">{renderContent()}</DialogContent>
    </Dialog>
  )
}
