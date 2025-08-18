import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { BasePayload, getPayload } from "payload";
import Stripe from "stripe";
import config from "@/payload.config";
import { CheckoutMetadata, ExpandedLineItems } from "@/modules/checkout/types";

// Define an async function for the webhook handler.
// This is a standard Next.js API route handler.
export async function POST(req: Request) {
  let event: Stripe.Event;

  // 1. Verify the incoming Stripe event using the webhook secret.
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the event
  console.log("✅ Success:", event.id); // Log verified event ID

  // Define which event types this handler cares about
  // const permittedEvents: string[] = [
  //   "checkout.session.completed",
  //   "account.updated",
  // ];

  // 2. Process the verified event.
  try {
    const payload = await getPayload({ config });
    console.log(
      `✅ Received a valid Stripe event: ${event.id} with type: ${event.type}`
    );

    switch (event.type) {
      case "checkout.session.completed":
        // Call a dedicated function to handle this specific event type.
        await handleCheckoutCompleted(event, payload);
        break;
      case "account.updated":
        const data = event.data.object as Stripe.Account;

        // Update the tenant record whose Stripe account ID matches the updated account
        await payload.update({
          collection: "tenants",
          where: {
            stripeAccountId: {
              equals: data.id, // Match tenant by Stripe account ID
            },
          },
          data: {
            stripeDetailsSubmitted: data.details_submitted, // Update the verification status
          },
        });
        break;

      default:
        // Log unhandled events. This helps in debugging and ensures the webhook doesn't fail.

        console.warn(`⚠️ Unhandled event type: ${event.type}`);
        break;
    }

    // 3. Return a 200 OK response to Stripe, regardless of the outcome of the business logic.
    // This tells Stripe that the webhook was received successfully.
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    // Log the error for later debugging.
    console.error(
      `❌ Webhook handler failed to process event ${event.id}: ${errorMessage}`
    );
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 } // Internal Server Error for processing failure
    );
  }
}

// -----------------------------------------------------------
// Helper functions for handling specific Stripe events
// -----------------------------------------------------------

// 1. Handle successful checkout completion 'checkout.session.completed' event
async function handleCheckoutCompleted(
  event: Stripe.Event,
  payload: BasePayload
) {
  const session = event.data.object as Stripe.Checkout.Session;
  console.log(`Processing checkout completion: ${session.id}`);

  // 1. Validate required metadata from the session.
  // This metadata was passed during the checkout session creation.
  // Metadata from the Stripe Checkout Session
  // (comes from `metadata` field passed to `stripe.checkout.sessions.create`)
  const metadata = session.metadata as CheckoutMetadata;

  if (
    !metadata?.userId ||
    !metadata?.tenantSlug ||
    !metadata?.tenantId ||
    !metadata?.productIds
    // !event.account
  ) {
    throw new Error(
      `Missing required metadata in session ${session.id}or event account.`
    );
  }
  const productIds = metadata.productIds.split(",");

  if (!Array.isArray(productIds) || productIds.length === 0) {
    console.error("Invalid product IDs in metadata.");
    return new NextResponse("Webhook Error: Invalid product IDs", {
      status: 400,
    });
  }
  // 2. Idempotency check:
  // Before creating a new order, check if one already exists for this session.
  // This prevents duplicate orders if the webhook is delivered multiple times
  const existingOrders = await payload.find({
    collection: "orders",
    where: {
      stripeCheckoutSessionId: { equals: session.id },
    },
    limit: 1, // Only need to find one to know it exists
  });

  if (existingOrders.totalDocs > 0) {
    console.log(`Order for session ${session.id} already exists. Skipping.`);
    return; // Exit the function gracefully
  }

  // 3. Retrieve the full session with expanded line items.
  // This is necessary to get detailed product information.
  // Metadata from each product inside the expanded line items
  // (comes from `product_data.metadata` passed inside `line_items` during session creation)
  const expandedSession = await stripe.checkout.sessions.retrieve(
    session.id,
    {
      expand: ["line_items.data.price.product"],
    },
    {
      stripeAccount: event.account,
    }
  );

  if (!expandedSession.line_items?.data?.length) {
    throw new Error(`No line items found for session ${session.id}`);
  }

  const lineItems = expandedSession.line_items.data as ExpandedLineItems[];

  // 4. Extract product IDs from the line items.
  // We use `.map` and a robust check to ensure valid data.
  const productIdsFromStripe = lineItems
    .map((item) => item.price?.product.metadata?.id)

    .filter(Boolean); // Filter out any undefined or null values
  // This is crucial for tracking which connected account received the funds.
  // Find the Stripe Account ID from the line items' metadata
  const stripeAccountId = lineItems[0].price?.product.metadata?.stripeAccountId;
  console.log("🚀 ~ Completed ~ stripeAccountId:", stripeAccountId);
  console.log("🚀 ~ Completed ~ event.account:", event.account);

  await payload.create({
    collection: "orders",
    data: {
      user: metadata.userId,
      name: `Order for ${session.customer_details?.email} - ${session.id}`,
      tenant: metadata.tenantId,
      totalAmount: session.amount_total || 0,
      products: productIdsFromStripe,
      stripeAccountId: event.account,
      stripeCheckoutSessionId: session.id,
    },
  });
  console.log(`✅ Order created successfully for session: ${session.id}`);
}
