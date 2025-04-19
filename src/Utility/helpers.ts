import { environment } from "../environments/environment";

export class Helpers{
      public getFullImageUrl(imagePath: string): string {
        return `${environment.apiUrl}/${imagePath}`;
      }
}