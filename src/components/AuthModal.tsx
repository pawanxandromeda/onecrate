import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLogin, useSignup } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/user';

declare global {
  interface Window {
    google: any;
  }
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const setUser = useSetAtom(userAtom);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const { toast } = useToast();
  const googleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google SDK dynamically to ensure availability
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        if (window.google && googleRef.current) {
          console.log("Google SDK loaded. Initializing...");
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
            callback: handleGoogleCallback,
          });
          window.google.accounts.id.renderButton(googleRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
          });
        }
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else if (window.google && googleRef.current) {
      console.log("Google SDK already loaded. Initializing...");
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
        callback: handleGoogleCallback,
      });
      window.google.accounts.id.renderButton(googleRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
      });
    }
  }, [isOpen]);

  const handleGoogleCallback = async (response: any) => {
    try {
      const res = await fetch("https://onecrate-backend.onrender.com/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error("Invalid JSON from server: " + text);
      }

      if (!res.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("token", data.token);
      setUser(data.user);
      toast({ title: "Logged in with Google" });

      // Trigger onSuccess and close modal
      onSuccess?.();
      onClose();

      // Explicitly navigate to profile to handle mobile redirects
      window.location.href = "/#profile";
    } catch (err: any) {
      console.error("Google login error:", err);
      setGoogleError(err.message || "Something went wrong");
      toast({
        title: "Google Login Failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    try {
      if (type === 'login') {
        const res = await loginMutation.mutateAsync({ email: loginEmail, password: loginPassword });
        localStorage.setItem('token', res.token);
        setUser(res.user);
        toast({ title: "Logged in successfully" });
        onSuccess?.();
        onClose();
      } else {
        if (signupPassword !== signupConfirmPassword) {
          toast({ title: "Password Mismatch", description: "Passwords do not match", variant: "destructive" });
          return;
        }
        const res = await signupMutation.mutateAsync({
          fullName: signupName,
          email: signupEmail,
          phone: signupPhone,
          password: signupPassword,
        });
        localStorage.setItem('token', res.token);
        setUser(res.user);
        toast({ title: "Account created successfully" });
        onSuccess?.();
        onClose();
      }
    } catch (err: any) {
      console.error(`${type} error:`, err);
      toast({
        title: "Authentication Error",
        description: err.response?.data?.message || err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Welcome to 12 Crate
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-[40px] flex justify-center mb-2">
          {googleError ? (
            <div className="text-center text-sm text-red-600">{googleError}</div>
          ) : (
            <div ref={googleRef} className="w-full" />
          )}
        </div>

        <div className="text-center text-sm text-muted-foreground mb-4">or continue with email</div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <motion.form
              onSubmit={(e) => handleSubmit(e, 'login')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <InputField
                id="login-email"
                icon={<Mail />}
                label="Email"
                type="email"
                value={loginEmail}
                onChange={setLoginEmail}
                disabled={loginMutation.isPending}
              />
              <InputField
                id="login-password"
                icon={<Lock />}
                label="Password"
                type={showPassword ? "text" : "password"}
                value={loginPassword}
                onChange={setLoginPassword}
                toggleType
                toggleState={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                disabled={loginMutation.isPending}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </motion.form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <motion.form
              onSubmit={(e) => handleSubmit(e, 'signup')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <InputField
                id="signup-name"
                icon={<User />}
                label="Full Name"
                value={signupName}
                onChange={setSignupName}
                disabled={signupMutation.isPending}
              />
              <InputField
                id="signup-email"
                icon={<Mail />}
                label="Email"
                type="email"
                value={signupEmail}
                onChange={setSignupEmail}
                disabled={signupMutation.isPending}
              />
              <InputField
                id="signup-phone"
                icon={<Phone />}
                label="Phone"
                type="tel"
                value={signupPhone}
                onChange={setSignupPhone}
                disabled={signupMutation.isPending}
              />
              <InputField
                id="signup-password"
                icon={<Lock />}
                label="Password"
                type={showPassword ? "text" : "password"}
                value={signupPassword}
                onChange={setSignupPassword}
                toggleType
                toggleState={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                disabled={signupMutation.isPending}
              />
              <InputField
                id="signup-confirm-password"
                icon={<Lock />}
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={signupConfirmPassword}
                onChange={setSignupConfirmPassword}
                toggleType
                toggleState={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={signupMutation.isPending}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Creating account..." : "Create Account"}
              </Button>
            </motion.form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface InputFieldProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  toggleType?: boolean;
  toggleState?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  icon,
  label,
  type = "text",
  value,
  onChange,
  toggleType = false,
  toggleState,
  onToggle,
  disabled,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <span className="absolute left-3 top-3 h-4 w-4 text-gray-400">{icon}</span>
      <Input
        id={id}
        type={type}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="pl-10 pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
      />
      {toggleType && onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
        >
          {toggleState ? <EyeOff /> : <Eye />}
        </button>
      )}
    </div>
  </div>
);

export default AuthModal;