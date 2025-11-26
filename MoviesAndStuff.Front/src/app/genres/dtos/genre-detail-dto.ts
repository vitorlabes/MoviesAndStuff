export class GenreDetailDto {
  id: number = 0;
  name: string = "";
  order: number = 0;
  isActive: boolean = true;
  createdAt = new Date();
  UpdatedAt = new Date();
  mediaTypes: string[] = [];
}
