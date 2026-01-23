import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Upload } from "lucide-react";

export function ProfileTab() {
  // Mock user data for frontend demo
  const mockUser = {
    email: "demo@sacviet.vn",
    fullName: "Nguyễn Văn A",
    phone: "0123456789"
  };

  const [formData, setFormData] = useState({
    username: mockUser.email.split("@")[0],
    fullName: mockUser.fullName || "",
    email: mockUser.email || "",
    phone: mockUser.phone || "",
    gender: "female",
    birthDate: "1990-01-01",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update profile API call
    alert("Cập nhật thông tin thành công!");
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl text-gray-900">Hồ Sơ Của Tôi</h2>
        <p className="text-gray-500 text-sm mt-1">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Username */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-gray-700">Tên đăng nhập</Label>
            <div className="col-span-3">
              <Input
                value={formData.username}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-gray-700">Tên</Label>
            <div className="col-span-3">
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nhập tên của bạn"
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-gray-700">Email</Label>
            <div className="col-span-3 flex items-center gap-3">
              <Input
                value={formData.email.replace(/(?<=.{2}).*(?=@)/g, match => '*'.repeat(match.length))}
                disabled
                className="flex-1 bg-gray-50"
              />
              <Button variant="link" className="text-blue-600">
                Thay Đổi
              </Button>
            </div>
          </div>

          {/* Phone */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-gray-700">Số điện thoại</Label>
            <div className="col-span-3 flex items-center gap-3">
              <Input
                value={formData.phone ? `*********${formData.phone.slice(-2)}` : "**********"}
                disabled
                className="flex-1 bg-gray-50"
              />
              <Button variant="link" className="text-blue-600">
                Thay Đổi
              </Button>
            </div>
          </div>

          {/* Gender */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-gray-700 pt-2">
              Giới tính
              <span className="ml-1 text-gray-400">
                <svg className="inline w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
            </Label>
            <div className="col-span-3">
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">Nam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">Nữ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">Khác</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Birth Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-gray-700">
              Ngày sinh
              <span className="ml-1 text-gray-400">
                <svg className="inline w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
            </Label>
            <div className="col-span-3 flex items-center gap-3">
              <Input
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                placeholder="DD/MM/YYYY"
              />
              <Button variant="link" className="text-blue-600">
                Thay Đổi
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-start-2 col-span-3">
              <Button 
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-8"
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Avatar Upload */}
        <div className="lg:col-span-1 flex flex-col items-center border-l border-gray-200 pl-8">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4 border-4 border-gray-100">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <span className="text-4xl text-gray-500">
                  {mockUser.fullName?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
          
          <input
            type="file"
            id="avatar-upload"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleAvatarChange}
          />
          
          <Label htmlFor="avatar-upload">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 hover:border-red-600 hover:text-red-600 cursor-pointer"
              onClick={() => document.getElementById("avatar-upload")?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Chọn Ảnh
            </Button>
          </Label>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">Dung lượng file tối đa 1 MB</p>
            <p className="text-xs text-gray-500">Định dạng: .JPEG, .PNG</p>
          </div>
        </div>
      </form>
    </div>
  );
}