import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      
      // Computed
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItem: (productId) => {
        return get().items.find((item) => item.productId === productId);
      },

      // Actions
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                title: product.title || product.name,
                price: product.price,
                images: product.images || product.ProductImages || [],
                vendorId: product.vendorId,
                vendorName: product.Vendor?.businessName,
                stockQuantity: product.stockQuantity,
                quantity,
              },
            ],
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Check if item can be added (stock validation)
      canAddItem: (product, quantity = 1) => {
        const existingItem = get().getItem(product.id);
        const currentQuantity = existingItem?.quantity || 0;
        return currentQuantity + quantity <= product.stockQuantity;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
