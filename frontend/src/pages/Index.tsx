import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Train,
  Users,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import LoginHeader from "@/components/LoginHeader";
import LoginFooter from "@/components/LoginFooter";
import StudentLoginForm from "@/components/StudentLoginForm";
import StaffLoginForm from "@/components/StaffLoginForm";
import PageWrapper from "@/components/PageWrapper";
import AdminLoginForm from "@/components/AdminLoginForm";
import { motion } from "framer-motion";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const Index = () => {
  const [activeTab, setActiveTab] = useState("student");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LoginHeader />

      <PageWrapper>
        <main className="flex-1 flex items-center justify-center px-4 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: EASE_OUT }}
            className="w-full max-w-md space-y-5"
          >
            {/* ── Branding ───────────────────────────────────────────── */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                  <Train className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                QuickConcession
              </h1>
              <p className="text-[13px] text-muted-foreground">
                Railway Concession Management System
              </p>
              <p className="text-[12px] text-muted-foreground/70">
                Government Polytechnic Mumbai
              </p>
            </div>

            {/* ── Login Card ─────────────────────────────────────────── */}
            <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="text-center px-6 pt-6 pb-4 border-b border-border bg-muted/20">
                <CardTitle className="text-base font-semibold text-foreground">
                  Sign In to Your Portal
                </CardTitle>
                <CardDescription className="text-[13px] text-muted-foreground mt-0.5">
                  Use your college-issued credentials to continue
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pt-5 pb-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  {/* Tab Bar */}
                  <TabsList className="grid w-full grid-cols-3 mb-6 h-10 rounded-lg bg-muted p-0.5 gap-0.5">
                    <TabsTrigger
                      value="student"
                      className="
                        flex items-center justify-center gap-1.5 rounded-md h-full
                        text-[12px] font-medium text-muted-foreground
                        data-[state=active]:bg-card data-[state=active]:text-primary
                        data-[state=active]:shadow-sm data-[state=active]:font-semibold
                        transition-all duration-150
                      "
                    >
                      <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                      Student
                    </TabsTrigger>
                    <TabsTrigger
                      value="staff"
                      className="
                        flex items-center justify-center gap-1.5 rounded-md h-full
                        text-[12px] font-medium text-muted-foreground
                        data-[state=active]:bg-card data-[state=active]:text-primary
                        data-[state=active]:shadow-sm data-[state=active]:font-semibold
                        transition-all duration-150
                      "
                    >
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      Staff
                    </TabsTrigger>
                    <TabsTrigger
                      value="admin"
                      className="
                        flex items-center justify-center gap-1.5 rounded-md h-full
                        text-[12px] font-medium text-muted-foreground
                        data-[state=active]:bg-card data-[state=active]:text-primary
                        data-[state=active]:shadow-sm data-[state=active]:font-semibold
                        transition-all duration-150
                      "
                    >
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                      Admin
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="student" className="mt-0">
                    <StudentLoginForm />
                  </TabsContent>

                  <TabsContent value="staff" className="mt-0">
                    <StaffLoginForm />
                  </TabsContent>

                  <TabsContent value="admin" className="mt-0">
                    <AdminLoginForm />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* ── Notice Panel ───────────────────────────────────────── */}
            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 px-4 py-3.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Notice:</span>{" "}
                Use your college-issued credentials to login. Contact the IT
                Department during office hours{" "}
                <span className="font-medium text-foreground">
                  (10 AM – 5 PM)
                </span>{" "}
                if you face any issues.
              </p>
            </div>
          </motion.div>
        </main>

        <LoginFooter />
      </PageWrapper>
    </div>
  );
};

export default Index;
