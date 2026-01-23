import { useState } from "react";
import { Button } from "../ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { Badge } from "../ui/badge";

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  isDefault: boolean;
}

export function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Hóa Huynh",
      phone: "(+84) 352 015 349",
      addressLine1: "Toà S602, Vinhomes Grand Park, Nguyễn Xiễn, Long Bình, Quận 9, Thành phố Hồ Chí Minh",
      addressLine2: "Phường Long Bình, Thành Phố Thủ Đức, TP Hồ Chí Minh",
      isDefault: true
    }
  ]);

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-gray-900">Địa chỉ của tôi</h2>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Thêm địa chỉ mới
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg text-gray-900 border-b pb-2">Địa chỉ</h3>
        
        {addresses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Chưa có địa chỉ nào</p>
            <Button 
              variant="outline" 
              className="mt-4 border-red-600 text-red-600 hover:bg-red-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm địa chỉ đầu tiên
            </Button>
          </div>
        ) : (
          addresses.map((address) => (
            <div 
              key={address.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-gray-900">{address.name}</h4>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-600">{address.phone}</span>
                  </div>
                  
                  <div className="text-gray-600 text-sm space-y-1">
                    <p>{address.addressLine1}</p>
                    <p>{address.addressLine2}</p>
                  </div>
                  
                  {address.isDefault && (
                    <Badge className="mt-3 bg-red-100 text-red-600 border border-red-200">
                      Mặc định
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Cập nhật
                  </Button>
                  
                  <span className="text-gray-300">|</span>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(address.id)}
                    disabled={address.isDefault}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
              
              {!address.isDefault && (
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-gray-700 hover:bg-gray-50"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Thiết lập mặc định
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
