export class Constants {
    public static readonly PRINT_DATE_FORMAT='dd MMMM yyyy';
    public static formatter = new Intl.NumberFormat('ms-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 2
      })
}