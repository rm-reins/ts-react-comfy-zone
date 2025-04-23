import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { trpc } from "@/trpc/trpc";
import { User } from "@/trpc/types";
import { useState } from "react";

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
            <div className="border border-green-100 dark:border-green-800 rounded-lg overflow-hidden mb-4">
              <button
                className="w-full flex justify-between items-center p-4"
                onClick={() => toggleSection("contactInfo")}
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white uppercase">
                  1. {t("checkout.contactInformation")}
                </h2>
                {openSection === "contactInfo" ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {openSection === "contactInfo" && (
                <div className="p-4 space-y-4 border-t border-green-100 dark:border-green-800">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={user?.surname}
                      placeholder={t("account.lastName")}
                      className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
                    />
                    <input
                      type="text"
                      value={user?.name}
                      placeholder={t("account.firstName")}
                      className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
                    />
                  </div>
                  <input
                    type="tel"
                    value={user?.phone}
                    placeholder={t("account.phone")}
                    className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
                  />
                  <input
                    type="email"
                    value={user?.email}
                    placeholder={t("account.email")}
                    className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
                  />
                </div>
              )}
            </div>

            {/* Delivery Section */}
            <div className="border border-green-100 dark:border-green-800 rounded-lg overflow-hidden mb-4">
              <button
                className="w-full flex justify-between items-center p-4"
                onClick={() => toggleSection("shippingAddress")}
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white uppercase">
                  2. {t("checkout.shippingAddress")}
                </h2>
                {openSection === "shippingAddress" ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {openSection === "shippingAddress" && (
                <div className="p-4 space-y-4 border-t border-green-100 dark:border-green-800">
                  <input
                    type="text"
                    required
                    value={defaultAddress?.street}
                    placeholder={t("account.address")}
                    className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
                  />
                  <input
                    type="text"
                    required
                    value={defaultAddress?.city}
                    placeholder={t("account.city")}
                    className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={defaultAddress?.state}
                      placeholder={t("account.state")}
                      className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
                    />
                    <input
                      type="text"
                      required
                      value={defaultAddress?.postalCode}
                      placeholder={t("account.zipCode")}
                      className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={defaultAddress?.country}
                    placeholder={t("account.country")}
                    className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
                  />
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div className="border border-green-100 dark:border-green-800 rounded-lg overflow-hidden mb-4">
              <button
                className="w-full flex justify-between items-center p-4"
                onClick={() => toggleSection("paymentMethod")}
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white uppercase">
                  3. {t("checkout.paymentMethod")}
                </h2>
                {openSection === "paymentMethod" ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {openSection === "paymentMethod" && (
                <div className="p-4 space-y-4 border-t border-green-100 dark:border-green-800">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="creditCard"
                        name="paymentMethod"
                        className="h-4 w-4 text-green-600 dark:text-green-400 border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-400"
                      />
                      <label
                        htmlFor="creditCard"
                        className="text-gray-600 dark:text-gray-200"
                      >
                        {t("checkout.creditCard")}
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        className="h-4 w-4 text-green-600 dark:text-green-400 border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-400"
                      />
                      <label
                        htmlFor="paypal"
                        className="text-gray-600 dark:text-gray-200"
                      >
                        {t("checkout.paypal")}
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="bankTransfer"
                        name="paymentMethod"
                        className="h-4 w-4 text-green-600 dark:text-green-400 border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-400"
                      />
                      <label
                        htmlFor="bankTransfer"
                        className="text-gray-600 dark:text-gray-200"
                      >
                        {t("checkout.bankTransfer")}
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-300 italic">
                    {t("checkout.paymentInfoText")}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="border border-green-100 dark:border-green-800 rounded-lg overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-4"
                onClick={() => toggleSection("additionalInfo")}
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white uppercase">
                  4. {t("checkout.additionalInformation")}
                </h2>
                {openSection === "additionalInfo" ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {openSection === "additionalInfo" && (
                <div className="p-4 border-t border-green-100 dark:border-green-800">
                  <textarea
                    placeholder={t("checkout.additionalInfoPlaceholder")}
                    rows={4}
                    className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Second Column - Order Summary */}
          <div className="md:col-span-6 bg-green-50 dark:bg-green-800/20 bg-opacity-50 p-6">
            <div className="border border-green-100 dark:border-green-800 bg-white dark:bg-green-900/30 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                {t("checkout.orderSummary")}
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between pb-2 border-b border-green-100 dark:border-green-800">
                  <span className="text-gray-600 dark:text-gray-200">
                    {t("checkout.orderItems")}:
                  </span>
                  <span className="dark:text-white">{cart.numItemsInCart}</span>
                </div>

                <div className="flex justify-between pb-2 border-b border-green-100 dark:border-green-800">
                  <span className="text-gray-600 dark:text-gray-200">
                    {t("checkout.orderAmount")}:
                  </span>
                  <span className="dark:text-white">
                    {cart.cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between pb-2 border-b border-green-100 dark:border-green-800">
                  <span className="text-gray-600 dark:text-gray-200">
                    {t("checkout.orderShipping")}:
                  </span>
                  <span className="text-gray-400 dark:text-gray-200">
                    {cart.shipping.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between font-medium">
                  <span className="text-gray-900 dark:text-white">
                    {t("checkout.orderSubtotal")}
                  </span>
                  <span className="text-gray-900 dark:text-green-100">
                    {cart.orderTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-end mt-10">
                  <button className="flex text-lg justify-between items-center text-green-600 dark:text-green-100 font-bold border-b-2 border-green-600 dark:border-green-400 uppercase">
                    {t("checkout.placeOrder")}
                    <ArrowUpRight
                      size={28}
                      strokeWidth={2}
                    />
                  </button>
                </div>

                <div className="flex items-start space-x-2 mt-4">
                  <input
                    type="checkbox"
                    required
                    id="terms"
                    name="terms"
                    className="h-4 w-4 mt-1 text-green-600 dark:text-green-400 border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-400"
                  />
                  <label
                    htmlFor="terms"
                    className="text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("checkout.acceptTerms")}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center mt-4 space-x-2">
              <input
                type="text"
                placeholder={t("checkout.promoCode")}
                className="flex-1 p-3 border bg-white dark:bg-green-900/20 border-green-100 dark:border-green-800 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <button className="text-green-600 dark:text-green-100 font-bold uppercase flex items-center whitespace-nowrap border-b-2 border-green-600 dark:border-green-400">
                {t("common.apply")}
                <ArrowUpRight className="h-5 w-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
