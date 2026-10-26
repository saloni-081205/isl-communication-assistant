import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import { loginUser } from "../../services/authService";

const LoginForm = () => {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const response = await loginUser(data);

            console.log("Login response:", response);

            if (!response.token) {
                toast.error("Login failed: token not received");
                return;
            }

            login(
                response.token,
                response.user || null
            );

            toast.success(
                response.message || "Login successful!"
            );

            navigate("/dashboard");

        } catch (error) {

            console.error("Login error:", error);

            toast.error(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">

            {/* Back to Home */}
            <Link
                to="/"
                className="
                    mb-5
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    text-gray-500
                    transition
                    hover:text-blue-600
                    dark:text-slate-400
                    dark:hover:text-blue-400
                "
            >
                <ArrowLeft size={16} />
                Back to Home
            </Link>

            {/* Glass Card */}
            <div
                className="
                    rounded-3xl
                    border
                    border-white/80
                    bg-white/75
                    px-6
                    py-8
                    shadow-2xl
                    backdrop-blur-2xl
                    transition-colors

                    dark:border-slate-700/60
                    dark:bg-slate-900/75

                    sm:px-8
                "
            >

                {/* Header */}
                <div className="mb-8 text-center">

                    <h2
                        className="
                            mt-5
                            text-3xl
                            font-bold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        Welcome Back
                    </h2>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-gray-500
                            dark:text-slate-400
                        "
                    >
                        Sign in to continue using Clarify ISL.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >

                    {/* Email */}
                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                dark:text-slate-300
                            "
                        >
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className={`
                                w-full
                                rounded-xl
                                border
                                px-4
                                py-3.5
                                outline-none
                                transition

                                bg-white/70
                                text-slate-800
                                placeholder:text-slate-400

                                dark:bg-slate-950/70
                                dark:text-white
                                dark:placeholder:text-slate-500

                                ${errors.email
                                    ? "border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-500/20"
                                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                                }
                            `}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message:
                                        "Please enter a valid email address",
                                },
                            })}
                        />

                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.email.message}
                            </p>
                        )}

                    </div>

                    {/* Password */}
                    <div>

                        <div className="mb-2 flex items-center justify-between">

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    dark:text-slate-300
                                "
                            >
                                Password
                            </label>

                        </div>

                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                className={`
                                    w-full
                                    rounded-xl
                                    border
                                    px-4
                                    py-3.5
                                    pr-12
                                    outline-none
                                    transition

                                    bg-white/70
                                    text-slate-800
                                    placeholder:text-slate-400

                                    dark:bg-slate-950/70
                                    dark:text-white
                                    dark:placeholder:text-slate-500

                                    ${errors.password
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-500/20"
                                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                                    }
                                `}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters",
                                    },
                                })}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                    transition
                                    hover:text-blue-600
                                    dark:text-slate-500
                                    dark:hover:text-blue-400
                                "
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <Eye size={20} />
                                ) : (
                                    <EyeOff size={20} />
                                )}
                            </button>

                        </div>

                        {errors.password && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.password.message}
                            </p>
                        )}

                    </div>

                    {/* Remember + Forgot */}
                    {/* <div
                        className="
                            flex
                            items-center
                            justify-between
                            text-sm
                        "
                    >

                        <label
                            className="
                                flex
                                cursor-pointer
                                items-center
                                gap-2
                            "
                        >

                            <input
                                type="checkbox"
                                className="
                                    h-4
                                    w-4
                                    rounded
                                    accent-blue-600
                                "
                            />

                            <span
                                className="
                                    text-gray-600
                                    dark:text-slate-400
                                "
                            >
                                Remember me
                            </span>

                        </label>

                        <button
                            type="button"
                            onClick={() =>
                                toast(
                                    "Forgot password feature coming soon"
                                )
                            }
                            className="
                                font-medium
                                text-blue-600
                                transition
                                hover:text-blue-700
                                dark:text-blue-400
                                dark:hover:text-blue-300
                            "
                        >
                            Forgot Password?
                        </button>

                    </div> */}

                    {/* Login */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            rounded-xl
                            bg-gradient-to-r
                            from-blue-600
                            to-cyan-500
                            py-3.5
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-blue-500/20
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            hover:from-blue-700
                            hover:to-cyan-600
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            disabled:hover:translate-y-0
                        "
                    >
                        {loading
                            ? "Signing In..."
                            : "Sign In"}
                    </button>

                    {/* Register */}
                    <p
                        className="
                            pt-2
                            text-center
                            text-sm
                            text-gray-600
                            dark:text-slate-400
                        "
                    >
                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="
                                font-semibold
                                text-blue-600
                                transition
                                hover:text-blue-700
                                dark:text-blue-400
                                dark:hover:text-blue-300
                            "
                        >
                            Create Account
                        </Link>

                    </p>

                </form>

            </div>

        </div>
    );
};

export default LoginForm;