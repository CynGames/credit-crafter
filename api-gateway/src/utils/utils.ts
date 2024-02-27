export function generateUniqueId() {
  return 'unique-id-' + Math.random().toString(16).substr(4, 10);
}
