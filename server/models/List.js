import mongoose from 'mongoose';
import { z } from 'zod';

// Schéma de validation Zod pour Item
export const ItemValidationSchema = z.object({
  name: z.string().min(1, { message: "Le nom de l'article est requis" }),
  quantity: z.number().positive({ message: "La quantité doit être positive" }),
  price: z.number().min(0, { message: "Le prix ne peut pas être négatif" }),
  isPurchased: z.boolean().optional().default(false),
});

// Schéma de validation Zod pour List
export const ListValidationSchema = z.object({
  name: z.string().min(1, { message: "Le nom de la liste est requis" }),
  totalBudget: z.number().min(0, { message: "Le budget ne peut pas être négatif" }),
  owner: z.string().min(1, { message: "Le propriétaire est requis" }),
  sharedWith: z.array(z.string()).optional().default([]),
  items: z.array(ItemValidationSchema).optional().default([]),
});

// Schéma Mongoose pour Item
const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    isPurchased: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Schéma Mongoose pour List
const ListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    items: [ItemSchema],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sharedWith: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    totalBudget: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Créer et exporter le modèle
const List = mongoose.model('List', ListSchema);

export default List;
