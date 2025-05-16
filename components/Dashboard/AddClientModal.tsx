"use client";
import React, { useCallback, useState, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UserPlus,
  Mail,
  Phone,
  Building2,
  MapPin,
  FileText,
} from "lucide-react";
import { ClientFormData } from "@/lib/form/validation";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: ClientFormData) => void;
}

export function AddClientModal({
  isOpen,
  onClose,
  onSuccess,
}: AddClientModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    notes: "",
  });

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onSuccess(formData);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          company: "",
          address: "",
          notes: "",
        });
        onClose();
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, onSuccess, onClose]
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputClasses =
    "w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border-0 rounded-lg sm:rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm sm:text-base";
  const labelClasses =
    "flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2";

  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Contact" },
    { number: 3, title: "Additional" },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
              {/* Header section */}
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-blue-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                      <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Add New Client
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                        Enter client details below
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex justify-between mt-4 sm:mt-6">
                  {steps.map((step) => (
                    <div key={step.number} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${
                          currentStep === step.number
                            ? "bg-blue-600 text-white"
                            : currentStep > step.number
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.number}
                      </div>
                      <span className="hidden sm:block ml-2 text-xs sm:text-sm font-medium text-gray-600">
                        {step.title}
                      </span>
                      {step.number < 3 && (
                        <div className="w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 bg-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={onSubmit} className="p-4 sm:p-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {currentStep === 1 && (
                    <>
                      <div>
                        <label htmlFor="fullName" className={labelClasses}>
                          Full Name <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          className={inputClasses}
                          placeholder="Enter full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className={labelClasses}>
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Email Address
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          className={inputClasses}
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <div>
                        <label htmlFor="phone" className={labelClasses}>
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          className={inputClasses}
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="company" className={labelClasses}>
                          <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Company Name
                        </label>
                        <input
                          id="company"
                          type="text"
                          name="company"
                          className={inputClasses}
                          placeholder="Enter company name"
                          value={formData.company}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}

                  {currentStep === 3 && (
                    <>
                      <div>
                        <label htmlFor="address" className={labelClasses}>
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Address
                        </label>
                        <input
                          id="address"
                          type="text"
                          name="address"
                          className={inputClasses}
                          placeholder="Enter address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="notes" className={labelClasses}>
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Additional Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          className={`${inputClasses} resize-none`}
                          rows={4}
                          placeholder="Enter any additional notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}
                </motion.div>

                <div className="flex justify-between mt-6 sm:mt-8">
                  <button
                    type="button"
                    onClick={() =>
                      currentStep > 1 && setCurrentStep((step) => step - 1)
                    }
                    className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-700 hover:bg-gray-100 transition-colors
                      ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={currentStep === 1 || isLoading}
                  >
                    Previous
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((step) => step + 1)}
                      className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                      {isLoading ? "Saving..." : "Save Client"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
