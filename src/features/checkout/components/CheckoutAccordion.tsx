import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { ReactNode } from "react";

interface CheckoutAccordionProps {
  title: string;
  sectionNumber: number;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  isCompleted?: boolean;
}

function CheckoutAccordion({
  title,
  sectionNumber,
  isOpen,
  onToggle,
  children,
  isCompleted = false,
}: CheckoutAccordionProps) {
  return (
    <div
      className={`border ${
        isCompleted
          ? "border-green-400 dark:border-green-500"
          : "border-green-100 dark:border-green-800"
      } rounded-lg overflow-hidden mb-4 ${
        isCompleted ? "bg-green-50/50 dark:bg-green-900/30" : ""
      }`}
    >
      <button
        className="w-full p-4 flex items-center"
        onClick={onToggle}
      >
        <div className="flex-grow pr-4 flex items-center">
          <div
            className={`flex-shrink-0 mr-3 w-6 h-6 rounded-full ${
              isCompleted
                ? "bg-green-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            } flex items-center justify-center text-sm font-medium`}
          >
            {isCompleted ? (
              <Check
                size={14}
                strokeWidth={3}
              />
            ) : (
              sectionNumber
            )}
          </div>
          <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white text-left">
            {title}
          </h2>
        </div>
        <div className="flex-shrink-0">
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
