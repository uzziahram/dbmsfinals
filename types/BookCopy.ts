export interface BookCopy {
  id: number;
  format: 'hardcopy' | 'softcopy' | string;
  stock: number | null;
  file_path: string | null;
  price: number | string;
}