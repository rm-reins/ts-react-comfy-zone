import { useTranslation } from "@/i18n/useTranslation";

function UserAddresses() {
  const { t } = useTranslation();

  const addresses = [
    {
      id: "1",
      name: "John Doe",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: "2",
      name: "John Doe",
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "United States",
      isDefault: false,
    },
  ];

  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center mb-12">
          <h1 className="text-3xl font-bold text-primary">
            {t("account.myAddresses")}
          </h1>
          <span className="ml-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {addresses.length}
          </span>
        </div>

        {/* Desktop View - Grid */}
        <div className="hidden bg-primary-light md:grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-primary">
                  {address.name}
                </h2>
                {address.isDefault && (
                  <span className="bg-primary-light text-primary text-m px-2 py-1 rounded-full">
                    {t("common.default")}
                  </span>
                )}
              </div>
              <div className="space-y-2 text-neutral-600">
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
                <p>{address.country}</p>
              </div>
              <div className="mt-6 flex space-x-4">
                <button className="text-primary hover:text-primary-light font-medium">
                  {t("common.edit")}
                </button>
                {!address.isDefault && (
                  <button className="text-neutral-600 hover:text-primary font-medium">
                    {t("common.setAsDefault")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-primary">
                  {address.name}
                </h2>
                {address.isDefault && (
                  <span className="bg-primary-light text-white text-xs px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="space-y-2 text-neutral-600">
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
                <p>{address.country}</p>
              </div>
              <div className="mt-6 flex space-x-4">
                <button className="text-primary hover:text-primary-light font-medium">
                  Edit
                </button>
                {!address.isDefault && (
                  <button className="text-neutral-600 hover:text-primary font-medium">
                    Set as default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="bg-primary hover:bg-primary-light text-white font-medium py-3 px-6 rounded-full transition-colors">
            Add new address
          </button>
        </div>
      </main>
    </>
  );
}
export default UserAddresses;
