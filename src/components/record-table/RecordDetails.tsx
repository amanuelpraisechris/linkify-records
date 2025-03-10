
import { Record } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { getDisplayValue } from '@/utils/recordDisplayUtils';
import { getNameField } from '@/utils/nameFieldUtils';

interface RecordDetailsProps {
  record: Record;
  showMatchDetail?: boolean;
}

const RecordDetails = ({ record, showMatchDetail = false }: RecordDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <h4 className="font-medium mb-2 flex items-center">
          <Info className="w-4 h-4 mr-1 text-muted-foreground" />
          Personal Details
        </h4>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Full Name</dt>
          <dd>{getNameField(record, 'firstName')} {getNameField(record, 'middleName')} {getNameField(record, 'lastName')}</dd>
          
          <dt className="text-muted-foreground">Gender</dt>
          <dd>{getDisplayValue(record, 'gender', '-')}</dd>
          
          <dt className="text-muted-foreground">Birth Date</dt>
          <dd>{getDisplayValue(record, 'birthDate', '-')}</dd>
          
          <dt className="text-muted-foreground">Phone</dt>
          <dd>{getDisplayValue(record, 'phoneNumber', '-')}</dd>
        </dl>
      </div>
      
      <div>
        <h4 className="font-medium mb-2 flex items-center">
          <Info className="w-4 h-4 mr-1 text-muted-foreground" />
          Location Details
        </h4>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Village</dt>
          <dd>{getDisplayValue(record, 'village', '-')}</dd>
          
          <dt className="text-muted-foreground">Sub-Village</dt>
          <dd>{getDisplayValue(record, 'subVillage', '-')}</dd>
          
          <dt className="text-muted-foreground">District</dt>
          <dd>{getDisplayValue(record, 'district', '-')}</dd>
          
          <dt className="text-muted-foreground">Household Head</dt>
          <dd>{getDisplayValue(record, 'householdHead', '-')}</dd>
        </dl>
      </div>
      
      {showMatchDetail && record.matchedOn && (
        <div className="md:col-span-2">
          <h4 className="font-medium mb-2 flex items-center">
            <Info className="w-4 h-4 mr-1 text-muted-foreground" />
            Match Details
          </h4>
          <div className="flex flex-wrap gap-2">
            {record.matchedOn.map((field, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {field}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {record.identifiers && record.identifiers.length > 0 && (
        <div className="md:col-span-2">
          <h4 className="font-medium mb-2">Identifiers</h4>
          <div className="flex flex-wrap gap-2">
            {record.identifiers.map((id, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {id.type}: {id.value}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {record.householdMembers && record.householdMembers.length > 0 && (
        <div className="md:col-span-2">
          <h4 className="font-medium mb-2">Household Members</h4>
          <ul className="text-sm space-y-1 pl-5 list-disc">
            {record.householdMembers.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecordDetails;
