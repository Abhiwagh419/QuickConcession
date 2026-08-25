const LoginFooter = () => {
  return (
    <footer className="bg-footer text-primary-foreground py-4 px-6">
      <div className="container mx-auto text-center">
        <p className="text-sm text-primary-foreground/80">
          This portal is intended for official use by Government Polytechnic
          Mumbai students and staff.
        </p>
        <p className="text-xs text-primary-foreground/60 mt-2">
          © {new Date().getFullYear()} Government Polytechnic Mumbai. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default LoginFooter;
