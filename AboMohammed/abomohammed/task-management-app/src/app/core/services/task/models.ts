export interface TaskDto {
  description: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  tenantId: string;
  employeeIds?: string[];
}

export interface TaskInput {
  //   filterText?: string;
  pageNumber: number;
  pageSize: number;
}
