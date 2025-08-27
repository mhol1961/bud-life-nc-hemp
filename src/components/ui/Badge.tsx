import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
        secondary: "border-transparent bg-gradient-to-r from-gray-600 to-gray-700 text-white",
        destructive: "border-transparent bg-gradient-to-r from-red-600 to-pink-600 text-white",
        success: "border-transparent bg-gradient-to-r from-emerald-600 to-green-600 text-white",
        warning: "border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white",
        info: "border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
        outline: "border-gray-300 text-gray-700 bg-white",
        ghost: "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200"
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }