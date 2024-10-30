import { z } from "zod";

export const CreateMesssageInputSchema = z.object({
  message: z.string({
    required_error: "Mensagem não informada.",
    invalid_type_error: "Tipo não válido para mensagem.",
  }),
});
