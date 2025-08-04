import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const OTPInput = ({
    length = 6,
    onComplete,
    onBack,
    email,
    isLoading,
    title = "Enter 6-Digit Code",
    showResend = true,
    onResend

}) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const otpInputsRef = useRef([]);
    const containerRef = useRef(null);

    useEffect(() => {
        // Animate container entrance
        gsap.fromTo(containerRef.current,
            { opacity: 0, y: 30, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
        );

        // Animate OTP inputs individually with stagger
        setTimeout(() => {
            otpInputsRef.current.forEach((input, index) => {
                if (input) {
                    gsap.fromTo(input,
                        { opacity: 0, y: 20, rotateX: -90 },
                        {
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: "back.out(1.7)"
                        }
                    );
                }
            });
        }, 200);
    }, []);

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^[a-zA-Z0-9]*$/.test(value)) { // Allow alphanumeric characters
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto focus next input
            if (value && index < length - 1) {
                otpInputsRef.current[index + 1]?.focus();
            }

            // Check if OTP is complete
            if (newOtp.every(digit => digit !== '')) {
                onComplete(newOtp.join(''));
            }

            // Animate input on change
            gsap.to(otpInputsRef.current[index], {
                scale: 1.1,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (otp.every(digit => digit !== '')) {
            onComplete(otp.join(''));
        }


    };

    return (
        <div ref={containerRef} className="bg-white bg-opacity-95 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white border-opacity-30" style={{ opacity: 0 }}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* OTP Inputs */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-center" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#111827' }}>
                        {title}
                    </label>
                    <div className="flex justify-center space-x-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => otpInputsRef.current[index] = el}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500 transition-all duration-300 text-lg font-semibold"
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    color: '#111827'
                                }}
                            />
                        ))}
                    </div>
                    {email && (
                        <p className="text-xs text-center text-gray-500 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Code sent to {email}
                        </p>
                    )}
                </div>

                {/* Verify Button */}
                <button
                    type="submit"
                    disabled={isLoading || otp.some(digit => !digit)}
                    className="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-white font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden hover:scale-105 hover:shadow-xl"
                    style={{
                        background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '600'
                    }}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                        </div>
                    ) : (
                        <span>Verify OTP</span>
                    )}
                </button>

                {/* Navigation Options */}
                <div className="text-center space-y-2">
                    {showResend && onResend && (
                        <>
                            <button
                                type="button"
                                onClick={onResend}
                                className="text-xs font-medium hover:underline transition-colors duration-200"
                                style={{ color: '#4F46E5', fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}
                            >
                                Resend OTP
                            </button>
                            <br />
                        </>
                    )}
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="text-xs font-medium hover:underline transition-colors duration-200"
                            style={{ color: '#6B7280', fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}
                        >
                            Change Email
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default OTPInput;
