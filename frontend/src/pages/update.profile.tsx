"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export default function Component() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h1>
        <div className="flex bg-white shadow-md rounded-lg overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin cá nhân</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full text-left px-3 py-2 text-blue-600 bg-blue-50 rounded-md text-sm font-medium"
                >
                  Thông tin cá nhân
                </button>
                <button
                  onClick={() => navigate("/meetings")}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm"
                >
                  Lên kế hoạch cả hội
                </button>
                <button
                  onClick={() => navigate("/account-settings")}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm"
                >
                  Cài đặt tài khoản
                </button>
                <button
                  onClick={() => navigate("/login-history")}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm"
                >
                  Quản lý lịch sử đăng nhập
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Hồ sơ cá nhân</h1>

              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                        Họ và tên *
                      </Label>
                      <Input id="name" defaultValue="Võ Văn Minh" className="w-full" required />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                        Số điện thoại *
                      </Label>
                      <Input id="phone" defaultValue="0974482032" className="w-full" readOnly required />
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                      Địa chỉ
                    </Label>
                    <Input id="address" placeholder="Địa chỉ" className="w-full" />
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="introduction" className="text-sm font-medium text-gray-700 mb-2 block">
                      Giới thiệu
                    </Label>
                    <Textarea
                      id="introduction"
                      placeholder="Viết vài dòng giới thiệu về gian hàng của bạn..."
                      className="w-full min-h-[100px] resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Tối đa 60 từ</p>
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="reference" className="text-sm font-medium text-gray-700 mb-2 block">
                      Tên gợi nhớ
                    </Label>
                    <Input
                      id="reference"
                      placeholder="http://localhost:5173/user/trang-tho"
                      className="w-full text-blue-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tên gợi nhớ sau khi được cập nhật sẽ không thể thay đổi trong vòng 60 ngày tới.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Thông tin bảo mật</CardTitle>
                  <p className="text-sm text-gray-600">
                    Những thông tin dưới đây sẽ mang tính bảo mật. Chỉ bạn mới có thể thấy và chỉnh sửa những thông tin
                    này.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Email</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">vvm1004@gmail.com</span>
                      <button
                        onClick={() => navigate("/change-email")}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Thay đổi
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Giới tính</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Nam</SelectItem>
                          <SelectItem value="female">Nữ</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Ngày, tháng, năm sinh</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn ngày sinh" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1990">1990</SelectItem>
                          <SelectItem value="1991">1991</SelectItem>
                          <SelectItem value="1992">1992</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="bg-gray-600 hover:bg-gray-700 text-white px-8">LƯU THAY ĐỔI</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
