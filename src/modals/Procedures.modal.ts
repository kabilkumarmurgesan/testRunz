import { Filters } from ".";

export interface ProceduresRowData {
  is_checked:boolean
  id: string;
  name: string;
  procedureNumber: string;
  procedureDetials:string;
  departmentId:string;
  laboratoryId:string; 
  assestId:string;
  userId:string;
  extraData: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

interface HeaderId {
  is_checked:boolean
    id: string;
    name: string;
    procedureNumber: string;
    procedureDetials:string;
    departmentId:string;
    laboratoryId:string; 
    assestId:string;
    userId:string;
    extraData: string;
    isActive: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface ProceduresHead {
  id: keyof HeaderId;
  label: string;
  filters: Filters[];
  sort: string;
  is_show: boolean;
  type: string;
}