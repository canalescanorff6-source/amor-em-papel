export function filterOrdersForUser<T extends { user_id: string | null }>(orders: T[], userId: string): T[] {
  return orders.filter((order) => order.user_id === userId);
}
