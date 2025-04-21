import { ShoppingBag } from "lucide-react";
import { Button } from "@/shared/ui";
import { useNavigate } from "react-router-dom";

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="container px-4 py-16 mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Looks like you haven't added anything to your cart yet. Browse our
        collection and find something you'll love.
      </p>
      <Button
        size="lg"
        onClick={() => navigate("/products")}
      >
        Start Shopping
      </Button>
    </div>
  );
}
