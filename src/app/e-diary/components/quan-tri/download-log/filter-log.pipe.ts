import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterLogPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLowerCase();
    // Lọc ở cấp hiện tại
    let filteredItems = items.filter((item) =>
      item.Name.toLowerCase().includes(searchTerm)
    );
    // Lọc đệ quy ở các cấp con
    items.forEach((item) => {
      if (item.Children && item.Children.length > 0) {
        const filteredChildren = this.transform(item.Children, searchTerm);
        if (filteredChildren.length > 0) {
          const existingItem = filteredItems.find(
            (existing) => existing.Name === item.Name
          );
          if (!existingItem) {
            filteredItems.push({
              ...item,
              Children: filteredChildren,
            });
          }
        }
      }
    });

    return filteredItems;
  }
}
