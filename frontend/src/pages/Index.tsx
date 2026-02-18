import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Train, Users, GraduationCap } from "lucide-react";
import LoginHeader from "@/components/LoginHeader";
import LoginFooter from "@/components/LoginFooter";
import StudentLoginForm from "@/components/StudentLoginForm";
import StaffLoginForm from "@/components/StaffLoginForm";
import PageWrapper from "@/components/PageWrapper";
import AdminLoginForm from "@/components/AdminLoginForm";

const Index = () => {
  const [activeTab, setActiveTab] = useState("student");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LoginHeader />

      <PageWrapper>
        <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-md space-y-6">
            {/* Title Section */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Train className="w-8 h-8 text-accent" />
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                QuickConcession
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Railway Concession Management System
              </p>
            </div>

            {/* Login Card */}
            <Card className="login-card border-2">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-heading text-foreground">
                  Welcome Back
                </CardTitle>
                <CardDescription>
                  Sign in to access your concession portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted h-12">
                    <TabsTrigger
                      value="student"
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-10 font-medium"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Student
                    </TabsTrigger>
                    <TabsTrigger
                      value="staff"
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-10 font-medium"
                    >
                      <Users className="w-4 h-4" />
                      Staff
                    </TabsTrigger>
                    <TabsTrigger
                      value="admin"
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-10 font-medium"
                    >
                      <Users className="w-4 h-4" />
                      Admin
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="student" className="mt-0">
                    <StudentLoginForm />
                  </TabsContent>

                  <TabsContent value="staff" className="mt-0">
                    <StaffLoginForm />
                  </TabsContent>

                  <TabsContent value="admin">
                    <AdminLoginForm />
                  </TabsContent>

                </Tabs>
              </CardContent>
            </Card>

            {/* Info Box */}
            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <p className="text-xs text-muted-foreground text-center">
                <strong className="text-foreground">Note:</strong> Use your
                college-issued credentials to login. Contact the IT department
                if you face any issues.
              </p>
            </div>
          </div>
        </main>

        <LoginFooter />
      </PageWrapper>
    </div>
  );
};

export default Index;
