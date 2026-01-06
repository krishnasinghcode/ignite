import { useState } from "react";
import { AuthAPI } from "@/api/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const sendOtp = async () => {
        setLoading(true);
        try {
            await AuthAPI.sendResetOtp(email);
            setStep(2);
        } catch {
            alert("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        setLoading(true);
        try {
            await AuthAPI.verifyResetOtp(email, otp);
            setStep(3);
        } catch {
            alert("OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        setLoading(true);
        try {
            await AuthAPI.resetPassword(
                email,
                passwords.newPassword,
                passwords.confirmPassword
            );
            setStep(4);
        } catch {
            alert("Password reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-[400px]">
            <CardHeader className="justify-center">
                <CardTitle>Forgot Password</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {step === 1 && (
                    <>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <div className="flex justify-center">
                            <Button onClick={verifyOtp} disabled={loading}>
                                Verify OTP
                            </Button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <Label>New Password</Label>
                        <Input
                            type="password"
                            value={passwords.newPassword}
                            onChange={(e) =>
                                setPasswords({
                                    ...passwords,
                                    newPassword: e.target.value,
                                })
                            }
                        />

                        <Label>Confirm Password</Label>
                        <Input
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) =>
                                setPasswords({
                                    ...passwords,
                                    confirmPassword: e.target.value,
                                })
                            }
                        />
                        <div className="flex justify-center">
                            <Button onClick={resetPassword} disabled={loading}>
                                Reset Password
                            </Button>
                        </div>
                    </>
                )}

                {step === 4 && (
                    <p className="text-sm text-green-600">
                        Password reset successful.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
