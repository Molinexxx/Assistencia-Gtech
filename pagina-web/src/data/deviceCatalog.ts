export interface DeviceCatalogItem {
  brand: string
  models: string[]
}

export const deviceCatalog: DeviceCatalogItem[] = [
  { brand: 'Apple', models: ['iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15 Pro Max'] },
  { brand: 'Samsung', models: ['Galaxy A14', 'Galaxy A24', 'Galaxy A34', 'Galaxy A54', 'Galaxy S23'] },
  { brand: 'Motorola', models: ['Moto G32', 'Moto G53', 'Moto G84', 'Edge 30 Neo', 'Edge 40'] },
  { brand: 'Xiaomi', models: ['Redmi Note 11', 'Redmi Note 12', 'Redmi Note 13', 'Poco X5', 'Poco X6'] },
  { brand: 'Realme', models: ['C55', '11x', '12 Pro', 'Narzo 60', 'GT Neo 3'] },
  { brand: 'LG', models: ['K22', 'K52', 'Velvet', 'Wing', 'Q60'] },
]