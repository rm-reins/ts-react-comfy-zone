import { useTranslation } from "@/i18n/useTranslation";
import { DeliveryAddress } from "@/trpc/types";
import { trpc } from "@/trpc/trpc";
import { useUser } from "@clerk/clerk-react";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
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
  const { user } = useUser();
  const cart = useSelector((state: RootState) => state.cartState);
  const checkoutState = useSelector((state: RootState) => state.checkoutState);
  const [openSection, setOpenSection] = useState<string>("contactInfo");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: address } = trpc.address.getAddress.useQuery({
    clerkId: user!.id,
    isDefault: true,
  });

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  // Check if sections are completed - for UI indicators only
  const isContactInfoComplete = useMemo(() => {
    const { contactInformation } = checkoutState.order;
    return !!(
      contactInformation.name &&
      contactInformation.surname &&
      contactInformation.email &&
      contactInformation.phone
    );
  }, [checkoutState.order.contactInformation]);

  const isShippingAddressComplete = useMemo(() => {
    const { deliveryAddress } = checkoutState.order;
    return !!(
      deliveryAddress.street &&
      deliveryAddress.city &&
      deliveryAddress.postalCode &&
      deliveryAddress.country
    );
  }, [checkoutState.order.deliveryAddress]);

  const isPaymentMethodComplete = useMemo(() => {
    return !!checkoutState.order.paymentMethod;
  }, [checkoutState.order.paymentMethod]);

  if (cart.cartItems.length === 0) {
    return (
      <div className="bg-white dark:bg-green-600 p-4 md:p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {t("checkout.title")}
        </h1>
        <div className="text-center py-10">
          <h2 className="text-xl font-medium mb-4 text-gray-900 dark:text-white">
            {t("checkout.emptyCart")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t("checkout.addItemsMessage")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-green-600 p-4 md:p-8 rounded-xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {t("checkout.title")}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white dark:bg-green-900/20 rounded-xl shadow-sm dark:shadow-green-900/30 overflow-hidden border border-green-100 dark:border-green-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* First Column - Forms */}
          <div className="md:col-span-6 p-4">
            {/* Contact Information */}
            <CheckoutAccordion
              title={t("checkout.contactInformation")}
              sectionNumber={1}
              isOpen={openSection === "contactInfo"}
              onToggle={() => toggleSection("contactInfo")}
              isCompleted={isContactInfoComplete}
            >
              <ContactInfoForm address={address as DeliveryAddress} />
            </CheckoutAccordion>

            {/* Delivery Section */}
            <CheckoutAccordion
              title={t("checkout.shippingAddress")}
              sectionNumber={2}
              isOpen={openSection === "shippingAddress"}
              onToggle={() => toggleSection("shippingAddress")}
              isCompleted={isShippingAddressComplete}
            >
              <ShippingAddressForm
                defaultAddress={address as DeliveryAddress}
              />
            </CheckoutAccordion>

            {/* Payment Section */}
            <CheckoutAccordion
              title={t("checkout.paymentMethod")}
              sectionNumber={3}
              isOpen={openSection === "paymentMethod"}
              onToggle={() => toggleSection("paymentMethod")}
              isCompleted={isPaymentMethodComplete}
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
            <OrderSummary
              cart={cart}
              setIsLoading={setIsLoading}
              setError={setError}
            />

            {isLoading && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-700 dark:text-blue-300 text-center">
                {t("checkout.processingOrder")}...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
