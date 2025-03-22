import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Download, Upload, Save, FileText, Database } from "lucide-react";

interface DataManagementProps {
  roomId?: string;
  roomName?: string;
  onExportData?: () => void;
  onBackupData?: () => void;
  onRestoreData?: () => void;
}

const DataManagement = ({
  roomId = "room-1",
  roomName = "Room 1",
  onExportData = () => console.log("Export data for", roomId),
  onBackupData = () => console.log("Backup data for", roomId),
  onRestoreData = () => console.log("Restore data for", roomId),
}: DataManagementProps) => {
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-800">
          Data Management
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 mb-2">
          Export, backup, or restore data for {roomName}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between pt-0">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-blue-300 hover:bg-blue-50"
          onClick={onExportData}
        >
          <FileText className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-green-300 hover:bg-green-50"
          onClick={onBackupData}
        >
          <Save className="h-4 w-4" />
          <span>Backup</span>
        </Button>

        <Dialog
          open={isRestoreDialogOpen}
          onOpenChange={setIsRestoreDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-amber-300 hover:bg-amber-50"
            >
              <Database className="h-4 w-4" />
              <span>Restore</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restore Data</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to restore data for {roomName}? This will
                overwrite current settings and data.
              </p>
              <div className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Drop backup file here or click to browse
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRestoreDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onRestoreData();
                  setIsRestoreDialogOpen(false);
                }}
              >
                Restore Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default DataManagement;
