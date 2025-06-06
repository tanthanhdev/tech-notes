/**
 * Unit Testing Example with Jest
 *
 * This file demonstrates unit testing principles using Jest for a simple
 * shopping cart implementation.
 */

// ShoppingCart.js - The module we're testing
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    if (!item.id || !item.name || typeof item.price !== 'number' || item.price <= 0) {
      throw new Error('Invalid item format');
    }

    const existingItem = this.items.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      this.items.push({
        ...item,
        quantity: item.quantity || 1
      });
    }

    return this.items;
  }

  removeItem(itemId) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== itemId);

    return initialLength !== this.items.length;
  }

  updateQuantity(itemId, quantity) {
    if (typeof quantity !== 'number' || quantity <= 0) {
      throw new Error('Quantity must be a positive number');
    }

    const item = this.items.find(item => item.id === itemId);

    if (!item) {
      return false;
    }

    item.quantity = quantity;
    return true;
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clear() {
    this.items = [];
  }

  applyDiscount(percentage) {
    if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }

    const discountFactor = 1 - (percentage / 100);
    return this.getTotal() * discountFactor;
  }
}

// ShoppingCart.test.js - Unit tests for the ShoppingCart class
describe('ShoppingCart', () => {
  let cart;

  // Setup - Runs before each test
  beforeEach(() => {
    cart = new ShoppingCart();
  });

  // Test adding items
  describe('addItem', () => {
    test('should add a new item to the cart', () => {
      // Arrange
      const item = { id: '1', name: 'Product 1', price: 10 };

      // Act
      cart.addItem(item);

      // Assert
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toEqual({ id: '1', name: 'Product 1', price: 10, quantity: 1 });
    });

    test('should increase quantity when adding an existing item', () => {
      // Arrange
      const item = { id: '1', name: 'Product 1', price: 10 };

      // Act
      cart.addItem(item);
      cart.addItem(item);

      // Assert
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(2);
    });

    test('should respect the quantity property when provided', () => {
      // Arrange
      const item = { id: '1', name: 'Product 1', price: 10, quantity: 5 };

      // Act
      cart.addItem(item);

      // Assert
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(5);
    });

    test('should throw an error for invalid item format', () => {
      // Arrange
      const invalidItems = [
        { name: 'Missing ID', price: 10 },
        { id: '1', price: 10 },
        { id: '1', name: 'Invalid Price', price: -5 },
        { id: '1', name: 'Invalid Price Type', price: '10' }
      ];

      // Act & Assert
      invalidItems.forEach(item => {
        expect(() => cart.addItem(item)).toThrow('Invalid item format');
      });
    });
  });

  // Test removing items
  describe('removeItem', () => {
    test('should remove an item from the cart', () => {
      // Arrange
      cart.addItem({ id: '1', name: 'Product 1', price: 10 });

      // Act
      const result = cart.removeItem('1');

      // Assert
      expect(result).toBe(true);
      expect(cart.items).toHaveLength(0);
    });

    test('should return false when trying to remove a non-existent item', () => {
      // Act
      const result = cart.removeItem('nonexistent');

      // Assert
      expect(result).toBe(false);
    });
  });

  // Test updating quantities
  describe('updateQuantity', () => {
    test('should update the quantity of an existing item', () => {
      // Arrange
      cart.addItem({ id: '1', name: 'Product 1', price: 10 });

      // Act
      const result = cart.updateQuantity('1', 3);

      // Assert
      expect(result).toBe(true);
      expect(cart.items[0].quantity).toBe(3);
    });

    test('should return false when trying to update a non-existent item', () => {
      // Act
      const result = cart.updateQuantity('nonexistent', 3);

      // Assert
      expect(result).toBe(false);
    });

    test('should throw an error for invalid quantity', () => {
      // Arrange
      cart.addItem({ id: '1', name: 'Product 1', price: 10 });

      // Act & Assert
      expect(() => cart.updateQuantity('1', -1)).toThrow('Quantity must be a positive number');
      expect(() => cart.updateQuantity('1', 'invalid')).toThrow('Quantity must be a positive number');
    });
  });

  // Test calculating totals
  describe('getTotal', () => {
    test('should calculate the total price of all items', () => {
      // Arrange
      cart.addItem({ id: '1', name: 'Product 1', price: 10, quantity: 2 });
      cart.addItem({ id: '2', name: 'Product 2', price: 15, quantity: 1 });

      // Act
      const total = cart.getTotal();

      // Assert
      expect(total).toBe(35); // (10 * 2) + (15 * 1) = 35
    });

    test('should return 0 for an empty cart', () => {
      // Act
      const total = cart.getTotal();

      // Assert
      expect(total).toBe(0);
    });
  });

  // Test item count
  describe('getItemCount', () => {
    test('should return the total number of items in the cart', () => {
      // Arrange
      cart.addItem({ id: '1', name: 'Product 1', price: 10, quantity: 2 });
      cart.addItem({ id: '2', name: 'Product 2', price: 15, quantity: 3 });

      // Act
      const count = cart.getItemCount();

      // Assert
      expect(count).toBe(5); // 2 + 3 = 5
    });

    test('should return 0 for an empty cart', () => {
      // Act
      const count = cart.getItemCount();

      // Assert
      expect(count).toBe(0);
    });
  });

  // Test clearing the cart
  describe('clear', () => {
    test('should remove all items from the cart', () => {
      // Arrange
      cart.addItem({ id: '1', name: 'Product 1', price: 10 });
      cart.addItem({ id: '2', name: 'Product 2', price: 15 });

      // Act
      cart.clear();

      // Assert
      expect(cart.items).toHaveLength(0);
      expect(cart.getTotal()).toBe(0);
    });
  });

  // Test applying discounts
  describe('applyDiscount', () => {
    test('should apply the correct discount to the total', () => {
      // Arrange
      cart.addItem({ id: '1', name: 'Product 1', price: 100 });

      // Act
      const discountedTotal = cart.applyDiscount(20); // 20% discount

      // Assert
      expect(discountedTotal).toBe(80);
    });

    test('should throw an error for invalid discount percentage', () => {
      // Arrange
      cart.addItem({ id: '1', name: 'Product 1', price: 100 });

      // Act & Assert
      expect(() => cart.applyDiscount(-10)).toThrow('Discount percentage must be between 0 and 100');
      expect(() => cart.applyDiscount(110)).toThrow('Discount percentage must be between 0 and 100');
      expect(() => cart.applyDiscount('20')).toThrow('Discount percentage must be between 0 and 100');
    });
  });

  // Integration test for multiple operations
  describe('integration', () => {
    test('should handle a sequence of cart operations correctly', () => {
      // Add items
      cart.addItem({ id: '1', name: 'Product 1', price: 10, quantity: 2 });
      cart.addItem({ id: '2', name: 'Product 2', price: 15 });
      expect(cart.getItemCount()).toBe(3);
      expect(cart.getTotal()).toBe(35);

      // Update quantity
      cart.updateQuantity('2', 3);
      expect(cart.getItemCount()).toBe(5);
      expect(cart.getTotal()).toBe(65); // (10 * 2) + (15 * 3) = 65

      // Remove an item
      cart.removeItem('1');
      expect(cart.getItemCount()).toBe(3);
      expect(cart.getTotal()).toBe(45); // 15 * 3 = 45

      // Apply discount
      const discountedTotal = cart.applyDiscount(10);
      expect(discountedTotal).toBe(40.5); // 45 - 10% = 40.5
    });
  });
});

// Example of using test doubles
describe('ShoppingCart with test doubles', () => {
  // Example of using a spy
  test('should call external service when adding item (spy example)', () => {
    // Arrange
    const notificationService = {
      notifyItemAdded: jest.fn()
    };

    class ShoppingCartWithNotifications extends ShoppingCart {
      addItem(item) {
        const result = super.addItem(item);
        notificationService.notifyItemAdded(item);
        return result;
      }
    }

    const cart = new ShoppingCartWithNotifications();
    const item = { id: '1', name: 'Product 1', price: 10 };

    // Act
    cart.addItem(item);

    // Assert
    expect(notificationService.notifyItemAdded).toHaveBeenCalledWith(item);
  });

  // Example of using a stub
  test('should apply tax rate from tax service (stub example)', () => {
    // Arrange
    const taxServiceStub = {
      getTaxRate: () => 0.1 // 10% tax rate
    };

    class ShoppingCartWithTax extends ShoppingCart {
      constructor(taxService) {
        super();
        this.taxService = taxService;
      }

      getTotalWithTax() {
        const subtotal = this.getTotal();
        const taxRate = this.taxService.getTaxRate();
        return subtotal * (1 + taxRate);
      }
    }

    const cart = new ShoppingCartWithTax(taxServiceStub);
    cart.addItem({ id: '1', name: 'Product 1', price: 100 });

    // Act
    const totalWithTax = cart.getTotalWithTax();

    // Assert
    expect(totalWithTax).toBe(110); // 100 + 10% tax = 110
  });

  // Example of using a mock
  test('should validate inventory before adding item (mock example)', () => {
    // Arrange
    const inventoryServiceMock = {
      checkAvailability: jest.fn()
    };

    class ShoppingCartWithInventory extends ShoppingCart {
      constructor(inventoryService) {
        super();
        this.inventoryService = inventoryService;
      }

      addItemWithInventoryCheck(item) {
        const isAvailable = this.inventoryService.checkAvailability(item.id, item.quantity || 1);
        if (isAvailable) {
          return super.addItem(item);
        }
        throw new Error('Item not available in requested quantity');
      }
    }

    const cart = new ShoppingCartWithInventory(inventoryServiceMock);
    const item = { id: '1', name: 'Product 1', price: 10, quantity: 2 };

    // Setup mock behavior
    inventoryServiceMock.checkAvailability.mockReturnValueOnce(true);

    // Act
    cart.addItemWithInventoryCheck(item);

    // Assert
    expect(inventoryServiceMock.checkAvailability).toHaveBeenCalledWith('1', 2);
  });

  // Example of using a fake
  test('should persist cart items to storage (fake example)', () => {
    // Arrange
    class FakeStorage {
      constructor() {
        this.data = {};
      }

      setItem(key, value) {
        this.data[key] = value;
      }

      getItem(key) {
        return this.data[key] || null;
      }
    }

    class ShoppingCartWithStorage extends ShoppingCart {
      constructor(storage) {
        super();
        this.storage = storage;
        this.loadFromStorage();
      }

      loadFromStorage() {
        const savedItems = this.storage.getItem('cart-items');
        if (savedItems) {
          this.items = JSON.parse(savedItems);
        }
      }

      saveToStorage() {
        this.storage.setItem('cart-items', JSON.stringify(this.items));
      }

      addItem(item) {
        const result = super.addItem(item);
        this.saveToStorage();
        return result;
      }
    }

    const fakeStorage = new FakeStorage();
    const cart = new ShoppingCartWithStorage(fakeStorage);
    const item = { id: '1', name: 'Product 1', price: 10 };

    // Act
    cart.addItem(item);

    // Assert
    expect(JSON.parse(fakeStorage.getItem('cart-items'))).toEqual([
      { id: '1', name: 'Product 1', price: 10, quantity: 1 }
    ]);
  });
});

// Export the ShoppingCart class
module.exports = ShoppingCart;