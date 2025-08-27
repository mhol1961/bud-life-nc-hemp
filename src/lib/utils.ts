import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function getStatusColor(status: string): string {
  const statusColors: { [key: string]: string } = {
    active: 'success',
    inactive: 'secondary',
    draft: 'warning',
    pending: 'warning',
    processing: 'info',
    shipped: 'info',
    completed: 'success',
    cancelled: 'destructive',
    refunded: 'destructive',
    paid: 'success',
    unpaid: 'destructive',
    partial: 'warning',
    fulfilled: 'success',
    unfulfilled: 'warning'
  }
  return statusColors[status.toLowerCase()] || 'secondary'
}