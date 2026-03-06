import { Link, useParams } from "react-router-dom";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function ProductDetailPlaceholderPage() {
  const { outfitId } = useParams<{ outfitId: string }>();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[#c1272d] to-[#d4af37] bg-clip-text text-transparent mb-2">
            Chi tiết sản phẩm
          </h1>
          <p className="text-gray-600">
            Route placeholder cho sản phẩm #{outfitId ?? "-"} (chưa triển khai Product Detail).
          </p>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Đang phát triển</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <PackageSearch className="w-5 h-5 text-[#c1272d]" />
              <p>Trang chi tiết sản phẩm admin sẽ được triển khai ở bước tiếp theo.</p>
            </div>

            <Button asChild variant="outline" className="gap-2">
              <Link to="/admin/products">
                <ArrowLeft className="w-4 h-4" />
                Quay lại danh sách sản phẩm
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
