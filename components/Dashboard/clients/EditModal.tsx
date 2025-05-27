import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  FileText,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { ClientFormData, clientSchema } from "@/lib/form/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "react-international-phone";
import { isPhoneValid } from "@/lib/utils";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import "react-international-phone/style.css";
import { Client } from "@/typings";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { Label } from "@/components/ui/Label";

interface EditModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: ClientFormData) => Promise<void>;
}

export function EditModal({
  client,
  isOpen,
  onClose,
  onUpdate,
}: EditModalProps) {
  useLockBodyScroll(isOpen);
  const [phone, setPhone] = useState(client.phone || "");
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    trigger,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
    defaultValues: {
      fullName: client.name,
      email: client.email,
      phone: client.phone || "",
      company: client.company || "",
      address: client.address || "",
      notes: client.notes || "",
    },
  });

  const goToNextStep = async () => {
    const isValidStep = await trigger(
      currentStep === 1
        ? ["fullName", "email"]
        : currentStep === 2
          ? ["phone", "company"]
          : ["address", "notes"]
    );

    if (isValidStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleUpdate = useCallback(
    async (data: ClientFormData) => {
      setIsLoading(true);
      try {
        const cleanedData = {
          ...data,
          fullName: data.fullName.trim().replace(/\s+/g, " "),
          email: data.email.trim().toLowerCase(),
          phone:
            data.phone &&
            isPhoneValid(data.phone) &&
            data.phone.match(/^\+\d{1,3}$/)
              ? ""
              : data.phone,
          company: data.company?.trim().replace(/\s+/g, " ") || "",
          address: data.address?.trim().replace(/\s+/g, " ") || "",
          notes: data.notes?.trim().replace(/\s+/g, " ") || "",
        };

        await onUpdate(client.id, cleanedData);
        onClose();
        window.alert("Client updated successfully");
      } catch (error) {
        console.error("Error updating client:", error);
        window.alert("Failed to update client");
      } finally {
        setIsLoading(false);
      }
    },
    [client.id, onUpdate, onClose]
  );

  const handleFinalSubmit = async () => {
    const isValidStep = await trigger();
    if (isValidStep) {
      const formData = watch();
      await handleUpdate(formData);
    }
  };

  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Contact" },
    { number: 3, title: "Additional" },
  ] as const;

  const StepConnector = ({ active }: { active: boolean }) => (
    <div className="flex-1 h-0.5 mx-2">
      <div
        className={`h-full transition-colors duration-300 ${
          active ? "bg-blue-500" : "bg-gray-200"
        }`}
      />
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 h-full backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      >
        <div className="bg-white rounded-lg xs:rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] sm:max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 xs:gap-4">
                <div className="bg-yellow-100 p-2 sm:p-3 rounded-lg xs:rounded-xl">
                  <User className="size-5 xs:size-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl xs:text-2xl font-bold text-gray-900">
                    Edit Client
                  </h2>
                  <p className="text-xs xs:text-sm text-gray-500 mt-0.5 xs:mt-1">
                    Update client information
                  </p>
                </div>
              </div>
              <Button
                onClick={onClose}
                className="p-1.5 sm:p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
                fullWidth={false}
              >
                <X className="size-5 text-gray-500" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-4 xs:mt-6 px-2">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center">
                    <div
                      className={`
                            flex items-center justify-center w-8 h-8 rounded-full
                            text-sm font-medium transition-colors duration-300
                            ${
                              currentStep === step.number
                                ? "bg-yellow-600 text-white"
                                : currentStep > step.number
                                  ? "bg-yellow-500 text-white"
                                  : "bg-gray-200 text-gray-600"
                            }
                          `}
                    >
                      {step.number}
                    </div>
                    <span className="hidden sm:block ml-3 text-sm font-medium text-gray-600">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <StepConnector active={currentStep > step.number} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form className="flex-1 overflow-y-auto p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 xs:space-y-6"
            >
              {currentStep === 1 && (
                <>
                  <InputField
                    label={Label(User, "Full Name", true)}
                    placeholder="Enter full name"
                    disabled={isLoading}
                    {...register("fullName")}
                    error={errors.fullName?.message}
                  />

                  <InputField
                    label={Label(Mail, "Email Address", true)}
                    type="email"
                    placeholder="Enter email address"
                    disabled={isLoading}
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div>
                    <label htmlFor="phone" className="label-classes">
                      <Phone className="size-3 xs:size-4 mr-2" />
                      Phone Number (Optional)
                    </label>
                    <PhoneInput
                      defaultCountry="ng"
                      value={watch("phone")}
                      onChange={(value) => {
                        setPhone(value);
                        setValue("phone", value);
                      }}
                      inputClassName="w-full px-4 py-2 text-sm border focus:outline-none focus:ring-1 focus:ring-yellow-300 text-xl"
                    />
                    {errors.phone && (
                      <p className="text-xs xs:text-sm text-red-600">
                        {errors.phone?.message}
                      </p>
                    )}
                  </div>

                  <InputField
                    label={Label(Building2, "Company Name (Optional)")}
                    placeholder="Enter company name"
                    disabled={isLoading}
                    {...register("company")}
                    error={errors.company?.message}
                  />
                </>
              )}

              {currentStep === 3 && (
                <>
                  <InputField
                    label={Label(MapPin, "Address (Optional)")}
                    placeholder="Enter address"
                    disabled={isLoading}
                    {...register("address")}
                    error={errors.address?.message}
                  />

                  <div>
                    <label htmlFor="notes" className="label-classes">
                      <FileText className="size-3 xs:size-4 mr-2" />
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      className="w-full px-3 py-2 sm:px-4 bg-gray-50 border-0 rounded-lg outline-none focus:ring-1 focus:ring-yellow-500 transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm xs:text-base resize-none"
                      rows={4}
                      placeholder="Enter any additional notes"
                      {...register("notes")}
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}
            </motion.div>
          </form>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-gray-100 flex-shrink-0 flex justify-between">
            <Button
              onClick={() =>
                currentStep > 1 && setCurrentStep((step) => step - 1)
              }
              disabled={currentStep === 1 || isLoading}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              fullWidth={false}
            >
              <ArrowLeft className="size-4 xs:size-5 mr-2" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={goToNextStep}
                disabled={isLoading}
                className="bg-yellow-600 hover:bg-yellow-700"
                fullWidth={false}
              >
                Next
                <ArrowRight className="size-4 xs:size-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleFinalSubmit}
                loading={isLoading}
                disabled={!isValid}
                className="bg-yellow-600 hover:bg-yellow-700"
                fullWidth={false}
              >
                Update Client
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
