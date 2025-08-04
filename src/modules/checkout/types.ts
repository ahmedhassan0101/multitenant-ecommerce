import Stripe from "stripe";

// ProductMetadata - Metadata attached to a product in Stripe
export type ProductMetadata = {
  stripeAccountId: string; // ID of the Stripe account associated with the product
  id: string; // Unique identifier for the product
  name: string; // Name of the product
  price: number; // Price of the product (in base currency units)
};

// CheckoutMetadata - Metadata attached to a Stripe checkout session
export type CheckoutMetadata = {
  userId: string; // ID of the user initiating the checkout
  tenantSlug: string;
  tenantId: string;
  productIds: string;
};

// ExpandedLineItems - Stripe line item type extended with deeply nested product metadata
export type ExpandedLineItems = Stripe.LineItem & {
  price: Stripe.Price & {
    product: Stripe.Product & {
      metadata: ProductMetadata; // Metadata included in the product object
    };
  };
};

