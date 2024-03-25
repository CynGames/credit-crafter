// change to uuidv4
export function GenerateUniqueId() {
  return 'unique-id-' + Math.random().toString(16).substr(4, 10);
}

