import { z, ZodSchema } from 'zod';

// ─── Champs de base réutilisables ────────────────────────────────────────────────

export const nomField = z
  .string({ message: 'Le champ "nom" est requis.' })
  .trim()
  .min(2, 'Le nom doit contenir au moins 2 caractères.')
  .max(100, 'Le nom ne peut pas dépasser 100 caractères.');

// Schéma générique pour ID dans les routes /[id]
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "L'identifiant doit être un entier positif.")
    .transform(Number)
    .refine((n) => n > 0, "L'identifiant doit être supérieur à 0."),
});

// ─── Générateurs de schémas génériques ───────────────────────────────────────────

// Crée un schéma Zod pour la création d'un modèle avec champs requis
export function createSchema(fields: Record<string, ZodSchema>) {
  return z.object(fields);
}

// Crée un schéma Zod pour la mise à jour d'un modèle avec champs optionnels
export function updateSchema(fields: Record<string, ZodSchema>) {
  // On rend tous les champs optionnels
  const optionalFields: Record<string, ZodSchema> = {};
  Object.keys(fields).forEach((key) => {
    optionalFields[key] = fields[key].optional();
  });

  return z
    .object(optionalFields)
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Au moins un champ doit être fourni.',
    });
}

// ─── Exemples pour Pays ─────────────────────────────────────────────────────────

export const createPaysSchema = createSchema({ nom: nomField });
export const updatePaysSchema = updateSchema({ nom: nomField });

// Types inférés
export type CreatePaysInput = z.infer<typeof createPaysSchema>;
export type UpdatePaysInput = z.infer<typeof updatePaysSchema>;
export type IdParam         = z.infer<typeof idParamSchema>;

// ─── Exemples pour Continent ────────────────────────────────────────────────────

// Si Continent a aussi un nom et éventuellement un code

export const createContinentSchema = createSchema({ nom: nomField });
export const updateContinentSchema = updateSchema({ nom: nomField });

export type CreateContinentInput = z.infer<typeof createContinentSchema>;
export type UpdateContinentInput = z.infer<typeof updateContinentSchema>;