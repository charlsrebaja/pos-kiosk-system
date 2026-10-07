import { z } from "zod";

export function createCashPaymentSchema(totalCentavos: number) {
  return z.object({
    amountPaid: z.string().trim().min(1, "Enter the amount paid.")
      .regex(/^\d+(?:\.\d{1,2})?$/, "Use a nonnegative amount with at most two decimal places, such as 200.00.")
      .transform((value, ctx) => {
        // Parse decimal text exactly; avoid floating point rounding and blank coercion.
        const [pesos, fraction = ""] = value.split(".");
        const cents = BigInt(pesos) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
        if (cents > BigInt(Number.MAX_SAFE_INTEGER)) {
          ctx.addIssue({ code: "custom", message: "That amount is too large. Enter a smaller amount." });
          return z.NEVER;
        }
        return Number(cents);
      })
      .refine((paid) => paid >= totalCentavos, "Amount paid must cover the total due."),
  });
}
