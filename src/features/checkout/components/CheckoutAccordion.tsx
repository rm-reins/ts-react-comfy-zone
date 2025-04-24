import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode } from "react";

interface CheckoutAccordionProps {
  title: string;
  sectionNumber: number;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function CheckoutAccordion({
  title,
  sectionNumber,
  isOpen,
  onToggle,
  children,
}: CheckoutAccordionProps) {
  return (
    <div className="border border-green-100 dark:border-green-800 rounded-lg overflow-hidden mb-4">
      <button
        className="w-full p-4 flex items-start"
        onClick={onToggle}
      >
        <div className="flex-grow pr-4">
          <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white uppercase text-left">
            {sectionNumber}. {title}
          </h2>
        </div>
        <div className="flex-shrink-0 pt-1">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 space-y-4 border-t border-green-100 dark:border-green-800">
          {children}
        </div>
      )}
    </div>
  );
}

export default CheckoutAccordion;
