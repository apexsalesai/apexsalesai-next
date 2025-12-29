import { z } from 'zod';

// Navigation item schema
export const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  external: z.boolean().optional(),
  badge: z.string().optional(),
  children: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
      })
    )
    .optional(),
});

// Footer link schema
export const FooterLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  external: z.boolean().optional(),
});

// Footer section schema
export const FooterSectionSchema = z.object({
  title: z.string(),
  links: z.array(FooterLinkSchema),
});

// Navigation configuration schema
export const NavigationConfigSchema = z.object({
  header: z.object({
    nav: z.array(NavItemSchema),
    cta: z
      .object({
        label: z.string(),
        href: z.string(),
        variant: z.enum(['primary', 'secondary', 'ghost']).optional(),
      })
      .optional(),
  }),
  footer: z.object({
    sections: z.array(FooterSectionSchema),
    legal: z.array(FooterLinkSchema),
    copyright: z.string(),
  }),
});

export type NavItem = z.infer<typeof NavItemSchema>;
export type FooterLink = z.infer<typeof FooterLinkSchema>;
export type FooterSection = z.infer<typeof FooterSectionSchema>;
export type NavigationConfig = z.infer<typeof NavigationConfigSchema>;
