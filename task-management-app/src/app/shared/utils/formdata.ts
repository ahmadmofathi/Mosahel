export function createFormDataMultiFiles(
  object: { [key: string]: any },
  form?: FormData,
  namespace?: string
): FormData {
  const formData = form || new FormData();
  for (let property in object) {
    if (
      !object.hasOwnProperty(property) ||
      object[property] === undefined ||
      object[property] === null
    ) {
      continue;
    }
    const formKey = namespace ? `${namespace}.${property}` : property;

    if (Array.isArray(object[property])) {
      // Handle array of files or numbers
      object[property].forEach((item: any) => {
        if (item instanceof File) {
          formData.append(formKey, item);
        } else if (typeof item === 'number' || typeof item === 'string') {
          formData.append(formKey, item.toString());
        }
      });
    } else if (object[property] instanceof Date) {
      formData.append(formKey, object[property].toISOString());
    } else if (
      typeof object[property] === 'object' &&
      !(object[property] instanceof File)
    ) {
      createFormDataMultiFiles(object[property], formData, formKey);
    } else {
      formData.append(formKey, object[property]);
    }
  }
  // Log all FormData entries
  // formData.forEach((value, key) => {
  //   console.log(`${key}:`, value);
  // });

  return formData;
}
