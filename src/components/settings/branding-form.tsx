'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { BrandingSettings } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';

const formSchema = z.object({
  logo: z.string().url().optional().or(z.literal('')),
  colors: z.object({
    primary: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().or(z.literal('')),
    secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().or(z.literal('')),
  }).optional(),
});

export function BrandingForm() {
  const { toast } = useToast();
  const [settings, setSettings] = useLocalStorage<BrandingSettings>('brandingSettings', {
    logo: '',
    colors: { primary: '#4CAF50', secondary: '#795548' },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSettings(values);
    toast({
      title: 'Settings Saved',
      description: 'Your branding settings have been updated.',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="colors.primary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} className="p-1 h-10 w-24"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="colors.secondary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Color</FormLabel>
              <FormControl>
                 <Input type="color" {...field} className="p-1 h-10 w-24"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
