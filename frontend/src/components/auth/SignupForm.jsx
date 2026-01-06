import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthAPI } from "@/api/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SignupForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        otp: "",
    });

    const sendOtp = async () => {
        setLoading(true);
        try {
            await AuthAPI.sendSignupOtp(form.email);
            setStep(2);
        } finally {
            setLoading(false);
        }
    };

    const verifySignup = async () => {
        setLoading(true);
        try {
            await AuthAPI.verifySignup(
                form.name,
                form.email,
                form.password,
                form.otp
            );
            setStep(3);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-[400px]">
            <CardHeader className="justify-center">
                <CardTitle>Signup</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {step === 1 && (
                    <>
                        <Label>Name</Label>
                        <Input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />

                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />

                        <div className="flex justify-center">
                            <Button onClick={sendOtp} disabled={loading}>
                                Send OTP
                            </Button>
                        </div>

                    </>
                )}

                {step === 2 && (
                    <>
                        <Label>OTP</Label>
                        <Input
                            value={form.otp}
                            onChange={(e) =>
                                setForm({ ...form, otp: e.target.value })
                            }
                        />
                        <div className="flex justify-center">
                        <Button onClick={verifySignup} disabled={loading}>
                            Verify & Signup
                        </Button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <p className="text-sm text-green-600">
                        Account created successfully.
                    </p>
                )}

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-primary font-medium hover:underline"
                    >
                        Log in
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
