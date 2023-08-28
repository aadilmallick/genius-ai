import * as z from "zod";

export const formSchema = z.object({
  prompt: z
    .string()
    .nonempty({
      message: "Prompt is required",
    })
    .min(5, {
      message: "Prompt must be at least 5 characters long",
    }),
  amount: z.number().int().positive(),
  resolution: z.string().nonempty({
    message: "Resolution is required",
  }),
});

export const amountOptions = [1, 2, 3, 4, 5].map((i) => ({
  value: i,
  label: `${i} photos`,
}));

export const resolutionOptions = [256, 512, 1024].map((i) => ({
  value: `${i}x${i}`,
  label: `${i}x${i}`,
}));
