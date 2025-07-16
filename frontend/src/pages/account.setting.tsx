import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export default function AccountSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [allowContactByPhone, setAllowContactByPhone] = useState(false)

  const passwordsMatch = newPassword === confirmNewPassword && newPassword !== ""

  const handlePasswordChange = () => {
    console.log("Changing password:", { currentPassword, newPassword })
    setCurrentPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
  }

  return (
    <div className="p-0">
      {/* <h1 className="text-2xl font-bold text-gray-900 mb-8">Cài đặt tài khoản</h1> */}

      {/* Change Password Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Thay đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 mb-6">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Mật khẩu hiện tại *</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Mật khẩu hiện tại *"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">Mật khẩu mới *</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Mật khẩu mới *"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-new-password">Xác nhận mật khẩu mới *</Label>
              <Input
                id="confirm-new-password"
                type="password"
                placeholder="Xác nhận mật khẩu mới *"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              {!passwordsMatch && newPassword !== "" && confirmNewPassword !== "" && (
                <p className="text-sm text-red-500">Mật khẩu mới không khớp.</p>
              )}
            </div>
          </div>
          <Button
            onClick={handlePasswordChange}
            disabled={!currentPassword || !newPassword || !confirmNewPassword || !passwordsMatch}
            className={cn(
              "w-full bg-[#FF8800] hover:bg-orange-600 text-white py-2 rounded-md font-semibold",
              (!currentPassword || !newPassword || !confirmNewPassword || !passwordsMatch) &&
                "bg-[#C0C0C0] cursor-default pointer-events-none",
            )}
          >
            ĐỔI MẬT KHẨU
          </Button>
        </CardContent>
      </Card>

      {/* Contact Preference Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-lg font-semibold">Cho phép người mua liên lạc qua điện thoại</CardTitle>
              <p className="text-sm text-gray-600">
                Khi bật tính năng này, số điện thoại sẽ hiển thị trên tất cả tin đăng của bạn.
              </p>
            </div>
            <Switch
              checked={allowContactByPhone}
              onCheckedChange={setAllowContactByPhone}
              className="data-[state=checked]:bg-[#FF8800]"
            />
          </div>
          <a href="#" className="text-blue-600 hover:underline text-sm">
            Yêu cầu chấm dứt tài khoản
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
