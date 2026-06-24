import { z } from "zod";

export const DateTimeSchema = z.string().datetime({ offset: true });

export const TagsSchema = z.array(z.string().min(1)).default([]);

export const NonEmptyStringSchema = z.string().min(1);
