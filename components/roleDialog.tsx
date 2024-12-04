"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

const availablePermissions = ["create", "read", "update", "delete"];

export function RoleDialog({ isOpen, onClose, onSave, role = null }: any) {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setPermissions(role.permissions);
    } else {
      setName("");
      setPermissions([]);
    }
    setError(null); // Clear errors when dialog resets
  }, [role]);

  const handlePermissionChange = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = () => {
    if (!name.trim() || permissions.length === 0) {
      setError("Please fill out all fields before saving.");
      return;
    }
    onSave({ id: role ? role.id : null, name, permissions });
    setName("");
    setPermissions([]);
    setError(null);
  };

  const handleDiscard = () => {
    onClose();
    setName("");
    setPermissions([]);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Add Role"}</DialogTitle>
          <DialogDescription>
            {role
              ? "Edit role details and permissions"
              : "Add a new role to the system"}
          </DialogDescription>
                  {error && <div className="text-red-500 col-span-4 text-xs mt-5 text-right">{error}</div>}
        </DialogHeader>
        <div className="grid gap-4 py-1">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Role Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-transparent"
              placeholder="Role name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Permissions</Label>
            <div className="col-span-3 space-y-2">
              {availablePermissions.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={permissions.includes(permission)}
                    onCheckedChange={() => handlePermissionChange(permission)}
                  />
                  <Label htmlFor={permission}>{permission}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="secondary" onClick={handleDiscard}>
            Discard
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
