import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/AdminHeader";
import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Loader2, FileDown } from "lucide-react";
import { apiFetch } from "@/lib/api";

const ImportStaff = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handlePreview = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await apiFetch("/admin/staff/bulk/preview", {
        method: "POST",
        body: formData,
      });

      setPreview(data);
    } catch (err: any) {
      toast({
        title: "Preview Failed",
        description: err.message,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleConfirm = async () => {
    if (!preview?.validStaff) return;

    setConfirmLoading(true);

    try {
      await apiFetch("/admin/staff/bulk/confirm", {
        method: "POST",
        body: JSON.stringify({ staff: preview.validStaff }),
      });

      toast({
        title: "Import Successful",
        description: "Staff imported successfully.",
      });

      navigate("/admin/staff");
    } catch (err: any) {
      toast({
        title: "Import Failed",
        description: err.message,
        variant: "destructive",
      });
    }

    setConfirmLoading(false);
  };

  const downloadErrors = () => {
    if (!preview?.errors || preview.errors.length === 0) return;

    const headers = Object.keys(preview.errors[0].data || {});

    const csvRows = [];

    csvRows.push([...headers, "Reason"].join(","));

    preview.errors.forEach((e: any) => {
      const rowValues = headers.map(
        (h) => `"${(e.data?.[h] ?? "").toString().replace(/"/g, '""')}"`,
      );

      rowValues.push(`"${e.reason}"`);

      csvRows.push(rowValues.join(","));
    });

    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "staff_failed_rows.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <AdminHeader />

      <PageWrapper>
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/admin/staff")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Staff
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Bulk Import Staff</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <Button onClick={handlePreview} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Preview Import
                  </>
                )}
              </Button>

              {preview && (
                <>
                  <div className="p-4 bg-muted rounded-lg space-y-1">
                    <p>Total Rows: {preview.totalRows}</p>
                    <p className="text-green-600">
                      Valid: {preview.validCount}
                    </p>
                    <p className="text-red-600">
                      Invalid: {preview.invalidCount}
                    </p>
                  </div>

                  {preview.invalidCount > 0 && (
                    <Button variant="outline" onClick={downloadErrors}>
                      <FileDown className="w-4 h-4 mr-2" />
                      Download Failed Rows
                    </Button>
                  )}

                  {preview.validCount > 0 && (
                    <Button
                      className="w-full"
                      onClick={handleConfirm}
                      disabled={confirmLoading}
                    >
                      {confirmLoading ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4 mr-2" />
                          Importing...
                        </>
                      ) : (
                        "Confirm Import"
                      )}
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </main>
      </PageWrapper>
    </div>
  );
};

export default ImportStaff;
