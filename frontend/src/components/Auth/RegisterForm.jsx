import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import { registerUser } from "../../services/authService";

const RegisterForm = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        const { confirmPassword, ...userData } = data;

        try {
            setLoading(true);

            const response = await registerUser(userData);

            toast.success(
                response.message || "Registration successful!"
            );

            navigate("/login");

        } catch (error) {

            console.error("Registration error:", error);

            toast.error(
                error.response?.data?.message ||
                "Registration failed!"
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
                <div className="mb-7 text-center">

                    <h2
                        className="
                            mt-5
                            text-3xl
                            font-bold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        Create an Account
                    </h2>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-gray-500
                            dark:text-slate-400
                        "
                    >
                        Start your journey with Clarify ISL.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >

                    {/* First Name + Last Name */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* First Name */}
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
                                First Name
                            </label>

                            <input
                                type="text"
                                placeholder="John"
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

                                    ${errors.firstName
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-500/20"
                                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                                    }
                                `}
                                {...register("firstName", {
                                    required: "First Name is required",
                                    minLength: {
                                        value: 2,
                                        message: "At least 2 characters",
                                    },
                                })}
                            />

                            {errors.firstName && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.firstName.message}
                                </p>
                            )}

                        </div>

                        {/* Last Name */}
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
                                Last Name
                            </label>

                            <input
                                type="text"
                                placeholder="Doe"
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

                                    ${errors.lastName
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-500/20"
                                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                                    }
                                `}
                                {...register("lastName", {
                                    required: "Last Name is required",
                                    minLength: {
                                        value: 2,
                                        message: "At least 2 characters",
                                    },
                                })}
                            />

                            {errors.lastName && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.lastName.message}
                                </p>
                            )}

                        </div>

                    </div>

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
                            placeholder="john@example.com"
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
                            Password
                        </label>

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
                                    maxLength: {
                                        value: 20,
                                        message:
                                            "Password cannot exceed 20 characters",
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

                        {!errors.password && (
                            <p
                                className="
                                    mt-1.5
                                    text-xs
                                    text-gray-400
                                    dark:text-slate-500
                                "
                            >
                                Minimum 6 characters
                            </p>
                        )}

                        {errors.password && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.password.message}
                            </p>
                        )}

                    </div>

                    {/* Confirm Password */}
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
                            Confirm Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Re-enter your password"
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

                                    ${errors.confirmPassword
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-500/20"
                                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                                    }
                                `}
                                {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: (value) =>
                                        value === password ||
                                        "Passwords do not match",
                                })}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
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
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                            >
                                {showConfirmPassword ? (
                                    <Eye size={20} />
                                ) : (
                                    <EyeOff size={20} />
                                )}
                            </button>

                        </div>

                        {errors.confirmPassword && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}

                    </div>

                    {/* Submit */}
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
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                    {/* Login */}
                    <p
                        className="
                            pt-2
                            text-center
                            text-sm
                            text-gray-600
                            dark:text-slate-400
                        "
                    >
                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="
                                font-semibold
                                text-blue-600
                                transition
                                hover:text-blue-700
                                dark:text-blue-400
                                dark:hover:text-blue-300
                            "
                        >
                            Sign in
                        </Link>

                    </p>

                </form>

            </div>

        </div>
    );
};

export default RegisterForm;