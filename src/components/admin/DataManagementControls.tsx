
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface DataManagementControlsProps {
  onClearImportedData: () => void
  onNavigateToRecordEntry: () => void
  setIsMainCommunityData: (value: boolean) => void
  isMainCommunityData: boolean
}

const DataManagementControls = ({
  onClearImportedData,
  onNavigateToRecordEntry,
  setIsMainCommunityData,
  isMainCommunityData
}: DataManagementControlsProps) => {
  return (
    <div className="flex flex-col gap-4 mb-6 p-4 bg-white dark:bg-black border rounded-xl shadow-card">
      <div className="flex items-center space-x-2">
        <Switch
          id="main-community-data"
          checked={isMainCommunityData}
          onCheckedChange={setIsMainCommunityData}
        />
        <Label htmlFor="main-community-data">Set as main HDSS database</Label>
      </div>
      
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={onClearImportedData}
        >
          Clear Imported Data
        </Button>
        <Button 
          onClick={onNavigateToRecordEntry}
        >
          Add New Record
        </Button>
      </div>
    </div>
  )
}

export default DataManagementControls
