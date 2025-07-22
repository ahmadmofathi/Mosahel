export function ExportExcel(File: any, title?: string): void {
  const a = document.createElement('a');
  const objectUrl = URL.createObjectURL(File);
  a.href = objectUrl;
  a.download = `${title}_${new Date().getTime()}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
