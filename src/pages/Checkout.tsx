import { useTranslation } from "@/i18n/useTranslation";
import { trpc } from "@/trpc/trpc";
import { User } from "@/trpc/types";
import { useState } from "react";
import {
  CheckoutAccordion,
  ContactInfoForm,
  ShippingAddressForm,
  PaymentMethodForm,
  AdditionalInfoForm,
  OrderSummary,
} from "@/features/checkout";

function Checkout() {
  const { t } = useTranslation();
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");
  const { data } = trpc.user.currentUser.useQuery();
  const user = data as User | undefined;
  const [openSection, setOpenSection] = useState<string>("contactInfo");
  const defaultAddress = user?.deliveryAddresses?.find(
    (address) => address.isDefault
  );

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  return (
    <div className="bg-white dark:bg-green-600 p-4 md:p-8 rounded-xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {t("checkout.title")}
      </h1>
      <div className="max-w-7xl mx-auto bg-white dark:bg-green-900/20 rounded-xl shadow-sm dark:shadow-green-900/30 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* First Column - Forms */}
          <div className="md:col-span-6 p-4">
            {/* Contact Information */}
            <CheckoutAccordion
              title={t("checkout.contactInformation")}
              sectionNumber={1}
              isOpen={openSection === "contactInfo"}
              onToggle={() => toggleSection("contactInfo")}
            >
              <ContactInfoForm user={user} />
            </CheckoutAccordion>

            {/* Delivery Section */}
            <CheckoutAccordion
              title={t("checkout.shippingAddress")}
              sectionNumber={2}
              isOpen={openSection === "shippingAddress"}
              onToggle={() => toggleSection("shippingAddress")}
            >
              <ShippingAddressForm defaultAddress={defaultAddress} />
            </CheckoutAccordion>

            {/* Payment Section */}
            <CheckoutAccordion
              title={t("checkout.paymentMethod")}
              sectionNumber={3}
              isOpen={openSection === "paymentMethod"}
              onToggle={() => toggleSection("paymentMethod")}
            >
              <PaymentMethodForm />
            </CheckoutAccordion>

            {/* Additional Information */}
            <CheckoutAccordion
              title={t("checkout.additionalInformation")}
              sectionNumber={4}
              isOpen={openSection === "additionalInfo"}
              onToggle={() => toggleSection("additionalInfo")}
            >
              <AdditionalInfoForm />
            </CheckoutAccordion>
          </div>

          {/* Second Column - Order Summary */}
          <div className="md:col-span-6 bg-green-50 dark:bg-green-800/20 bg-opacity-50 p-6">
            <OrderSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
