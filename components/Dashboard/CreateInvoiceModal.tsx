"use client";
import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Receipt,
  FileText,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  UserPlus,
} from "lucide-react";

import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { InvoiceFormData, invoiceSchema } from "@/lib/form/validation";
import { InvoiceData } from "@/typings";
import SelectField from "../ui/SelectField";
import { InvoiceSummary } from "./invoiceSummary";
import { Label } from "../ui/Label";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { createInvoice } from "@/app/actions/invoice.action";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { VirtualizedSelect } from "./VirtualizedSelect";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSubmit: (data: InvoiceData) => void;
  clients: Array<{
    id: string;
    name: string;
  }>;
  loadingClients?: boolean;
}

type FieldName =
  | keyof InvoiceFormData
  | `items.${number}.description`
  | `items.${number}.quantity`
  | `items.${number}.rate`
  | `items.${number}.total`;

export function CreateInvoiceModal({
  isOpen,
  onClose,
  clients,
  loadingClients,
}: CreateInvoiceModalProps) {
  useLockBodyScroll(isOpen);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: InvoiceFormData = {
    title: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    currency: "NGN" as const,
    clientId: "",
    description: "",
    items: [{ id: "item-0", description: "", quantity: 1, rate: 0, total: 0 }],
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
    reset,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({
    control,
    name: "items",
  });

  const grandTotal = useMemo(
    () =>
      watchedItems?.reduce((sum, item) => sum + item.quantity * item.rate, 0) ||
      0,
    [watchedItems]
  );

  const handleAddItem = () => {
    append({ description: "", quantity: 1, rate: 0, total: 0 });
  };

  const calculateItemTotal = (index: number) => {
    const item = watchedItems[index];
    if (item) {
      const total = item.quantity * item.rate;
      setValue(`items.${index}.total`, total);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    try {
      return formatter.format(amount);
    } catch (error) {
      console.error("Error formatting amount:", error);
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  const goToNextStep = async () => {
    if (currentStep === 1) {
      const isStepValid = await trigger([
        "title",
        "invoiceDate",
        "dueDate",
        "currency",
      ]);
      if (isStepValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      // Trigger validation for all items fields and clientId
      const fieldsToValidate: FieldName[] = [
        "clientId",
        ...fields.flatMap((_, index): FieldName[] => [
          `items.${index}.description` as `items.${number}.description`,
          `items.${index}.quantity` as `items.${number}.quantity`,
          `items.${index}.rate` as `items.${number}.rate`,
        ]),
      ];
      const isStepValid = await trigger(fieldsToValidate);
      if (isStepValid) setCurrentStep(3);
    }
  };

  const goToPrevStep = () => setCurrentStep((prev) => prev - 1);

  const onSubmit = useCallback(
    async (data: InvoiceFormData) => {
      setIsLoading(true);
      try {
        const result = await createInvoice(data);

        if (result.success) {
          reset();
          setCurrentStep(1);
          onClose();
          window.alert("Invoice created successfully");
          // toast.success("Invoice created successfully");
        } else {
          // Handle error
          window.alert(result.error || "Failed to create invoice");
        }
      } catch (error) {
        console.error("Error creating invoice:", error);
        window.alert("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [onClose, reset]
  );

  const handleFinalSubmit = async () => {
    const isValidStep = await trigger();

    if (isValidStep) {
      const formData = watch();
      await onSubmit(formData);
    }
  };

  const steps = [
    { number: 1, title: "Invoice Details" },
    { number: 2, title: "Items & Client" },
    { number: 3, title: "Review" },
  ];

  const StepConnector = ({ active }: { active: boolean }) => (
    <div className="flex-1 h-0.5 mx-2">
      <div
        className={`h-full transition-colors duration-300 ${
          active ? "bg-purple-500" : "bg-gray-200"
        }`}
      />
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          >
            <div className="bg-white rounded-lg xs:rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] sm:max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 xs:gap-4">
                    <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                      <Receipt className="size-5 xs:size-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-lg xs:text-2xl font-bold text-gray-900">
                        Create Invoice
                      </h2>
                      <p className="text-xs xs:text-sm text-gray-500 mt-0.5 xs:mt-1">
                        Generate a new invoice for your client
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

                {/* Progress Steps */}
                <div className="flex items-center justify-between mt-4 xs:mt-6 px-2">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                      <div className="flex items-center">
                        <div
                          className={`
                            flex items-center justify-center size-6 xs:size-8 rounded-full
                            text-xs xs:text-sm font-medium transition-colors duration-300
                            ${
                              currentStep === step.number
                                ? "bg-purple-600 text-white"
                                : currentStep > step.number
                                  ? "bg-purple-500 text-white"
                                  : "bg-gray-200 text-gray-600"
                            }
                          `}
                        >
                          {step.number}
                        </div>
                        <span className="hidden sm:block ml-3 text-xs xs:text-sm font-medium text-gray-600">
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
              <form
                id="invoice-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 overflow-y-auto p-4 sm:p-6"
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4 xs:space-y-6"
                >
                  {currentStep === 1 && (
                    <div className="space-y-4 xs:space-y-6">
                      <InputField
                        label={Label(FileText, "Invoice Title", true)}
                        {...register("title")}
                        error={errors.title?.message}
                        placeholder="e.g. Website Redesign Project"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <InputField
                          type="date"
                          label={Label(null, "Invoice Date", true)}
                          {...register("invoiceDate")}
                          error={errors.invoiceDate?.message}
                        />

                        <InputField
                          type="date"
                          label={Label(null, "Due Date", true)}
                          {...register("dueDate")}
                          error={errors.dueDate?.message}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <SelectField
                          label={Label(null, "Currency", true)}
                          {...register("currency")}
                          error={errors.currency?.message}
                          options={[
                            { value: "NGN", label: "NGN (₦)" },
                            { value: "USD", label: "USD ($)" },
                            { value: "GBP", label: "GBP (£)" },
                            { value: "EUR", label: "EUR (€)" },
                          ]}
                        />

                        <InputField
                          label="Description (Optional)"
                          {...register("description")}
                          error={errors.description?.message}
                          placeholder="Additional notes or context"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4 xs:space-y-6">
                      <VirtualizedSelect
                        label={Label(UserPlus, "Select Client", true)}
                        error={errors.clientId?.message}
                        options={[
                          { value: "", label: "Choose who you're billing..." },
                          ...(clients?.map((client) => ({
                            value: client.id,
                            label: client.name,
                          })) || []),
                        ]}
                        placeholder="Choose who you're billing..."
                        disabled={loadingClients}
                        value={watch("clientId")} // Directly pass the value instead of spreading registerSelect
                        onChange={(value: string) =>
                          setValue("clientId", value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        name="clientId"
                      />
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-xs xs:text-sm text-blue-700">
                          Add items you're billing for. Each item should include
                          what you're charging for, how many units/hours, and
                          the rate per unit/hour.
                        </div>

                        {fields.map((field, index) => {
                          const currency = watch("currency");
                          const currencySymbol = {
                            NGN: "₦",
                            USD: "$",
                            GBP: "£",
                            EUR: "€",
                          }[currency];

                          const formatAmount = (amount: number) => {
                            return new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: currency,
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(amount);
                          };

                          return (
                            <div
                              key={field.id}
                              className="flex flex-col sm:flex-row gap-4 items-start p-4 border border-gray-200 rounded-lg"
                            >
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 w-full gap-4">
                                <div className="sm:col-span-6">
                                  <InputField
                                    label={Label(
                                      null,
                                      "What are you charging for?",
                                      true
                                    )}
                                    {...register(`items.${index}.description`)}
                                    placeholder="e.g. Logo Design, Content Writing (2 Articles), Web Development"
                                    error={
                                      errors.items?.[index]?.description
                                        ?.message
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:col-span-6">
                                  <div className="sm:col-span-2">
                                    <InputField
                                      label={Label(
                                        null,
                                        "How many units/hours?",
                                        true
                                      )}
                                      type="number"
                                      {...register(`items.${index}.quantity`, {
                                        valueAsNumber: true,
                                        onChange: (e) => {
                                          const value = Number(e.target.value);
                                          setValue(
                                            `items.${index}.quantity`,
                                            value
                                          );
                                          calculateItemTotal(index);
                                        },
                                      })}
                                      placeholder="e.g. 2 hours, 5 units"
                                      error={
                                        errors.items?.[index]?.quantity?.message
                                      }
                                    />
                                    {!errors.items?.[index]?.quantity
                                      ?.message && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Enter the number of hours or units
                                        you're billing
                                      </p>
                                    )}
                                  </div>
                                  <div className="sm:col-span-2">
                                    <div className="relative">
                                      <InputField
                                        label={Label(
                                          null,
                                          `Rate per unit/hour (${currency})`,
                                          true
                                        )}
                                        type="number"
                                        currencySymbol={currencySymbol}
                                        {...register(`items.${index}.rate`, {
                                          valueAsNumber: true,
                                          onChange: (e) => {
                                            const value = Number(
                                              e.target.value
                                            );
                                            setValue(
                                              `items.${index}.rate`,
                                              value
                                            );
                                            calculateItemTotal(index);
                                          },
                                        })}
                                        placeholder={`e.g. ${currencySymbol}5000 per hour/unit`}
                                        error={
                                          errors.items?.[index]?.rate?.message
                                        }
                                      />
                                    </div>
                                    {!errors.items?.[index]?.rate?.message && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        How much do you charge per hour/unit?
                                      </p>
                                    )}
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-2">
                                      Line Total
                                    </label>
                                    <div className="flex items-center py-2 px-3 sm:px-4 bg-gray-50 rounded-lg text-sm xs:text-base">
                                      {formatAmount(
                                        (watchedItems[index]?.quantity || 0) *
                                          (watchedItems[index]?.rate || 0)
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Unit/Hour × Rate = Total
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={() => remove(index)}
                                className="bg-red-100 hover:bg-red-200 p-2 rounded-lg"
                                fullWidth={false}
                              >
                                <Minus className="size-4 xs:size-5 text-red-600" />
                              </Button>
                            </div>
                          );
                        })}

                        <Button
                          onClick={handleAddItem}
                          className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm xs:text-base"
                          fullWidth={false}
                        >
                          <Plus className="size-4 xs:size-5 mr-2" />
                          Add Another Item
                        </Button>
                      </div>

                      <div className="flex justify-end text-lg xs:text-xl font-bold">
                        Total: {formatAmount(grandTotal, watch("currency"))}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4 xs:space-y-6">
                      <InvoiceSummary
                        invoiceData={{
                          title: watch("title"),
                          description: watch("description"),
                          invoiceDate: watch("invoiceDate"),
                          dueDate: watch("dueDate"),
                          currency: watch("currency"),
                          clientId: watch("clientId"),
                          items: watch("items")?.map((item, index) => ({
                            ...item,
                            id: `item-${index}`, // Add an id to each item
                          })),
                        }}
                        clients={clients}
                      />
                    </div>
                  )}
                </motion.div>
              </form>

              {/* Footer Actions */}
              <div className="p-4 sm:p-6 border-t border-gray-100 flex-shrink-0 flex justify-between">
                <Button
                  onClick={goToPrevStep}
                  disabled={currentStep === 1 || isLoading}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm xs:text-base"
                  fullWidth={false}
                >
                  <ArrowLeft className="size-4 xs:size-5 mr-2" />
                  Previous
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={goToNextStep}
                    disabled={isLoading}
                    className="text-sm xs:text-base"
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
                    className="text-sm xs:text-base"
                    fullWidth={false}
                  >
                    Create Invoice
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
