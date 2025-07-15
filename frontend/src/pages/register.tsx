import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { BsApple } from "react-icons/bs";

export default function RegisterForm() {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: gọi API đăng ký
    console.log("Đăng ký...");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* Logo */}
          <div className="text-left">
            <div className="text-left">
              <img src="/image/logo.png" alt="Chợ Tốt" className="h-8 mb-8" />
            </div>
            <h2 className="text-xl font-semibold">Đăng ký tài khoản</h2>
          </div>


          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input id="name" type="text" placeholder="Nhập họ và tên" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Nhập email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" placeholder="Tạo mật khẩu" required />
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              ĐĂNG KÝ
            </Button>
          </form>

          {/* Hoặc đăng nhập bằng */}
          <div className="relative text-center text-sm text-gray-500">
            <span className="bg-white px-2 relative z-10">Hoặc đăng nhập bằng</span>
            <div className="absolute top-1/2 left-0 w-full border-t border-gray-200 z-0"></div>
          </div>

          <div className="space-y-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <FaFacebook className="mr-2" /> Facebook
            </Button>
            <Button className="w-full bg-white border hover:bg-gray-50 text-black">
              <FaGoogle className="mr-2" /> Google
            </Button>
            <Button className="w-full bg-black hover:bg-gray-900 text-white">
              <BsApple className="mr-2" /> Apple ID
            </Button>
          </div>

          <div className="text-center text-sm mt-2">
            Đã có tài khoản?{" "}
            <Button
              variant="link"
              className="text-blue-600 font-medium p-0 h-auto"
              onClick={() => navigate("/login")}
            >
              Đăng nhập ngay
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
