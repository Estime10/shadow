type LayoutProps = {
  children: React.ReactNode;
};

/**
 * Layout (main) : simple pass-through.
 * La home "/" reste en pleine page (image seule). Header + nav sont dans (lowkey).
 */
export default function MainLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
