import { useRef, useEffect, useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { X } from "lucide-react";
import { Form } from "radix-ui";

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressFormPopupProps {
  address: DeliveryAddress | null;
  mode: "add" | "edit";
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: DeliveryAddress) => void;
}

function AddressFormPopup({
  address,
  mode,
  isOpen,
  onClose,
  onSave,
}: AddressFormPopupProps) {
  const { t } = useTranslation();
  const popupRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<DeliveryAddress>({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Germany",
  });

  useEffect(() => {
    if (address) {
      setFormData(address);
    } else {
      setFormData({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Germany",
      });
    }
  }, [address]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        ref={popupRef}
        className="bg-white dark:bg-secondary rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-secondary dark:bg-neutral-200 border-b border-neutral-200 dark:border-green-800 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">
              {mode === "edit"
                ? t("account.editAddress")
                : t("account.addNewAddress")}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <Form.Root
          onSubmit={handleSubmit}
          className="p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Form.Field
              name="street"
              className="md:col-span-2"
            >
              <div>
                <Form.Label
                  htmlFor="street"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  {t("account.street")} *
                </Form.Label>
                <Form.Control asChild>
                  <input
                    type="text"
                    id="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </Form.Control>
                <Form.Message
                  match="valueMissing"
                  className="text-xs text-red-500 mt-1"
                >
                  {t("account.required")}
                </Form.Message>
              </div>
            </Form.Field>

            <Form.Field name="city">
              <div>
                <Form.Label
                  htmlFor="city"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  {t("account.city")} *
                </Form.Label>
                <Form.Control asChild>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </Form.Control>
                <Form.Message
                  match="valueMissing"
                  className="text-xs text-red-500 mt-1"
                >
                  {t("account.required")}
                </Form.Message>
              </div>
            </Form.Field>

            <Form.Field name="state">
              <div>
                <Form.Label
                  htmlFor="state"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  {t("account.state")} *
                </Form.Label>
                <Form.Control asChild>
                  <input
                    type="text"
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </Form.Control>
                <Form.Message
                  match="valueMissing"
                  className="text-xs text-red-500 mt-1"
                >
                  {t("account.required")}
                </Form.Message>
              </div>
            </Form.Field>

            <Form.Field name="postalCode">
              <div>
                <Form.Label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  {t("account.zipCode")} *
                </Form.Label>
                <Form.Control asChild>
                  <input
                    type="text"
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </Form.Control>
                <Form.Message
                  match="valueMissing"
                  className="text-xs text-red-500 mt-1"
                >
                  {t("account.required")}
                </Form.Message>
              </div>
            </Form.Field>

            <Form.Field name="country">
              <div>
                <Form.Label
                  htmlFor="country"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  {t("account.country")} *
                </Form.Label>
                <Form.Control asChild>
                  <input
                    type="text"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </Form.Control>
                <Form.Message
                  match="valueMissing"
                  className="text-xs text-red-500 mt-1"
                >
                  {t("account.required")}
                </Form.Message>
              </div>
            </Form.Field>
          </div>

          <div className="border-t border-neutral-200 dark:border-green-800 pt-6 flex flex-col md:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-neutral-300 bg-neutral-50 rounded-full text-neutral-700 hover:bg-neutral-300 transition-colors"
            >
              {t("common.cancel")}
            </button>
            <Form.Submit asChild>
              <button className="px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors">
                {mode === "edit" ? t("common.save") : t("common.add")}
              </button>
            </Form.Submit>
          </div>
        </Form.Root>
      </div>
    </div>
  );
}

export default AddressFormPopup;
