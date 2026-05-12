import { BaseEntity } from './BaseEntity';
import { AreaName } from './Enums';

export interface Area extends BaseEntity {
    name: AreaName;
    description?: string;
}