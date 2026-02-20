import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/AdminHeader";
import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Upload, ArrowLeft, Loader2, FileDown } from "lucide-react";
import { apiFetch } from "@/lib/api";

const ImportStudents = () => {
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
      const data = await apiFetch("/admin/students/bulk/preview", {
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
    setConfirmLoading(true);

    try {
      await apiFetch("/admin/students/bulk/confirm", {
        method: "POST",
        body: JSON.stringify({ students: preview.validStudents }),
      });

      toast({
        title: "Import Successful",
        description: "Students imported successfully.",
      });

      navigate("/admin/students");
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
    if (!preview?.errors) return;

    const csv =
      "row,reason\n" +
      preview.errors.map((e: any) => `${e.row},"${e.reason}"`).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "failed_rows.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <AdminHeader />
      <PageWrapper>
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/admin/students")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Bulk Import Students</CardTitle>
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
                  <div className="p-4 bg-muted rounded-lg">
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

export default ImportStudents;
